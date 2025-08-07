import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./presentation/controllers/auth.controller";
import { UserOrmEntity } from "./infrastructure/database/postgres/entities/user.orm-entity";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RefreshUseCase } from "./application/use-cases/refresh.use-case";
import { JwtStrategy } from "./infrastructure/jwt-strategies /jwt.strategy";
import { JwtRefreshStrategy } from "./infrastructure/jwt-strategies /jwt-refresh.strategy";
import { IUserRepository } from "./infrastructure/database/postgres/repositories/user.repository.interface";
import { UserRepository } from "./infrastructure/database/postgres/repositories/user.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("jwt.secret")!,
        signOptions: { expiresIn: config.get<string>("jwt.expiresIn") },
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: IUserRepository, useClass: UserRepository },
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
