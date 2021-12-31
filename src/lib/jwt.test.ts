import { JwtGenerate, JwtValidate } from "./jwt";

const dataToJwt = {
  name: "John Doe",
  email: "john_doe@email.com",
};

let token = "";

test("create-jwt-token", () => {
  token = JwtGenerate(dataToJwt);
  expect(token).not.toBeNull();
});

test("validate-jwt-token", () => {
  const { decoded, valid } = JwtValidate(token);
  expect(decoded).not.toBeNull();
  expect(valid).toBe(true);
  expect(decoded.name).toBe(dataToJwt.name);
  expect(decoded.email).toBe(dataToJwt.email);
});
