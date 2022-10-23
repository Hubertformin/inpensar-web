import {model, Schema, Document, Types} from "mongoose";

export interface CategoryBaseDocument {
    name?: string;
    icon?: string;
    type?: string;
    color?: string;
    /**
     *  The scope of people that have access to this category,
     *  or it can be for all or userId (for a specific user)
    **/
    scope?: string;

}

const categorySchema = new Schema<CategoryBaseDocument>({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    color: String,
    scope: String
}, {timestamps: true});



const Category = model('categories', categorySchema);

export type CategoryDocument = Document<Types.ObjectId> & CategoryBaseDocument;

export default Category;