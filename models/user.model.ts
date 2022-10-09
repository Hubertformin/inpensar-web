export interface UserModel {
    _id: string;
    name: string;
    uid: string,
    email: string,
    phoneNumber: string,
    photoURL: string,
    password: string,
    settings: object;
}