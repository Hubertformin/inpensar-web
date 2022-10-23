import {InferType, object, string} from "yup";
import {CustomError} from "../models/error.model";

let userSchema = object({
    name: string().required(),
    email: string().email(),
    phoneNumber: string().nullable(),
    password: string().required(),
    country: object().nullable(),
    currency: object().nullable(),
});

type UserAccount = InferType<typeof userSchema>;

export async function validateCreateUser(
    userData: any
): Promise<UserAccount> {
    try {
        return await userSchema.validate(userData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}