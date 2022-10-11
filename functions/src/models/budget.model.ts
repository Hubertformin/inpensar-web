import {Schema, Document, Types, connection} from 'mongoose';
import {UserDocument} from "./user.model";

export interface BudgetBaseDocument {
    _id?: string;
    name?: string;
    category?: string;
    amount: number;
    photoURL: string;
    owner: UserDocument;

}

const budgetSchema = new Schema<BudgetBaseDocument>({
    name: {
        type: String,
    },
    category: Object,
    amount: {
        type: Number,
        default: 0
    },
    photoURL: String,
    owner: {
        type: Types.ObjectId,
    }
}, {timestamps: true});

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Budget =  db.model('budgets', budgetSchema);

export type BudgetDocument = Document<Types.ObjectId> & BudgetBaseDocument;

export default Budget;
