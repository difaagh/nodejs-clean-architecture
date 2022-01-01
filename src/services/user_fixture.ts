import { User } from "@model/user";
import { nanoid } from "nanoid";
import { v4 as uuid } from "uuid";

export function CreateUserDataTest(): User {
  const randomStr = nanoid();
  const emailRandom = randomStr.replace("-", "");
  return {
    id: uuid(),
    name: "johnDoe",
    email: `${emailRandom}@email.com`,
    password: "password",
  };
}
