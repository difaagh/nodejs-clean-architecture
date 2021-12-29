import { RequestHandler } from "express";

export type IExpressHandlerWrap = typeof ExpressHandlerWrap;

export function ExpressHandlerWrap(controller: RequestHandler): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
}
