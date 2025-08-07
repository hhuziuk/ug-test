import { Email } from "../../../../domain/value-objects/email.vo";
import { User } from "../../../../domain/entities/user.entity";

export const IUserRepository = Symbol("IUserRepository");

export interface IUserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(email: Email, passwordHash: string): Promise<User>;
  setRefreshToken(userId: string, hashedToken: string): Promise<void>;
  removeRefreshToken(userId: string): Promise<void>;
  getRefreshToken(userId: string): Promise<string | null>;
}
