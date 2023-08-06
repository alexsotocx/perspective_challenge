import { IUser } from '../../../types/models';
import { IUserResponse } from '../responses/user';

export function userSerializer(user: IUser): IUserResponse {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        firstName: user.firstName,
        lastName: user.lastName,
    };
}
