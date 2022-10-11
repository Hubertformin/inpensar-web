import {Schema, connection, Document, Types} from 'mongoose';
import {UserBaseDocument} from "./user.model";

export interface WalletBaseDocument {
    _id?: string;
    name: string;
    amount: string;
    photoURL?: string;
    userId: Types.ObjectId;
}

const walletSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    photoURL: String,
    owner: {
        type: Types.ObjectId,
        ref: 'users'
    }
}, {timestamps: true});

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Wallet = db.model('wallets', walletSchema);

export type WalletDocument = Document<Types.ObjectId> & UserBaseDocument;


export default Wallet;
