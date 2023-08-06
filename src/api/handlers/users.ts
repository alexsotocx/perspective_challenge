import { IUserGetParams, IUserRepository } from '../../types/components';
import { IUserCreatePayload } from '../dto/requests/user-create';
import { randomUUID } from 'crypto';
import { UserAlreadyExistException } from '../../exceptions';
import { IGetAllUserPayload } from '../dto/requests/get-all-users';
import { IGetAllUsersResponse } from '../dto/responses/get-all-users';
import { IUserResponse } from '../dto/responses/user';
import { userSerializer } from '../dto/serializers/user';
import { logger } from '../../util/logger';

export class UserHandler {
    constructor(private readonly repository: IUserRepository) {}

    async saveUser(payload: IUserCreatePayload): Promise<IUserResponse> {
        const res = await this.repository.getAllUsersPaginated({
            email: [payload.email],
            pagination: { limit: 1, page: 1 },
        });

        if (res.totalItems > 0) throw new UserAlreadyExistException(payload.email);

        const newUser = {
            email: payload.email,
            createdAt: new Date(),
            firstName: payload.firstName,
            lastName: payload.lastName,
            id: randomUUID(),
        };

        logger.debug('Saving into db', { newUser });

        return this.repository.save(newUser).then(userSerializer);
    }

    async getAllUsers(payload: IGetAllUserPayload): Promise<IGetAllUsersResponse> {
        logger.debug('Getting all users with', { payload });
        const order: IUserGetParams['orderBy'] = [];

        if (payload.created) {
            order.push({ key: 'createdAt', direction: 'asc' });
        } else {
            order.push({ key: 'lastName', direction: 'asc' });
        }

        const res = await this.repository.getAllUsersPaginated({
            pagination: payload.pagination,
            orderBy: order,
        });

        return {
            users: res.users.map(userSerializer),
            page: payload.pagination.page,
            limit: payload.pagination.limit,
            totalPages: res.pages,
            totalItems: res.totalItems,
        };
    }
}
