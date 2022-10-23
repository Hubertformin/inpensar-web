import {Schema, Document, Types, model} from 'mongoose';
import {UserDocument} from "./user.model";
import {CategoryDocument} from "./category.model";
import {getRandomItemFromList} from "../../../utils/array";
import {CONSTANTS} from "../../../data/constants";
import {ProjectDocument} from "./projects.model";
import * as dayjs from "dayjs";

export interface BudgetBaseDocument {
    _id?: string;
    name?: string;
    categories: CategoryDocument[];
    amount: number;
    amountSpent: number;
    activePeriod: string;
    resetsMonthly: boolean;
    color: string;
    photoURL: string;
    project: ProjectDocument;
    owner: UserDocument;

}

function setBudgetDefaultActivePeriod(): string {
    const today = dayjs();
    return (today.month() + 1) + '-' + today.year();
}

export function getActivePeriod(date: string): string {
    const today = dayjs(date);
    return (today.month() + 1) + '-' + today.year();
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
    activePeriod: {
        type: String,
        default: () => setBudgetDefaultActivePeriod()
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
