import * as Joi from "types-joi";
import { v4 as uuid } from "uuid";
import { User } from "@model/user";

export const CreateUserSchema: Joi.ObjectSchema<User> = Joi.object().keys({
  id: Joi.string().default(uuid()),
  name: Joi.string().max(250).required(),
  password: Joi.string().max(250).required(),
  email: Joi.string().email().max(250).required(),
});

export const UpdateUserSchema: Joi.ObjectSchema<User> = Joi.object().keys({
  id: Joi.string().max(36).required(),
  name: Joi.string().max(250),
  password: Joi.string().max(250),
  email: Joi.string().email().max(250),
});

export const LoginUserSchema = Joi.object().keys({
  password: Joi.string().max(250).required(),
  email: Joi.string().email().max(250).required(),
});
