import { ObjectSchema } from "types-joi";
import { BadRequestError } from "@exception/bad_request";

export function ValidateSchema<T>(schema: ObjectSchema<T>, val: T) {
  if (!val) {
    throw new BadRequestError("required object", "ERROR_VALIDATION");
  }
  const { error, value } = schema.validate(val);
  return {
    throwErrorIfNeeded: (): T => {
      if (error) {
        throw new BadRequestError(error.message, "ERROR_VALIDATION");
      }
      return value;
    },
  };
}
