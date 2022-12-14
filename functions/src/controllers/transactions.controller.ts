import {createController} from "./index";
import Transaction, {TransactionType} from "../models/transaction.model";
import {CustomError} from "../models/error.model";
import {validateCreateTransaction} from "../validators/transactions.validators";
import Budget, {BudgetDocument, getActivePeriod} from "../models/budget.model";
import Account, {AccountDocument} from "../models/accounts.model";
import {Types} from "mongoose";
import {getStartAndEndDateFromDateFilter} from "../utils/date";

export const getUsersTransactionsController = createController(async (req, res) => {
    // get all transactions

    const page: number = parseInt(req.query.page as string) || 1,
        limit: number = parseInt(req.query.limit as string) || 20,
        startIndex = (page - 1) * limit;
    let startDate: string = req.query.startDate as string || 'all',
        endDate: string = req.query.endDate as string || 'all';
    // search = req.query.searchText;

    /// Create query
    let query: any = {};

    if (req.query.startDate && req.query.endDate) {
        startDate = req.query.startDate as string;
        endDate = req.query.endDate as string;
        query.date = {$gte: startDate, $lt: endDate};

    } else if (req.query.dateFilter && req.query.dateFilter !== 'all') {
        const filter = getStartAndEndDateFromDateFilter(req.query.dateFilter.toString());
        startDate = filter.startDate;
        endDate = filter.endDate;
        query.date = {$gte: startDate, $lt: endDate}

    }

    // if (startDate !== 'all' && endDate !== 'all') {
    //
    //     let start = dayjs(startDate), end = dayjs(endDate);
    //
    //     start = start.startOf('day');
    //     end = end.endOf('day');
    //
    //     query.date = {$gte: start.toISOString(), $lt: end.toISOString()}
    // }

    const count = await Transaction.find({ owner: req.$currentUser$, ...query }).countDocuments().exec();

    const transactions = await Transaction.find({ owner: req.$currentUser$, ...query })
        .sort({date: -1})
        .skip(startIndex)
        .limit(limit)
        .populate('category')
        .populate('account')
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
        owner: req.$currentUser$?._id,
        // date: new Date(transactionData.date),
        project: req.$currentProject$?._id
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
            budget = await Budget.findOne({ categories: new Types.ObjectId(transactionData.category) , project: new Types.ObjectId(req.params.projectId) }).exec() as BudgetDocument;

            if (budget) {
                budget.amountSpent += transactionData.amount;
                await budget.save();
            }

            let expense_account = await Account.findOne({ _id: transactionData.account }).exec() as AccountDocument;
            if (expense_account) {
                /**
                 * The user cannot spend more than is available in a wallet,
                 * Make sure the amount does not exceed the wallet amount
                 */
                expense_account.amount -= transactionData.amount;
                await expense_account.save();
                accounts.push(expense_account.toObject());
            }
            break;
        case TransactionType.INCOME:
            let account = await Account.findOne({ _id: transactionData.account }).exec() as AccountDocument;
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
            ...(!!budget && {budget: budget?.toObject()}),
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

    const transaction = await Transaction.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!transaction) {
        throw CustomError(
            "Transaction not found"
        ).status(404);
    }

    let budget: any = undefined;
    let accounts: AccountDocument[] = [];

    // TODO: VALIDATE TRANSACTION Body
    const transactionData = req.body;

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
            if (transaction.amount != transactionData.amount) {
                budget = await Budget.findOne({ categories: new Types.ObjectId(transactionData.category) , project: new Types.ObjectId(req.params.projectId) }).exec() as BudgetDocument;

                if (budget) {
                    budget.amountSpent += transactionData.amount - transaction.amount;
                    await budget.save();
                }

                let expense_account = await Account.findOne({ _id: transactionData.account }).exec() as AccountDocument;
                if (expense_account) {
                    /**
                     * The user cannot spend more than is available in a wallet,
                     * Make sure the amount does not exceed the wallet amount
                     */
                    expense_account.amount += transaction.amount - transactionData.amount;
                    await expense_account.save();
                    accounts.push(expense_account.toObject());
                }
            }
            break;
        case TransactionType.INCOME:
            if (transaction.amount != transactionData.amount) {
                let account = await Account.findOne({ _id: transactionData.account }).exec() as AccountDocument;
                if (account) {
                    account.amount += transactionData.amount - transaction.amount;
                    await account.save();
                    accounts.push(account.toObject());
                }
            }
            break;
        case TransactionType.TRANSFER:
            if (transaction.amount != transactionData.amount) {
                const from_account = await Account.findOne({ _id: transactionData.from }).exec() as AccountDocument;
                const to_account = await Account.findOne({ _id: transactionData.to }).exec() as AccountDocument;

                from_account.amount += transaction.amount - transactionData.amount;
                to_account.amount += transactionData.amount - transaction.amount;

                await from_account.save();
                await to_account.save();

                accounts.push(from_account.toObject());
                accounts.push(to_account.toObject());
            }
            break;
        default:
            break;
    }

    Object.assign(transaction, transactionData);


    await transaction.save();

    return {
        statusCode: 200,
        data: {
            results: transaction.toObject(),
            ...(!!budget && {budget: budget?.toObject()}),
            ...(accounts.length > 0 && {accounts})
        },
        message: ""
    };
});

export const deleteUserTransactionByIdController = createController(async (req, res) => {

    const transaction = await Transaction.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!transaction) {
        throw CustomError(
            "Transaction not found"
        ).status(404);
    }

    let budget: any = undefined;

    switch(transaction.type as TransactionType) {
        case TransactionType.EXPENSE:
            const period = getActivePeriod(transaction.date);
            const budgets = await Budget.find({
                categories: new Types.ObjectId(transaction.category as unknown as string),
                project: new Types.ObjectId(req.params.projectId),
                activePeriod: period
            })
                .exec();

            for (const _budget of budgets) {
                _budget.amountSpent -= transaction.amount;
                await _budget.save();
                budget = _budget;
            }
            break;
    }

    await transaction.delete();


    return {
        statusCode: 200,
        data: {
            results: req.params.id,
            ...(!!budget && {budget: budget?.toObject()}),
        },
        message: ""
    };
});