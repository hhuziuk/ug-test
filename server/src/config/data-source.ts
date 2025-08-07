import { DataSource, DataSourceOptions } from "typeorm";
import * as path from "node:path";

export const PostgresDataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.TYPEORM_SYNC === "true",
  entities: [path.join(__dirname, "/../**/*.orm-entity.{ts,js}")],
  migrations: [path.join(__dirname, "../database/migrations/*.{ts,js}")],
  migrationsTableName: "migrations",
};

export const AppDataSource = new DataSource(PostgresDataSourceOptions);
