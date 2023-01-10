import {TransactionsModel, TransactionType} from "../models/transactions.model";

/**
 * The formatCurrency function formats a number into a currency string.
 *
 *
 * @param currency:string Specify the currency code
 * @param amount:number Pass in the amount of money to format
 *
 * @return A string
 *
 * @docauthor Trelent
 */
export function formatCurrency(currency: string, amount: number) {
    let value = amount || 0;
    const formatter = new Intl.NumberFormat('en-CM', {
        style: 'currency',
        currency: currency
    });

    return formatter.format(value);
}

/**
 * The sumTransactionEarnings function sums the amount of all transactions that are income.
 *
 *
 * @param transactions:TransactionsModel[] Store the transactions that are being filtered
 *
 * @return The sum of all the transaction amounts with type = incomes
 *
 * @docauthor Trelent
 */
export function sumTransactionEarnings(transactions: TransactionsModel[]) {
    const income = transactions.filter(t => t.type === TransactionType.INCOME);
    return income.reduce(function (acc, obj) {
        return acc + Number(obj.amount);
    }, 0);
}

/**
 * The sumTransactionExpenses function sums the amount of all expenses in a given array of transactions.
 *
 *
 * @param transactions:TransactionsModel[] Store the transactions that have been fetched from the database
 *
 * @return The sum of the expenses in a given array of transactions
 *
 * @docauthor Trelent
 */
export function sumTransactionExpenses(transactions: TransactionsModel[]) {
    const income = transactions.filter(t => t.type === TransactionType.EXPENSE);
    return income.reduce(function (acc, obj) {
        return acc + Number(obj.amount);
    }, 0);
}

/**
 * The computeTransactionBalance function computes the balance of a list of transactions.
 *
 *
 * @param transactions:TransactionsModel[] Calculate the total amount of money earned and spent in a given period
 *
 * @return The balance of the given transactions
 *
 * @docauthor Trelent
 */
export function computeTransactionBalance(transactions: TransactionsModel[]) {
    const income = sumTransactionEarnings(transactions);
    const expenses = sumTransactionExpenses(transactions);
    return income - expenses;
}