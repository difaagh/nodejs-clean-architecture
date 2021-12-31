import * as env from "dotenv";

process.env.NODE_ENV !== "production" ? env.config() : null;

export type IConfig = Config;
export class Config {
  PORT = process.env.PORT || "3000";
  type = process.env.TYPEORM_TYPE;
  host = process.env.TYPEORM_HOST;
  port = parseInt(process.env.TYPEORM_PORT);
  username = process.env.TYPEORM_USERNAME;
  password = process.env.TYPEORM_PASSWORD;
  database = process.env.TYPEORM_DATABASE;
  TYPEORM_LOGGER = process.env.TYPEORM_LOGGER;
  logging = this.TYPEORM_LOGGER === "all" ? "all" : ("error" as any);
}
