import { Connection, createConnection } from "typeorm";

interface options {
  type: string;
  host: string;
  port: number;
  logging: "error" | "all";
  username: string;
  password: string;
  database: string;
}

export async function NewTypeOrm(options: options): Promise<Connection> {
  return await createConnection({
    host: options.host,
    port: options.port,
    logging: options.logging === "error" ? ["error"] : ["query", "error"],
    database: options.database,
    type: options.type as any,
    entities: ["dist/model/**/!(index.js|model.js|*.map)"],
    username: options.username,
    password: options.password,
    migrations: ["dist/migrations/**.js"],
    migrationsRun: true,
  });
}

export async function NewTestDB(options: options): Promise<Connection> {
  return await createConnection({
    host: options.host,
    port: options.port,
    logging: options.logging === "error" ? ["error"] : ["query", "error"],
    database: options.database,
    type: options.type as any,
    entities: ["src/model/**/!(index.ts|model.ts)"],
    username: options.username,
    password: options.password,
    migrations: ["src/migrations/**.ts"],
    migrationsRun: true,
  });
}
