import { Connection } from "typeorm";
import { NewTestDB } from "@config/type_orm";
import { Config } from "@config/config";
import { UserService } from "./user_service";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { CreateUserDataTest } from "./user_fixture";

jest.mock("typeorm-transactional-cls-hooked", () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
}));

let testDB: Connection;
let context: TransactionalTestContext;
let userService: UserService;

beforeAll(async () => {
  testDB = await NewTestDB(new Config());
  context = new TransactionalTestContext(testDB);
  await context.start();
  userService = new UserService(testDB);
});

afterAll(async () => {
  if (testDB && context) {
    await context.finish();
    await testDB.close();
  }
});

test("create-user", async () => {
  const user = CreateUserDataTest();
  const createdUser = await userService.Create(user);

  expect(createdUser).not.toEqual(undefined);
  expect(createdUser.password).not.toEqual(user.password);
});

test("update-user", async () => {
  const user = CreateUserDataTest();
  await userService.Create(user);

  const userUpdate = { id: user.id, email: "email@change.com", name: "doe john", password: "password2" };
  const updatedUser = await userService.Update(userUpdate);

  const isUserUpdated = updatedUser.email !== user.email && updatedUser.name !== user.name && updatedUser.password !== user.password;
  expect(isUserUpdated).toBeTruthy();
});

test("find-by-user", async () => {
  const user = CreateUserDataTest();
  const createdUser = await userService.Create(user);

  const retriviedUser = await userService.FindBy("id", createdUser.id);

  expect(retriviedUser).not.toEqual(undefined);
});

test("delete-user", async () => {
  const user = CreateUserDataTest();
  const createdUser = await userService.Create(user);

  try {
    await userService.Delete(createdUser.id);
  } catch (e) {
    throw Error(e);
  }
});

test("login-user", async () => {
  const user = CreateUserDataTest();
  await userService.Create(user);

  const token = await userService.Login(user.email, user.password);

  expect(token).toBeTruthy();
});
