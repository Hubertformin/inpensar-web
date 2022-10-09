import {CategoryModel} from "./category.model";
import {WalletModel} from "./wallet.model";

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
    wallet?: WalletModel,
    to?: WalletModel,
    from?: WalletModel,
    userId?: string
}