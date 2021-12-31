import { Connection } from "typeorm";
import { Server } from "http";
import { NewTestDB } from "@config/index";
import { NewHttpRequest } from "@lib/http_request";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { NewServer } from "./server";

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
  const serverTest = await NewServer({
    Transactional: jest.fn(),
    PatchRepository: jest.fn(),
    DataBase: NewTestDB,
  });
  testDB = serverTest.db;
  context = new TransactionalTestContext(testDB);
  await context.start();
  port = serverTest.port;
  host = "http://localhost:" + port;
  server = serverTest.app.listen(port);
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
