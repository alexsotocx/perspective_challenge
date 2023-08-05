import { Schema } from "mongoose";
import { IUser } from "../../types/models";

export const userSchema = new Schema<IUser>({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  createdAt: Date
})
