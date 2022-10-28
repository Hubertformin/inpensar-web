import {TransactionsModel, TransactionType} from "../models/transactions.model";

export function formatCurrency(currency: string, amount: number) {
    let value = amount || 0;
    const formatter = new Intl.NumberFormat('en-CM', {
        style: 'currency',
        currency: currency
    });

    return formatter.format(value);
}

export function sumTransactionEarnings(transactions: TransactionsModel[]) {
    const income = transactions.filter(t => t.type === TransactionType.INCOME);
    return income.reduce(function (acc, obj) { return acc + Number(obj.amount); }, 0);
}

export function sumTransactionExpenses(transactions: TransactionsModel[]) {
    const income = transactions.filter(t => t.type === TransactionType.EXPENSE);
    return income.reduce(function (acc, obj) { return acc + Number(obj.amount); }, 0);
}

export function computeTransactionBalance(transactions: TransactionsModel[]) {
    const income = sumTransactionEarnings(transactions);
    const expenses = sumTransactionExpenses(transactions);
    return income - expenses;
}