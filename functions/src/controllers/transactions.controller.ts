import {createController} from "./index";
import Transaction, {TransactionType} from "../models/transaction.model";
import {CustomError} from "../models/error.model";
import {validateCreateTransaction} from "../validators/transactions.validators";
import Budget, {BudgetDocument} from "../models/budget.model";
import Account, {AccountDocument} from "../models/accounts.model";

export const getUsersTransactionsController = createController(async (req, res) => {
    // get all transactions

    const page: number = parseInt(req.query.page as string) || 1,
        limit: number = parseInt(req.query.limit as string) || 20,
        startIndex = (page - 1) * limit;
    // search = req.query.searchText;

    const count = await Transaction.find({ owner: req.$currentUser$ }).countDocuments().exec();

    const transactions = await Transaction.find({ owner: req.$currentUser$ })
        .skip(startIndex)
        .limit(limit)
        .populate('categories')
        .populate('accounts')
        .exec();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: transactions, count }, message: "" };
});


export const createTransactionController = createController(async (req, res) => {
    const transactionData = await validateCreateTransaction(req.body);
    let budget: any = undefined;
    let accounts: AccountDocument[] = [];

    const transaction = new Transaction({
        ...transactionData,
        owner: req.$currentUser$,
        date: (new Date()).toISOString(),
        project: req.params.projectId
    });
    /**
     * When a transaction is created, the cases apply ->
     *  CASE 1: EXPENSE
     * - Increase the amount spent of the budget which the category of the transaction is included
     * - We decrease the amount from the target wallet
     * CASE 2: Income:
     *  - Increase the amount of the wallet by the transaction amount
     *  CASE 3: TRANSFER
     *  - Subtract the amount from the target wallet and add the amount to the value t0 the destination wallet
     */

    switch(transactionData.type as TransactionType) {
        case TransactionType.EXPENSE:
            budget = await Budget.findOne({ categories: transactionData.category , project: req.params.projectId }).exec() as BudgetDocument;
            if (budget) {
                budget.amountSpent += transactionData.amount;
                await budget.save();
            }

            let expense_account = await Account.findOne({ _id: transactionData.wallet }).exec() as AccountDocument;
            if (expense_account) {
                expense_account.amount -= transactionData.amount;
                await expense_account.save();
                accounts.push(expense_account.toObject());
            }
            break;
        case TransactionType.INCOME:
            let account = await Account.findOne({ _id: transactionData.wallet }).exec() as AccountDocument;
            if (account) {
                account.amount += transactionData.amount;
                await account.save();
                accounts.push(account.toObject());
            }
            break;
        case TransactionType.TRANSFER:
            const from_account = await Account.findOne({ _id: transactionData.from }).exec() as AccountDocument;
            const to_account = await Account.findOne({ _id: transactionData.to }).exec() as AccountDocument;
            from_account.amount -= transactionData.amount;
            to_account.amount += transactionData.amount;
            await from_account.save();
            await to_account.save();

            accounts.push(from_account.toObject());
            accounts.push(to_account.toObject());
            break;
        default:
            break;
    }

    await transaction.save();
    // res.status(200).json({.data, success: true});
    return {
        statusCode: 200,
        data: {
            results: transaction.toObject(),
            ...(typeof budget !== 'undefined' && {budget: budget.toObject()}),
            ...(accounts.length > 0 && {accounts})
        },
        message: ""
    };
});

export const getUserTransactionByIdController = createController(async (req, res) => {

    const transaction = await  Transaction.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!transaction) {
        throw CustomError(
            "Transaction not found"
        ).status(404);
    }

    return { statusCode: 200, data: { results: transaction.toObject() }, message: "" };
});

export const updateUserTransactionByIdController = createController(async (req, res) => {

    const transaction = await  Transaction.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!transaction) {
        throw CustomError(
            "Transaction not found"
        ).status(404);
    }

    // TODO: VALIDATE TRANSACTION Body
    const transactionData = req.body;

    Object.assign(transaction, transactionData);


    await transaction.save();

    return { statusCode: 200, data: { results: transaction.toObject() }, message: "" };
});

export const deleteUserTransactionByIdController = createController(async (req, res) => {

    const transaction = await  Transaction.deleteOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!transaction) {
        throw CustomError(
            "Transaction not found"
        ).status(404);
    }


    return { statusCode: 200, data: { results: req.params.id }, message: "" };
});