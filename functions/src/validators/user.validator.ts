import {InferType, object, string} from "yup";
import {CustomError} from "../models/error.model";

let createUserSchema = object({
    name: string().required(),
    email: string().email(),
    phoneNumber: string().nullable(),
    password: string().required(),
    country: object().nullable(),
    currency: object().nullable(),
});

let createFirebaseUserSchema = object({
    name: string().required(),
    email: string().email(),
    phoneNumber: string().nullable(),
    country: object().nullable(),
    currency: object().nullable(),
});

type UserAccount = InferType<typeof createUserSchema>;

type FirebaseUserAccount = InferType<typeof createFirebaseUserSchema>;

export async function validateCreateUser(
    userData: any
): Promise<UserAccount> {
    try {
        return await createUserSchema.validate(userData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}

export async function validateCreateFirebaseUserData(
    userData: any
): Promise<FirebaseUserAccount> {
    try {
        return await createFirebaseUserSchema.validate(userData);
    } catch (e) {
        throw CustomError(e as any).status(400);
    }
}