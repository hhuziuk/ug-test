export class AuthException extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    if (cause && cause.stack) {
      this.stack = cause.stack;
    }
  }
}
