import {Schema, model} from 'mongoose';

const reportSchema = new Schema({
    type: String,
    categories: Object,
    totalAmount: Number,
    date: String,
    userId: String
}, {timestamps: true});

export default model('reports', reportSchema);
