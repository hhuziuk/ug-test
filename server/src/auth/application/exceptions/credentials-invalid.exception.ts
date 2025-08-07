import { ApplicationException } from "./application.exception";

export class CredentialsInvalidException extends ApplicationException {
  constructor(message = "Invalid email or password", cause?: Error) {
    super(message, "CREDENTIALS_INVALID", cause);
    this.name = "CredentialsInvalidException";
  }
}
