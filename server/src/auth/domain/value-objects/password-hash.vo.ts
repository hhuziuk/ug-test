import { randomBytes, scryptSync } from "node:crypto";

export class PasswordHash {
  private constructor(private readonly value: string) {}

  static create(raw: string): PasswordHash {
    if (raw.length < 6) {
      throw new Error("Password too short");
    }
    const salt = randomBytes(16).toString("hex");
    const derived = scryptSync(raw, salt, 64).toString("hex");
    return new PasswordHash(`${salt}:${derived}`);
  }

  static fromHashed(value: string): PasswordHash {
    return new PasswordHash(value);
  }

  getValue(): string {
    return this.value;
  }
}
