import { Router } from 'express';
import { IUserRepository } from '../../types/components';
import { UserHandler } from '../handlers/users';
import { safeJSONResponse } from '../../util/express';
import { validatePayload } from '../../util/vaidation';
import { getAllUsersSchema, IGetAllUserPayload } from '../dto/requests/get-all-users';
import { IUserCreatePayload, userCreatePayload } from '../dto/requests/user-create';

export function createUsersRoute(userRepo: IUserRepository): Router {
    const router = Router();

    const userHandler = new UserHandler(userRepo);

    router.post(
        '/',
        safeJSONResponse(async (req) => {
            const validBody: IUserCreatePayload = await validatePayload(req.body, userCreatePayload);

            return userHandler.saveUser(validBody);
        }, 201),
    );

    router.get(
        '/',
        safeJSONResponse(async (req) => {
            const routePayload: IGetAllUserPayload = await validatePayload(
                {
                    created: req.query.created !== undefined,
                    order: req.query.order,
                    pagination: { limit: req.query.limit, page: req.query.page },
                },
                getAllUsersSchema,
            );

            return userHandler.getAllUsers(routePayload);
        }, 200),
    );

    return Router().use('/v1/users', router);
}
