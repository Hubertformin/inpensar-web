import {Schema, Document, Types, model} from 'mongoose';
import {UserDocument} from "./user.model";
import {CategoryDocument} from "./category.model";
import {getRandomItemFromList} from "../../../utils/array";
import {CONSTANTS} from "../../../data/constants";
import {ProjectDocument} from "./projects.model";

export interface BudgetBaseDocument {
    _id?: string;
    name?: string;
    categories: CategoryDocument[];
    amount: number;
    amountSpent: number;
    resetsMonthly: boolean;
    color: string;
    photoURL: string;
    project: ProjectDocument;
    owner: UserDocument;

}

const budgetSchema = new Schema<BudgetBaseDocument>({
    name: {
        type: String,
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }],
    amount: {
        type: Number,
        default: 0
    },
    resetsMonthly: {
        type: Boolean,
        default: false,
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
    project: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {timestamps: true});



const Budget =  model('budgets', budgetSchema);

export type BudgetDocument = Document<Types.ObjectId> & BudgetBaseDocument;

export default Budget;
