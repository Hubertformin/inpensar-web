import {createController} from "./index";
import Transaction, {TransactionType} from "../models/transaction.model";

export const getProjectReports = createController(async (req, res) => {
    // Get reports from db
    let analytics: any = {
        earnings: 0,
        expenses: 0,
        balance: 0,
        activity: {
            earnings: [],
            expenses: []
        },
        categories: {
            expenses: [],
            income: []
        }
    }

    const computedTransaction = await Transaction.aggregate([
        {
            $group: {
                _id: {type: "$type"},
                amount: {$sum: "$amount"}
            }

        }
    ]).exec();


    for (const data of computedTransaction) {
        if (data._id.type === TransactionType.EXPENSE) {
            analytics.expenses = data.amount;
            analytics.balance -= data.amount;
        }
        if (data._id.type === TransactionType.INCOME) {
            analytics.earnings = data.amount;
            analytics.balance += data.amount;
        }

    }

    const groupedByDate = await Transaction.aggregate([
        {
            $group: {
                _id: {
                    type: "$type",
                    day: {$dayOfMonth: "$createdAt"},
                    month: {$month: "$createdAt"},
                    year: {$year: "$createdAt"}
                },
                amount: {$sum: "$amount"}
            },
        },
        {$sort: {date: -1}},
        {$limit: 30}
    ]).exec();

    groupedByDate.forEach(data => {
        if (data._id.type === TransactionType.EXPENSE) {
            analytics.activity.expenses.push({
                amount: data.amount,
                date: (new Date(`${data['_id']['year']}-${data['_id']['month']}-${data['_id']['day']}`).toDateString())
            })
        }

        if (data._id.type === TransactionType.INCOME) {
            analytics.activity.earnings.push({
                amount: data.amount,
                date: (new Date(`${data['_id']['year']}-${data['_id']['month']}-${data['_id']['day']}`).toDateString())
            })
        }
    });

    // 2. Categories data
    let categoriesAnalytics = await Transaction.aggregate([
        {
            $group: {
                _id: {categoryId: "$category"},
                amount: {$sum: "$amount"}
            },
        },
        {$lookup: {from: "categories", localField: "_id.categoryId", foreignField: "_id", as: "details"}},
        {$match: {details: {$ne: []}}}
    ]).exec();
    // change structure or categories data
    categoriesAnalytics = categoriesAnalytics.map(c => ({ ...c.details[0], amount: c.amount }));
    // sort by amounts
    categoriesAnalytics.sort((a: any,b: any) => b.amount - a.amount);
    // Split array to array of expense and income categories
    const expense_categories = categoriesAnalytics.filter(c => c['type'] === TransactionType.EXPENSE).slice(0, 5);
    const income_categories = categoriesAnalytics.filter(c => c['type'] === TransactionType.INCOME).slice(0, 5);

    analytics.categories = { expenses: expense_categories, income: income_categories };

    return {
        statusCode: 200,
        data: analytics,
        message: ''
    }
});