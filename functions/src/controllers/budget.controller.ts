import {createController} from "./index";
import {CustomError} from "../models/error.model";
import Budget from "../models/budget.model";

export const createBudgetController = createController(async (req, res) => {
    // TODO: VALIDATE budget BODY
    // TODO: Make sure categories doen't exist in another budget
    const budgetData = req.body;
    const budget = new Budget({ ...budgetData, owner: req.$currentUser$?._id });

    await budget.save();
    return { statusCode: 200, data: { results: budget.toObject() }, message: "" };
});

export const getCurrentUserBudgetsController = createController(async (req, res) => {
    const page: number = parseInt(req.query.page as string) || 1,
        limit: number = parseInt(req.query.limit as string) || 20,
        startIndex = (page - 1) * limit;
        // search = req.query.searchText;

    const count = await Budget.find({ owner: req.$currentUser$ }).countDocuments().exec();

    const budgets = await Budget
        .find({  owner: req.$currentUser$?._id })
        .skip(startIndex)
        .limit(limit)
        .exec();

    return { statusCode: 200, data: { results: budgets, count }, message: "" };
});

export const getUserBudgetByIdController = createController(async (req, res) => {

    const budget = await  Budget.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!budget) {
        throw CustomError(
            "Budget not found"
        ).status(404);
    }

    return { statusCode: 200, data: { results: budget.toObject() }, message: "" };
});

export const updateUserBudgetController = createController(async (req, res) => {

    const budget = await Budget.findOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!budget) {
        throw CustomError(
            "Budget not found"
        ).status(404);
    }

    // TODO: VALIDATE budget BODY
    const budgetData = req.body;

    Object.assign(budget, budgetData);


    await budget.save();

    return { statusCode: 200, data: { results: budget.toObject() }, message: "" };
});


export const deleteUserBudgetController = createController(async (req, res) => {

     await Budget.deleteOne({ _id: req.params.id, owner: req.$currentUser$?._id }).exec();



    return { statusCode: 200, data: { results: req.params.id }, message: "" };
});