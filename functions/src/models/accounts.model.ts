import { Schema, connection, Document, Types } from "mongoose";

export enum AccountType {
  CHECKING = "expense",
  LOAN = "load",
  INVESTMENT = "investment",
  WALLET = "wallet",
  SAVINGS = "savings",
}

export interface AccountBaseDocument {
  _id?: string;
  name: string;
  amount: number;
  type?: AccountType;
  photoURL?: string;
  owner?: Types.ObjectId;
}

const accountSchema = new Schema<AccountBaseDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: AccountType,
      default: AccountType.CHECKING,
    },
    photoURL: String,
    owner: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true }
);

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Account = db.model("accounts", accountSchema);

export type AccountDocument = Document<Types.ObjectId> & AccountBaseDocument;

export default Account;
