import Joi from 'joi';
import { ValidationError } from '../exceptions';

export async function validatePayload<T>(data: unknown, schema: Joi.Schema): Promise<T> {
    try {
        return await schema.validateAsync(data, { abortEarly: false, stripUnknown: true });
    } catch (e) {
        throw new ValidationError(e);
    }
}
