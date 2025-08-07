import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { CredentialsInvalidException } from "../../auth/application/exceptions/credentials-invalid.exception"; // Перевірте правильність шляху

@Catch(CredentialsInvalidException)
export class CredentialsInvalidFilter implements ExceptionFilter {
  catch(exception: CredentialsInvalidException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
