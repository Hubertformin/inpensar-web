import {Schema, model, Document, Types} from "mongoose";
import {ProjectDocument} from "./projects.model";

export enum AccountType {
    CHECKING = "checking",
    LOAN = "loan",
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
    project: ProjectDocument;
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
            type: String,
            default: AccountType.CHECKING,
        },
        photoURL: String,
        project: {
            type: Types.ObjectId,
            ref: 'projects'
        },
        owner: {
            type: Types.ObjectId,
            required: true,
            ref: "users",
        },
    },
    {timestamps: true}
);

const Account = model("accounts", accountSchema);

export type AccountDocument = Document<Types.ObjectId> & AccountBaseDocument;

export default Account;
