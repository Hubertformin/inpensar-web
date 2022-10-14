import {BudgetModel} from "../models/budget.model";

export function calculateBudgetBalance(budget: BudgetModel) {
    return Number(budget.amount) - Number(budget.amountSpent);
}

export function calculateBudgetExpenditurePercentage(budget: BudgetModel) {
    let percent = (Number(budget.amountSpent) / Number(budget.amount)) * 100;
    percent = percent > 100 ? 100 : Math.round(percent);
    return percent;
}