import { Schema, Document, Types, connection } from "mongoose";
import { AccountDocument } from "./accounts.model";

export enum UserReportsFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export interface UserBaseDocument {
  _id?: string;
  name: string;
  email?: string;
  uid?: string;
  phoneNumber?: string;
  photoURL?: string;
  settings?: {
    country: object;
    city: object;
    currency: string;
    language: string;
    reportsFrequency: UserReportsFrequency;
  };
  accounts: AccountDocument[];
}

const UserSchema = new Schema<UserBaseDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
        type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
        type: String,
      unique: true,
    },
    photoURL: String,
    accounts: [
      {
        type: Types.ObjectId,
        ref: "accounts",
      },
    ],
    settings: {
      country: String,
      city: String,
      currency: String,
      language: String,
      reportsFrequency: {
        type: String,
        default: UserReportsFrequency.WEEKLY,
      },
    },
  },
  { timestamps: true }
);

const db = connection.useDb(process.env.DATABASE_NAME as string);
// 3. Create a Model.
const User = db.model("users", UserSchema);

export type UserDocument = Document<Types.ObjectId> & UserBaseDocument;

export default User;
