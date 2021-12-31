import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { USER_TABLE } from "@config/constants";

export class userTable1640861583627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: USER_TABLE,
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "email",
            type: "varchar",
            length: "250",
          },
          {
            name: "password",
            type: "varchar",
            length: "250",
          },
          {
            name: "name",
            type: "varchar",
            length: "250",
          },
          {
            name: "created_date",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "updated_date",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(USER_TABLE);
  }
}
