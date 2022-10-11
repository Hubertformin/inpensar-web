import {Schema, Document, Types, connection} from 'mongoose';
import {UserDocument} from "./user.model";
import {CategoryDocument} from "./category.model";
import {getRandomItemFromList} from "../../../utils/array";
import {CONSTANTS} from "../../../data/constants";

export interface BudgetBaseDocument {
    _id?: string;
    name?: string;
    category?: CategoryDocument[];
    amount: number;
    amountSpent: number;
    color: string;
    photoURL: string;
    owner: UserDocument;

}

const budgetSchema = new Schema<BudgetBaseDocument>({
    name: {
        type: String,
    },
    category: [{
        type: Types.ObjectId,
        ref: 'categories'
    }],
    amount: {
        type: Number,
        default: 0
    },
    amountSpent: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: () => getRandomItemFromList(CONSTANTS.COLORS)
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
