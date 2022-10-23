

import {InferType, number, object, string} from "yup";
import {CustomError} from "../models/error.model";

let wallet = object({
    name: string().required(),
    amount: number().required(),
    type: string().nullable(),
});

type Wallet = InferType<typeof wallet>;

export async function validateCreateWalletData(
    walletData: any
): Promise<Wallet> {
    try {
        return await wallet.validate(walletData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}