export class ProjectException extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = new.target.name;
    if (cause && cause.stack) {
      this.stack = cause.stack;
    }
  }
}
