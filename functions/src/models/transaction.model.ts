import { Schema, Types, Document, connection } from "mongoose";
import { CategoryDocument } from "./category.model";
import { AccountDocument } from "./accounts.model";
import { UserDocument } from "./user.model";

interface TransactionBaseDocument {
  _id: string;
  category: CategoryDocument;
  amount: number;
  date: string;
  notes: string;
  type: string;
  attachment: object;
  recurrent: boolean;
  nextRecurrentDate: string;
  recurrentInterval: string;
  recurrentEndDate: string;
  account: AccountDocument;
  owner: UserDocument;
}

const TransactionSchema = new Schema<TransactionBaseDocument>(
  {
    category: {
      type: Object,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    notes: String,
    type: String,
    attachment: Object,
    recurrent: Boolean,
    nextRecurrentDate: String,
    recurrentInterval: String,
    recurrentEndDate: String,
    account: {
      type: Types.ObjectId,
      ref: "accounts",
    },
    owner: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Transaction = db.model("transactions", TransactionSchema);

export type TransactionDocument = Document<Types.ObjectId> &
  TransactionBaseDocument;

export default Transaction;
