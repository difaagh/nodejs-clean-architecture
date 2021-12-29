import * as Jwt from "jsonwebtoken";

export function JwtGenerate(data: any): string {
  return Jwt.sign({ ...data }, process.env.JWT_SECRET || "secret", {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRESIN || "10m",
  });
}

export function JwtValidate(token: string): { valid: boolean; decoded: any } {
  try {
    const splitToken = token.split(" ");
    const _token = splitToken.length > 1 ? splitToken[1] : splitToken[0];
    const decoded = Jwt.verify(_token, process.env.JWT_SECRET || "secret", { algorithms: ["HS256"] });
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, decoded: null };
  }
}
