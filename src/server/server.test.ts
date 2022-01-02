import { Connection } from "typeorm";
import { Server } from "http";
import { NewTestDB } from "@src/config/index";
import { NewHttpRequest } from "@src/lib/http_request";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { NewServer } from "./server";
import { UserService } from "@src/services/user_service";
import { CreateUserDataTest } from "@src/services/user_fixture";
import { User } from "@src/model/user";

let testDB: Connection;
let context: TransactionalTestContext;
let server: Server;
let host: string;
let userService: UserService;

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
  userService = new UserService(testDB);
  await context.start();
  host = "http://localhost:" + serverTest.port;
  server = serverTest.app.listen(serverTest.port);
});

afterAll(async () => {
  if (testDB && context && server) {
    await context.finish();
    await testDB.close();
    server.close();
  }
});

describe("user-controller", () => {
  test("user-register", async () => {
    const user = CreateUserDataTest();
    const response = await NewHttpRequest(host, "/api/user/register", "POST", { body: user });

    expect(response.status).toEqual(200);
  });

  test("user-login", async () => {
    const user = CreateUserDataTest();
    const createdUser = await userService.Create(user);

    const response = await NewHttpRequest<{ access_token: string }>(host, "/api/user/login", "POST", {
      body: { email: createdUser.email, password: user.password },
    });
    const isTestSuccess = response.status == 200 && response.data.access_token != "";
    expect(isTestSuccess).toEqual(true);
  });

  test("user-get-all", async () => {
    const user = CreateUserDataTest();
    const [_, __] = await Promise.all([userService.Create(user), userService.Create(CreateUserDataTest())]);

    const responseLogin = await NewHttpRequest<{ access_token: string }>(host, "/api/user/login", "POST", {
      body: { email: user.email, password: user.password },
    });

    const response = await NewHttpRequest<User[]>(host, "/api/users", "GET", {
      headers: { Authorization: `${responseLogin.data.access_token}` },
    });

    const isTestSuccess = response.status == 200 && response.data.length != 0;
    expect(isTestSuccess).toEqual(true);
  });

  test("user-get-by-id", async () => {
    const user = CreateUserDataTest();
    const createdUser = await userService.Create(user);

    const responseLogin = await NewHttpRequest<{ access_token: string }>(host, "/api/user/login", "POST", {
      body: { email: createdUser.email, password: user.password },
    });

    const response = await NewHttpRequest<User>(host, `/api/user/${user.id}`, "GET", {
      headers: { Authorization: `${responseLogin.data.access_token}` },
    });

    const isTestSuccess = response.status == 200 && response.data.id == user.id;
    expect(isTestSuccess).toEqual(true);
  });

  test("user-update", async () => {
    const user = CreateUserDataTest();
    const createdUser = await userService.Create(user);

    const responseLogin = await NewHttpRequest<{ access_token: string }>(host, "/api/user/login", "POST", {
      body: { email: createdUser.email, password: user.password },
    });

    const updatedUser: User = { id: createdUser.id, email: "updated@email.com", password: "password_new", name: "change_name" };

    const response = await NewHttpRequest(host, `/api/user`, "PATCH", {
      body: updatedUser,
      headers: { Authorization: `${responseLogin.data.access_token}` },
    });

    const userAfterUpdated = await NewHttpRequest<User>(host, `/api/user/${user.id}`, "GET", {
      headers: { Authorization: `${responseLogin.data.access_token}` },
    });

    const isTestSuccess =
      response.status == 200 &&
      createdUser.id == userAfterUpdated.data.id &&
      createdUser.name != userAfterUpdated.data.name &&
      createdUser.email != userAfterUpdated.data.email;

    expect(isTestSuccess).toEqual(true);
  });

  test("user-delete", async () => {
    const user = CreateUserDataTest();
    const createdUser = await userService.Create(user);

    const responseLogin = await NewHttpRequest<{ access_token: string }>(host, "/api/user/login", "POST", {
      body: { email: createdUser.email, password: user.password },
    });

    const response = await NewHttpRequest<User>(host, `/api/user/${user.id}`, "DELETE", {
      headers: { Authorization: `${responseLogin.data.access_token}` },
    });

    expect(response.status).toEqual(200);
  });
});
