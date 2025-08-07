import { AuthException } from "./auth.exceptions";

export class RefreshTokenNotFoundException extends AuthException {
  constructor(cause?: Error) {
    super("Refresh token not found", cause);
  }
}
