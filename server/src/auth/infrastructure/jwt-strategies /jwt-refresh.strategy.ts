import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from "passport-jwt";
import { Request } from "express";
import { RefreshTokenNotFoundException } from "../exceptions /refresh-token-not-found.exception";

export interface JwtRefreshPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: config.get<string>("jwt.refreshSecret")!,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: JwtRefreshPayload) {
    const token = req.body.refreshToken;
    if (!token) {
      throw new RefreshTokenNotFoundException();
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
