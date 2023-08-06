import { Schema } from 'mongoose';
import { IUser } from '../../../types/models';

export const userSchema = new Schema<IUser>({
    id: { type: String, index: true, unique: true },
    firstName: String,
    lastName: String,
    email: { type: String, index: true, unique: true },
    createdAt: { type: Date, index: 1 },
});
