import {Schema, Document, Types, model} from 'mongoose';
import {UserDocument} from "./user.model";
import {generateUID} from "../utils/uuid";

export interface ProjectBaseDocument {
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



const Project =  model('projects', projectSchema);

export type ProjectDocument = Document<Types.ObjectId> & ProjectBaseDocument;

export default Project;
