import { AuthException } from "./auth.exceptions";

export class UserNotFoundException extends AuthException {
  constructor(userId: string, cause?: Error) {
    super(`User with id ${userId} not found`, cause);
  }
}
