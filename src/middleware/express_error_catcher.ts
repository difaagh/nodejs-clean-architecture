import { BadRequestError } from "@src/exception/index";
import { Request, Response, NextFunction } from "express";

enum ErrorCodes {
  ERR = "ERROR",
  EV = "EV", // ValidatorError
  EVR = "EVR",
}
export function ExpressErrorCatcher(err: any, req: Request, res: Response, {}: NextFunction) {
  if (err) {
    console.log("@errorCatcher====");
    console.log("url ", req.url);
    console.log("body ", req.body);
    let status = err.status || 500;
    const errorCode = ErrorCodes.ERR;
    const body: {
      _tracer?: any;
      errorCode: string;
      errorDetails?: Array<{
        errorCode: string;
        errorDesc: string;
      }>;
      message: string;
    } = {
      errorCode,
      message: err.message,
    };
    if (err instanceof BadRequestError) {
      status = 400;
      body.errorCode = err.name;
    }
    const customStartTime = Date.now();
    console.log("Headers", req.headers);
    console.log("ResponseCode", status);
    console.log("ResponseBody", body);
    console.log(`${Date.now() - customStartTime}ms`);
    console.log("@=========");
    res.status(status);
    res.send(body);
  }
}
