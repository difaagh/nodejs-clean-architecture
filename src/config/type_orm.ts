import { Connection, createConnection } from "typeorm";

interface options {
  type: string;
  host: string;
  port: number;
  logging: boolean;
  username: string;
  password: string;
  database: string;
}

export async function NewTypeOrm(options: options): Promise<Connection> {
  return await createConnection({
    host: options.host,
    port: options.port,
    logging: options.logging,
    database: options.database,
    type: options.type as any,
    entities: ["dist/model/**/!(model.js|*.map)"],
    username: options.username,
    password: options.password,
  });
}

export async function NewTestDB(options: options): Promise<Connection> {
  return await createConnection({
    host: options.host,
    port: options.port,
    logging: options.logging,
    database: options.database,
    type: options.type as any,
    entities: ["src/model/**/!(model.ts)"],
    username: options.username,
    password: options.password,
  });
}
