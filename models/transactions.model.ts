import {CategoryModel} from "./category.model";
import {AccountsModel} from "./accounts.model";

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER = 'transfer'
}

export interface TransactionsModel {
    _id?: string;
    category?: CategoryModel;
    amount?: number;
    date?: string;
    notes?: string,
    type?: TransactionType,
    attachment?: {
        type: string;
        url: string;
    },
    recurrent?: boolean,
    nextRecurrentDate?: string,
    reccurentInterval?: string,
    recurrentEndDate?: string,
    wallet?: AccountsModel,
    to?: AccountsModel,
    from?: AccountsModel,
    userId?: string
}