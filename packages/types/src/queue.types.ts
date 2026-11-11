import type { IsoDateString, Uuid } from "./common.types";

export interface QueueMessage<TPayload> {
  id: Uuid;
  type: string;
  payload: TPayload;
  createdAt: IsoDateString;
}

export type QueueMessageHandler<TPayload> = (message: QueueMessage<TPayload>) => Promise<void>;

export interface UserCreatedEvent {
  userId: Uuid;
  email: string;
  fullName: string;
}
