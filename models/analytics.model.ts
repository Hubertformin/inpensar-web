import { CategoryModel } from "./category.model";

export interface ReportModel {
    _id?: string;
    type?: string,
    categories?: CategoryModel,
    totalAmount?: number,
    date?: string,
    userId?: string
}