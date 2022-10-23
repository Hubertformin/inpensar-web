import { CategoryModel } from "./category.model";

// interface BudgetCategories extends CategoryModel {
//   amount?: number;
//   percent?: number;
// }
export interface BudgetModel {
  _id?: string;
  name: string;
  categories?: CategoryModel[] | string[];
  amount: number;
  amountSpent: number;
  // recurrence?: string;
  color?: string;
  // nextOccureDate?: string;
  // startDate?: string;
  shouldResetEveryMonth?: boolean;
  // wallet?: WalletModel;
  // photoURL?: string;
  owner?: string;
}
