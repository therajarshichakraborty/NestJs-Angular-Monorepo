import { randomUUID } from "node:crypto";

import { createServiceLogger } from "@repo/lib";
import type { QueueMessage, QueueMessageHandler } from "@repo/types";
import { connect } from "amqplib";
import type { ChannelModel, ConfirmChannel, ConsumeMessage } from "amqplib";

import { toDeadLetterQueueName } from "./queue-names";

const DEFAULT_PREFETCH_COUNT = 10;
const JSON_CONTENT_TYPE = "application/json";

export interface RabbitMqClientOptions {
  url: string;
  prefetchCount?: number;
}

export class RabbitMqClient {
  private readonly url: string;
  private readonly prefetchCount: number;
  private readonly logger = createServiceLogger("rabbitmq");
  private readonly assertedQueues = new Set<string>();
  private connection: ChannelModel | null = null;
  private channel: ConfirmChannel | null = null;

  public constructor(options: RabbitMqClientOptions) {
    this.url = options.url;
    this.prefetchCount = options.prefetchCount ?? DEFAULT_PREFETCH_COUNT;
  }

  public async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    const connection = await connect(this.url);
    const channel = await connection.createConfirmChannel();
    await channel.prefetch(this.prefetchCount);

    connection.on("error", (error: Error) => {
      this.logger.error("RabbitMQ connection error", error);
    });

    connection.on("close", () => {
      this.logger.warn("RabbitMQ connection closed");
      this.resetState();
    });

    channel.on("error", (error: Error) => {
      this.logger.error("RabbitMQ channel error", error);
    });

    this.connection = connection;
    this.channel = channel;
    this.logger.info("Connected to RabbitMQ");
  }

  public async assertQueue(queueName: string): Promise<void> {
    if (this.assertedQueues.has(queueName)) {
      return;
    }

    const channel = this.getChannel();
    const deadLetterQueueName = toDeadLetterQueueName(queueName);

    await channel.assertQueue(deadLetterQueueName, { durable: true });
    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: "",
      deadLetterRoutingKey: deadLetterQueueName,
    });

    this.assertedQueues.add(queueName);
  }

  public async publish<TPayload>(queueName: string, type: string, payload: TPayload): Promise<QueueMessage<TPayload>> {
    await this.assertQueue(queueName);

    const message: QueueMessage<TPayload> = {
      id: randomUUID(),
      type,
      payload,
      createdAt: new Date().toISOString(),
    };

    const channel = this.getChannel();

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      contentType: JSON_CONTENT_TYPE,
      messageId: message.id,
      type: message.type,
      timestamp: Date.now(),
    });

    await channel.waitForConfirms();
    this.logger.debug(`Published message to "${queueName}"`, { messageId: message.id, type });

    return message;
  }

  public async consume<TPayload>(queueName: string, handler: QueueMessageHandler<TPayload>): Promise<string> {
    await this.assertQueue(queueName);

    const channel = this.getChannel();

    const reply = await channel.consume(queueName, (rawMessage) => {
      if (rawMessage === null) {
        this.logger.warn(`Consumer for "${queueName}" was cancelled by the broker`);
        return;
      }

      void this.handleMessage(channel, queueName, rawMessage, handler);
    });

    this.logger.info(`Consuming messages from "${queueName}"`);

    return reply.consumerTag;
  }

  public async close(): Promise<void> {
    const connection = this.connection;

    if (!connection) {
      return;
    }

    await this.channel?.close();
    await connection.close();
    this.resetState();
    this.logger.info("RabbitMQ connection closed gracefully");
  }

  private async handleMessage<TPayload>(
    channel: ConfirmChannel,
    queueName: string,
    rawMessage: ConsumeMessage,
    handler: QueueMessageHandler<TPayload>,
  ): Promise<void> {
    try {
      const message = JSON.parse(rawMessage.content.toString("utf8")) as QueueMessage<TPayload>;
      await handler(message);
      channel.ack(rawMessage);
    } catch (error) {
      this.logger.error(`Failed to process message from "${queueName}", moving it to the dead letter queue`, error, {
        messageId: rawMessage.properties.messageId as unknown,
      });
      channel.nack(rawMessage, false, false);
    }
  }

  private getChannel(): ConfirmChannel {
    if (!this.channel) {
      throw new Error("RabbitMQ client is not connected. Call connect() first.");
    }

    return this.channel;
  }

  private resetState(): void {
    this.connection = null;
    this.channel = null;
    this.assertedQueues.clear();
  }
}
