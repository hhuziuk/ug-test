import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";

import { UserOrmEntity } from "../entities/user.orm-entity";
import { IUserRepository } from "./user.repository.interface";
import { Email } from "../../../../domain/value-objects/email.vo";
import { User } from "../../../../domain/entities/user.entity";
import { UserNotFoundException } from "../../../exceptions /user-not-found.exception";
import { RefreshTokenNotFoundException } from "../../../exceptions /refresh-token-not-found.exception";
import { PasswordHash } from "../../../../domain/value-objects/password-hash.vo";

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: Email): Promise<User | null> {
    this.logger.debug(`findByEmail: ${email.getValue()}`);
    const user = await this.repo.findOne({ where: { email: email.getValue() } });
    if (!user) {
      this.logger.warn(`User not found by email: ${email.getValue()}`);
      return null;
    }
    return this.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    this.logger.debug(`findById: ${id}`);
    const user = await this.repo.findOne({ where: { id: +id } });
    if (!user) {
      this.logger.warn(`User not found by id: ${id}`);
      return null;
    }
    return this.toDomain(user);
  }

  async create(email: Email, passwordHash: string): Promise<User> {
    this.logger.debug(`create: ${email.getValue()}`);
    const orm = this.repo.create({
      email: email.getValue(),
      passwordHash,
    });
    const saved = await this.repo.save(orm);
    this.logger.log(`User created with id: ${saved.id}`);
    return this.toDomain(saved);
  }

  async setRefreshToken(userId: string, hashedToken: string): Promise<void> {
    this.logger.debug(`setRefreshToken for userId: ${userId}`);
    const result: UpdateResult = await this.repo.update(
      { id: +userId },
      { refreshTokenHash: hashedToken },
    );
    if (result.affected === 0) {
      this.logger.warn(`Cannot set refresh token, user ${userId} not found`);
      throw new UserNotFoundException(userId);
    }
    this.logger.log(`Refresh token set for user ${userId}`);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    this.logger.debug(`removeRefreshToken for userId: ${userId}`);
    const user = await this.repo.findOne({ where: { id: +userId } });
    if (!user) {
      this.logger.warn(`Cannot remove refresh token, user ${userId} not found`);
      throw new UserNotFoundException(userId);
    }
    if (!user.refreshTokenHash) {
      this.logger.warn(`No refresh token to remove for user ${userId}`);
      throw new RefreshTokenNotFoundException();
    }
    user.refreshTokenHash = null;
    await this.repo.save(user);
    this.logger.log(`Refresh token removed for user ${userId}`);
  }

  private toDomain(entity: UserOrmEntity): User {
    const emailVo = new Email(entity.email);
    const pwdHashVo = PasswordHash.fromHashed(entity.passwordHash);
    return new User(entity.id, emailVo, pwdHashVo, entity.createdAt);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    this.logger.debug(`getRefreshToken for userId: ${userId}`);
    const user = await this.repo.findOne({ where: { id: +userId } });
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new UserNotFoundException(userId);
    }
    return user.refreshTokenHash;
  }
}
