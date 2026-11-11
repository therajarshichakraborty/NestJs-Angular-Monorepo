import type { UserRepository } from "@repo/db";
import {
  ApiError,
  createServiceLogger,
  createUserSchema,
  hashPassword,
  paginationQuerySchema,
  updateUserSchema,
  validate,
} from "@repo/lib";
import { QUEUE_NAMES } from "@repo/queue";
import type { RabbitMqClient } from "@repo/queue";
import type { PaginatedResult, User, UserCreatedEvent } from "@repo/types";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly queueClient: RabbitMqClient;
  private readonly logger = createServiceLogger("user-service");

  public constructor(userRepository: UserRepository, queueClient: RabbitMqClient) {
    this.userRepository = userRepository;
    this.queueClient = queueClient;
  }

  public async register(input: unknown): Promise<User> {
    const validatedInput = validate(createUserSchema, input);
    const existingUser = await this.userRepository.findByEmail(validatedInput.email);

    if (existingUser) {
      throw ApiError.conflict(`A user with the email "${validatedInput.email}" already exists`);
    }

    const createdUser = await this.userRepository.create({
      email: validatedInput.email,
      fullName: validatedInput.fullName,
      passwordHash: await hashPassword(validatedInput.password),
      role: validatedInput.role,
    });

    const event: UserCreatedEvent = {
      userId: createdUser.id,
      email: createdUser.email,
      fullName: createdUser.fullName,
    };

    await this.queueClient.publish(QUEUE_NAMES.USER_CREATED, QUEUE_NAMES.USER_CREATED, event);
    this.logger.info("User registered", { userId: createdUser.id });

    return createdUser;
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw ApiError.notFound(`User "${userId}" was not found`);
    }

    return user;
  }

  public async list(query: unknown): Promise<PaginatedResult<User>> {
    const pagination = validate(paginationQuerySchema, query);
    return this.userRepository.findMany(pagination);
  }

  public async update(userId: string, input: unknown): Promise<User> {
    const changes = validate(updateUserSchema, input);
    const updatedUser = await this.userRepository.update(userId, changes);

    if (!updatedUser) {
      throw ApiError.notFound(`User "${userId}" was not found`);
    }

    this.logger.info("User updated", { userId });
    return updatedUser;
  }

  public async remove(userId: string): Promise<void> {
    const wasDeleted = await this.userRepository.delete(userId);

    if (!wasDeleted) {
      throw ApiError.notFound(`User "${userId}" was not found`);
    }

    this.logger.info("User deleted", { userId });
  }
}
