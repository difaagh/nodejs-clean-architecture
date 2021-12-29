import { JwtGenerate, JwtValidate } from "./jwt";

const dataToJwt = {
  name: "John Doe",
  email: "john_doe@email.com",
};

let token = "";

describe("test generate jwt token", () => {
  it("should generate jwt token", (done) => {
    token = JwtGenerate(dataToJwt);
    expect(token).not.toBeNull();
    done();
  });
});

describe("test validate jwt token", () => {
  it("should pass the expected", (done) => {
    const { decoded, valid } = JwtValidate(token);
    expect(decoded).not.toBeNull();
    expect(valid).toBe(true);
    expect(decoded.name).toBe(dataToJwt.name);
    expect(decoded.email).toBe(dataToJwt.email);
    done();
  });
});
