import { IRouter, RequestHandler } from "express";
import { IExpressHandlerWrap } from "@middleware/express_handler_wrap";
import { UserService } from "@services/user_service";

export function NewUserController(
  router: IRouter,
  handlerWrap: IExpressHandlerWrap,
  authorization: RequestHandler,
  userService: UserService
): IRouter {
  const prefix = "/api";
  router.get(prefix + "/users", authorization, handlerWrap(GetAll(userService)));
  router.get(prefix + "/user/:id", authorization, handlerWrap(GetById(userService)));
  router.post(prefix + "/user/register", handlerWrap(Create(userService)));
  router.patch(prefix + "/user", authorization, handlerWrap(Update(userService)));
  router.delete(prefix + "/user/:id", authorization, handlerWrap(DeleteById(userService)));
  router.post(prefix + "/user/login", handlerWrap(Login(userService)));
  return router;
}

function GetAll(userService: UserService): RequestHandler {
  return async function ({}, res, {}) {
    const user = await userService.GetAll();
    res.status(200).send(user);
  };
}

function GetById(userService: UserService): RequestHandler {
  return async function (req, res, {}) {
    const user = await userService.FindBy("id", req.param["id"]);
    res.status(200).send(user);
  };
}

function Create(userService: UserService): RequestHandler {
  return async function (req, res, {}) {
    const user = await userService.Create(req.body);
    res.status(200).send(user);
  };
}

function Update(userService: UserService): RequestHandler {
  return async function (req, res, {}) {
    const user = await userService.Update(req.body);
    res.status(200).send(user);
  };
}

function DeleteById(userService: UserService): RequestHandler {
  return async function (req, res, {}) {
    const user = await userService.Create(req.param["id"]);
    res.status(200).send(user);
  };
}

function Login(userService: UserService): RequestHandler {
  return async function (req, res, {}) {
    const token = await userService.Login(req.body.email, req.body.password);
    if (!token) {
      res.sendStatus(401);
    }
    res.status(200).send({ access_token: token });
  };
}
