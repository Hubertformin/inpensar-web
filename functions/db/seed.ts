import {Data} from "../../data";
import {sortArrayOfObjects} from "../../utils/array";
import Category from "../src/models/category.model";

export async function seedCategories() {
    try {
        const categories = sortArrayOfObjects([...Data.expense_categories, ...Data.income_categories], 'name');
        /**
         * Bulk insert categories
         */
        await Category.insertMany(categories);
    } catch (e) {
        console.log(e);
    }
}