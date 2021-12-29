import { NextFunction, Request, Response } from "express";
import { JwtValidate } from "@lib/jwt";

export function ExppressAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    res.sendStatus(403);
    return;
  }
  const jwtData = JwtValidate(req.headers.authorization);
  if (!jwtData.valid) {
    res.sendStatus(401);
    return;
  }
  // passing decoded token
  res.locals.authenticated = jwtData.decoded;
  next();
}
