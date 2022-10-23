import {Schema, Document, Types, connection} from 'mongoose';
import {UserDocument} from "./user.model";
import {generateUID} from "../utils/uuid";

export interface ProjectBaseDocument {
    _id?: string;
    id: string;
    name?: string;
    currency: {
        name: string;
        code: string;
    },
    owner: UserDocument;

}

const projectSchema = new Schema<ProjectBaseDocument>({
    id: {
        type: String,
        unique: true,
        default: () => generateUID("pj"),
    },
    name: {
        type: String,
    },
    currency: {
        name: String,
        code: String
    },
    owner: {
        type: Types.ObjectId,
    }
}, {timestamps: true});

const db = connection.useDb(process.env.DATABASE_NAME as string);

const Project =  db.model('projects', projectSchema);

export type ProjectDocument = Document<Types.ObjectId> & ProjectBaseDocument;

export default Project;
