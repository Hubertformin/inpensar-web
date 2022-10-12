import { connection, Schema, Document, Types } from "mongoose";
import { AccountDocument } from "./accounts.model";

interface SavingsBaseDocument {
  _id?: string;
  date: String;
  account: AccountDocument;
  amount: number;
}

const savingsSchema = new Schema<SavingsBaseDocument>(
  {
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    account: {
      type: Types.ObjectId,
      required: true,
      ref: "wallets",
    },
  },
  { timestamps: true }
);

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Savings = db.model("savings", savingsSchema);

export type SavingsDocument = Document<Types.ObjectId> & SavingsBaseDocument;

export default Savings;
