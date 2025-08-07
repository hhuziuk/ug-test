import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limiter";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";

import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { validationSchema } from "./config/validation";
import configuration from "./config/config";
import { PostgresDataSourceOptions } from "./config/data-source";
import { ProjectsModule } from "./projects/projects.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    RateLimiterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const rl = cfg.get<{
          keyPrefix: string;
          points: number;
          duration: number;
          errorMessage: string;
        }>("rateLimiter")!;

        return {
          for: "Express",
          type: "Memory",
          keyPrefix: rl.keyPrefix,
          points: rl.points,
          duration: rl.duration,
          errorMessage: rl.errorMessage,
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => PostgresDataSourceOptions,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("REDIS_HOST"),
          port: configService.get<number>("REDIS_PORT"),
        },
      }),
      inject: [ConfigService],
    }),

    HealthModule,
    AuthModule,
    ProjectsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    const logger = new Logger(AppModule.name);
    logger.log("Application Module initialized");
  }
}
