

import {InferType, array, boolean, number, object, string} from "yup";
import {CustomError} from "../models/error.model";

let budget = object({
    name: string().required(),
    amount: number().required(),
    resetsMonthly: boolean().default(false),
    categories: array().of(string()).required(),
});

type Budget = InferType<typeof budget>;

export async function validateCreateBudgetData(
    budgetData: any
): Promise<Budget> {
    try {
        return await budget.validate(budgetData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}