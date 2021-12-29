import * as express from "express";
import * as cors from "cors";
import { Config, NewTypeOrm } from "@config/index";
import { ExpressHandlerWrap, ExppressAuth, ExpressErrorCatcher } from "@middleware/index";
import { UserService } from "@services/index";
import { NewUserController } from "@controller/index";

export async function NewServer(): Promise<{ app: express.Express; port: string }> {
  const app = express();
  const config = new Config();
  const database = await NewTypeOrm(config);
  const userService = new UserService(database);
  const userController = NewUserController(express.Router(), ExpressHandlerWrap, ExppressAuth, userService);
  app.use(cors());
  app.get("/", ({}, res, {}) => res.sendStatus(200));
  app.use(express.json());
  app.use(userController);
  app.use(ExpressErrorCatcher);

  return { app, port: config.PORT };
}
