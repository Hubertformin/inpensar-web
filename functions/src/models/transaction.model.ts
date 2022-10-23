import {Schema, Types, Document, model} from "mongoose";
import {CategoryDocument} from "./category.model";
import {AccountDocument} from "./accounts.model";
import {UserDocument} from "./user.model";
import {ProjectDocument} from "./projects.model";

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER = 'transfer'
}

interface TransactionBaseDocument {
    _id: string;
    category: CategoryDocument;
    amount: number;
    date: string;
    notes: string;
    type: TransactionType;
    attachment: object;
    recurrent: boolean;
    nextRecurrentDate: string;
    recurrentInterval: string;
    recurrentEndDate: string;
    account: AccountDocument;
    project: ProjectDocument,
    owner: UserDocument;
}

const TransactionSchema = new Schema<TransactionBaseDocument>(
    {
        category: {
            type: Types.ObjectId,
            ref: "categories",
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
        project: {
            type: Types.ObjectId,
            ref: 'projects'
        },
        owner: {
            type: Types.ObjectId,
            ref: "users",
        },
    },
    {timestamps: true}
);



const Transaction = model("transactions", TransactionSchema);

export type TransactionDocument = Document<Types.ObjectId> &
    TransactionBaseDocument;

export default Transaction;
