import { IUserResponse } from './user';

export interface IGetAllUsersResponse {
    users: IUserResponse[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}
