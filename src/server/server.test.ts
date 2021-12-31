import * as express from "express";
import { Connection } from "typeorm";
import * as cors from "cors";
import { Server } from "http";
import { Config, NewTestDB } from "@config/index";
import { ExpressHandlerWrap, ExppressAuth, ExpressErrorCatcher } from "@middleware/index";
import { UserService } from "@services/index";
import { NewUserController } from "@controller/index";
import { NewHttpRequest } from "@lib/http_request";
import { TransactionalTestContext } from "typeorm-transactional-tests";

let testDB: Connection;
let context: TransactionalTestContext;
let server: Server;
let port: string;
let host: string;

jest.mock("typeorm-transactional-cls-hooked", () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
}));

beforeAll(async () => {
  const app = express();
  const config = new Config();
  testDB = await NewTestDB(config);
  context = new TransactionalTestContext(testDB);
  await context.start();
  const userService = new UserService(testDB);
  const userController = NewUserController(express.Router(), ExpressHandlerWrap, ExppressAuth, userService);
  app.use(cors());
  app.get("/", ({}, res, {}) => res.sendStatus(200));
  app.use(express.json());
  app.use(userController);
  app.use(ExpressErrorCatcher);

  const serverTest = app;
  port = config.PORT;
  host = "http://localhost:" + port;
  server = serverTest.listen(port);
});

afterEach(async () => {
  if (testDB && context && server) {
    await context.finish();
    await testDB.close();
    server.close();
  }
});

describe("user-controller", () => {
  test("user-register", async () => {
    const response = await NewHttpRequest(host, "/api/user/register", "POST", {
      body: {
        name: "test",
        email: "test@email.com",
        password: "password",
      },
    });
    expect(response.status).toEqual(200);
  });
});
