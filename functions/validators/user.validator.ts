import {InferType, object, string} from "yup";
import {CustomError} from "../src/models/error.model";

let userSchema = object({
    name: string().required(),
    email: string().email(),
    phoneNumber: string().nullable(),
    password: string().required(),
    country: object().nullable(),
    currency: object().nullable(),
});

type Account = InferType<typeof userSchema>;

export async function validateCreateUser(
    accountData: any
): Promise<Account> {
    try {
        return await userSchema.validate(accountData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}