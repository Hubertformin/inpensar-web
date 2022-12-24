import { CategoryModel } from "./category.model";

export interface CategoryAnalytics extends CategoryModel {
    amount: number;
}

export interface AnalyticsModel {
    earnings: number,
    expenses: number,
    balance: number,
    activity: {
        earnings: { amount: number, date: string }[],
        expenses: { amount: number, date: string }[]
    },
    categories: {
        expenses: CategoryAnalytics[],
        income: CategoryAnalytics[]
    }
}