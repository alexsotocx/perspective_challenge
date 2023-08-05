import { IUser } from "../../../types/models";

export interface IGetAllUsersResponse {
  users: IUser[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
