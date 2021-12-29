import { Connection } from "typeorm";
import { UserService } from "./user_service";
import { Config, NewTestDB } from "@config/index";
import { User } from "@model/index";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";
import { runInTransaction } from "typeorm-test-transactions";

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

let db: Connection;
let userService: UserService;

beforeAll(async () => {
  try {
    const config = new Config();
    db = await NewTestDB(config);
    userService = new UserService(db);
  } catch (e) {
    throw Error(e);
  }
});

afterAll(async function () {
  await db.close();
});

test(
  "create user",
  runInTransaction(async () => {
    const user: User = { email: "hallo@email.com", name: "john doe", password: "password" };
    const createdUser = await userService.Create(user);

    expect(createdUser).not.toEqual(undefined);
    expect(createdUser.password).not.toContain(user.password);
  })
);
