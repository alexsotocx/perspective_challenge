import { APIException } from '../exceptions';
import { Handler, Response, Request } from 'express';
import { logger } from "./logger";

export function handleError(error: Error, res: Response) {
    if (error instanceof APIException) {
        res.status(error.statusCode).json({
            error: true,
            error_code: error.code,
            message: error.message,
        });
    } else {
        res.status(500).json({
            error: true,
            error_code: '500',
            message: 'Server error',
        });
    }
    logger.error(error);
}

export function safeJSONResponse(cb: (req: Request) => Promise<unknown>, statusCode = 200): Handler {
    return async (req, res) => {
        try {
            const data = await cb(req);
            res.status(statusCode).json(data);
        } catch (e) {
            handleError(e, res);
        }
    };
}
