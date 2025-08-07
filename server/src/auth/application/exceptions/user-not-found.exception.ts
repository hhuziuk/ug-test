import { ApplicationException } from "./application.exception";

export class UserNotFoundException extends ApplicationException {
  constructor(userId: string, cause?: Error) {
    super(`User with id "${userId}" not found`, "USER_NOT_FOUND", cause);
    this.name = "UserNotFoundException";
  }
}
