import Joi from "joi";

export interface IGetAllUserPayload {
  created?: boolean;
  pagination: { limit: number, page: number },
}

export const getAllUsersSchema = Joi.object<IGetAllUserPayload>({
  created: Joi.boolean(),
  pagination: Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(10),
    page: Joi.number().integer().min(1).default(1),
  }).default({ limit: 10, page: 1 })
})
