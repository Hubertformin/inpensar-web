import {Data} from "../../data";
import {sortArrayOfObjects} from "../../utils/array";
import Category from "../src/models/category.model";
import {connect} from "mongoose";

async function seedCategories() {
    try {
        const categories = sortArrayOfObjects([...Data.expense_categories, ...Data.income_categories], 'name');
        /**
         * Bulk insert categories
         */
        await connect('mongodb+srv://admin:root@cluster0.tvgbxb3.mongodb.net/test?retryWrites=true&w=majority')

        await Category.deleteMany();
        let index = 0;
        for (const category of categories) {
            ++index;
            const cat = new Category(category);
            await cat.save();

            console.log(index + '/' + categories.length);
        }

    } catch (e) {
        console.log(e);
    }
}

seedCategories();