import { Email } from "../value-objects/email.vo";
import { PasswordHash } from "../value-objects/password-hash.vo";

export class User {
  constructor(
    public readonly id: number,
    public readonly email: Email,
    public readonly passwordHash: PasswordHash,
    public readonly createdAt: Date,
  ) {}

  static register(email: Email, passwordHash: PasswordHash): User {
    return new User(0, email, passwordHash, new Date());
  }
}
