import {createController} from "./index";
import Transaction from "../models/transaction.model";
import {CustomError} from "../models/error.model";

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
        .exec();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: transactions, count }, message: "" };
});


export const createTransactionController = createController(async (req, res) => {
   // TODO: VALIDATE TRANSACTION Body
    const transactionData = req.body;

    const transaction = new Transaction({ ...transactionData, owner: req.$currentUser$ });

    await transaction.save();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: transaction.toObject(), }, message: "" };
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