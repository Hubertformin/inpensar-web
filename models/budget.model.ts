import { CategoryModel } from "./category.model";
import { WalletModel } from "./wallet.model";


interface BudgetCategories extends CategoryModel {
    amount?: number;
    percent?: number;
}
export interface BudgetModel {
    _id?: string;
    name: string,
    categories?: BudgetCategories[] | string[],
    amount: number;
    amountSpent: number;
    recurrence?: string;
    nextOccureDate?: string;
    startDate?: string;
    wallet?: WalletModel;
    photoURL?: string;
    userId?: string;

}