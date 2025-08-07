import { Inject, Injectable } from "@nestjs/common";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { IUserRepository } from "../../infrastructure/database/postgres/repositories/user.repository.interface";
import { Tokens } from "../../domain/interfaces /tokens.interface";
import { RefreshDto } from "../dto/refresh.dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { CredentialsInvalidException } from "../exceptions/credentials-invalid.exception";

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(IUserRepository) private readonly users: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: RefreshDto): Promise<Tokens> {
    const { userId, refreshToken } = dto;
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundException(userId);

    const stored = await this.users.getRefreshToken(userId);
    if (!stored) throw new CredentialsInvalidException();

    const [salt, storedHash] = stored.split(":");
    const derived = scryptSync(refreshToken, salt, 64).toString("hex");
    if (!timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(derived, "hex"))) {
      throw new CredentialsInvalidException();
    }

    const payload = { sub: user.id.toString(), email: user.email.getValue() };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("jwt.secret"),
      expiresIn: this.config.get<string>("jwt.expiresIn"),
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("jwt.refreshSecret"),
      expiresIn: this.config.get<string>("jwt.refreshExpiresIn"),
    });

    const newSalt = randomBytes(16).toString("hex");
    const newHash = scryptSync(newRefreshToken, newSalt, 64).toString("hex");
    await this.users.setRefreshToken(userId, `${newSalt}:${newHash}`);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
