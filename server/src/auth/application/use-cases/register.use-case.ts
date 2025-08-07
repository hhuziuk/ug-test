import { Inject, Injectable } from "@nestjs/common";

import { IUserRepository } from "../../infrastructure/database/postgres/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { PasswordHash } from "../../domain/value-objects/password-hash.vo";
import { Email } from "../../domain/value-objects/email.vo";
import { CredentialsInvalidException } from "../exceptions/credentials-invalid.exception";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly users: IUserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const email = new Email(dto.emailRaw);
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new CredentialsInvalidException("Email already in use");
    }

    const passwordHash = PasswordHash.create(dto.passwordRaw);

    const user = await this.users.create(email, passwordHash.getValue());
    return user;
  }
}
