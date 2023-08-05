import Joi from "joi";

export interface IUserCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
}

export const userCreatePayload = Joi.object<IUserCreatePayload>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
})
