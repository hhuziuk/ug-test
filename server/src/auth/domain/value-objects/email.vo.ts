export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    this.value = email.toLowerCase().trim();
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

  private static isValid(email: string): boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === "string" && EMAIL_REGEX.test(email);
  }
}
