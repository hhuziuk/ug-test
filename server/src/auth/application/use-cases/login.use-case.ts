import { Inject, Injectable } from "@nestjs/common";
import { scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { IUserRepository } from "../../infrastructure/database/postgres/repositories/user.repository.interface";
import { Tokens } from "../../domain/interfaces /tokens.interface";
import { Email } from "../../domain/value-objects/email.vo";
import { LoginDto } from "../dto/login.dto";
import { CredentialsInvalidException } from "../exceptions/credentials-invalid.exception";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository) private readonly users: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: LoginDto): Promise<Tokens> {
    const email = new Email(dto.email);
    const user = await this.users.findByEmail(email);
    if (!user) throw new CredentialsInvalidException();

    const [salt, storedHash] = user.passwordHash.getValue().split(":");
    const derived = scryptSync(dto.password, salt, 64).toString("hex");
    if (!timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(derived, "hex"))) {
      throw new CredentialsInvalidException();
    }

    const payload = { sub: user.id.toString(), email: email.getValue() };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("jwt.secret"),
      expiresIn: this.config.get<string>("jwt.expiresIn"),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("jwt.refreshSecret"),
      expiresIn: this.config.get<string>("jwt.refreshExpiresIn"),
    });

    const refreshSalt = randomBytes(16).toString("hex");
    const refreshHash = scryptSync(refreshToken, refreshSalt, 64).toString("hex");
    await this.users.setRefreshToken(user.id.toString(), `${refreshSalt}:${refreshHash}`);

    return { accessToken, refreshToken };
  }
}
