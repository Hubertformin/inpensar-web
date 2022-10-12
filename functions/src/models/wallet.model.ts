import { Schema, connection, Document, Types } from "mongoose";

export enum WalletType {
  EXPENSE = "expense",
  SAVINGS = "savings",
}

export interface WalletBaseDocument {
  _id?: string;
  name: string;
  amount: number;
  type?: WalletType;
  photoURL?: string;
  owner?: Types.ObjectId;
}

const walletSchema = new Schema<WalletBaseDocument>(
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
      type: WalletType,
      default: WalletType.EXPENSE,
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

const Wallet = db.model("wallets", walletSchema);

export type WalletDocument = Document<Types.ObjectId> & WalletBaseDocument;

export default Wallet;
