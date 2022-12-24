import {TransactionType} from "../models/transaction.model";

import {InferType, mixed, number, object, string} from "yup";
import {CustomError} from "../models/error.model";

let transactions = object({
    amount: number().required(),
    notes: string().nullable(),
    // category: array().of(string()).required(),
    category: string().required(),
    type: mixed().oneOf(Object.values(TransactionType)).required(),
    account: string().nullable(),
    date: string().required(),
    to: string().nullable(),
    from: string().nullable()
});

type Transaction = InferType<typeof transactions>;

export async function validateCreateTransaction(
    transactionData: any
): Promise<Transaction> {
    try {
        return await transactions.validate(transactionData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}