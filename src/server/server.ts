import * as express from "express";
import * as cors from "cors";
import { Connection } from "typeorm";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";
import { Config, NewTypeOrm } from "@src/config/index";
import { ExpressHandlerWrap, ExppressAuth, ExpressErrorCatcher } from "@src/middleware/index";
import { UserService } from "@src/services/index";
import { NewUserController } from "@src/controller/index";

type Server = { app: express.Express; port: string; db: Connection };

type DI = {
  Transactional: typeof initializeTransactionalContext;
  PatchRepository: typeof patchTypeORMRepositoryWithBaseRepository;
  DataBase: typeof NewTypeOrm;
};

export async function NewServer(_: DI): Promise<Server> {
  _.Transactional();
  _.PatchRepository();

  const app = express();
  const config = new Config();
  const database = await _.DataBase(config);
  const userService = new UserService(database);
  const userController = NewUserController(express.Router(), ExpressHandlerWrap, ExppressAuth, userService);
  app.use(cors());
  app.get("/", ({}, res, {}) => res.sendStatus(200));
  app.use(express.json());
  app.use(userController);
  app.use(ExpressErrorCatcher);

  return { app, port: config.PORT, db: database };
}
