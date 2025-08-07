import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Migrations1754501340828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projects",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "int",
          },
          {
            name: "repo_path",
            type: "varchar",
            length: "255",
          },
          {
            name: "url",
            type: "varchar",
            length: "512",
          },
          {
            name: "stars",
            type: "int",
            default: 0,
          },
          {
            name: "forks",
            type: "int",
            default: 0,
          },
          {
            name: "issues",
            type: "int",
            default: 0,
          },
          {
            name: "created_at",
            type: "bigint",
            default: `EXTRACT(EPOCH FROM NOW())::bigint`,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "projects",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("projects");
    const fk = table!.foreignKeys.find((fk) => fk.columnNames.indexOf("user_id") !== -1);
    if (fk) {
      await queryRunner.dropForeignKey("projects", fk);
    }

    await queryRunner.dropTable("projects");
  }
}
