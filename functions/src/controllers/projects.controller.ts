import {createController} from "./index";
import {CustomError} from "../models/error.model";
import Project from "../models/projects.model";
import Category from "../models/category.model";

export const addUserProjectsController = createController(async (req, res) => {
    const {name} = req.body;
    // Create project
    const project = new Project({ name, currency: req.$currentUser$?.settings?.currency, owner: req.$currentUser$?._id});
    await project.save();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: project.toObject() }, message: "" };
});


export const getUserProjectsController = createController(async (req, res) => {
    const page: number = parseInt(req.query.page as string) || 1,
        limit: number = parseInt(req.query.limit as string) || 20,
        startIndex = (page - 1) * limit;
    // search = req.query.searchText;

    const count = await Project.find({ owner: req.$currentUser$ }).countDocuments().exec();

    const projects = await Project.find({ owner: req.$currentUser$ })
        .sort({date: -1})
        .skip(startIndex)
        .limit(limit)
        .exec();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: projects, count }, message: "" };
});

export const getUserProjectByIdController = createController(async (req, res) => {

    const project = await  Project.findOne({ id: req.params.projectId, owner: req.$currentUser$?._id }).exec();

    if (!project) {
        throw CustomError(
            "Project not found"
        ).status(404);
    }

    return { statusCode: 200, data: { results: project.toObject() }, message: "" };
});

export const updateUserProjectByIdController = createController(async (req, res) => {

    const project = await  Project.findOne({ id: req.params.projectId, owner: req.$currentUser$?._id }).exec();

    if (!project) {
        throw CustomError(
            "Project not found"
        ).status(404);
    }

    const projectData = req.body;

    Object.assign(project, projectData);

    await project.save();

    return { statusCode: 200, data: { results: project.toObject() }, message: "" };
});

/**
 * ============== CATEGORIES =============
 *
 */
export const getUserProjectCategoriesController = createController(async (req, res) => {

    const categories = await  Category.find().exec();

    return { statusCode: 200, data: { results: categories }, message: "" };
});
