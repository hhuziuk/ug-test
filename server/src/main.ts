import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { Logger, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { setupSwagger } from "./shared/swagger/swagger";
import { AppDataSource } from "./config/data-source";
import logger, { setConsoleLogs, setFileLogs, setMetricsLogs } from "./shared/logger/logger";
import {CredentialsInvalidFilter} from "./shared/filters/credentials-invalid.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");
  const config = app.get(ConfigService);

  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    logger.log("Migrations executed successfully");
  } catch (err) {
    logger.error("Migration failed", err);
    process.exit(1);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CredentialsInvalidFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const corsOpts = config.get<object>("cors", { infer: true });
  app.enableCors(corsOpts);

  setupSwagger(app);

  const port = config.get<number>("port") as number;
  const host = config.get<string>("host") as string;
  try {
    await app.listen(port, host);
    logger.log(`Application running at http://${host}:${port}`);
  } catch (err) {
    logger.error("Error starting app", err);
    process.exit(1);
  }
}

(async () => {
  setFileLogs(logger, "./logs");
  setMetricsLogs(logger, "./metrics");
  setConsoleLogs(logger);

  await bootstrap();
})();
