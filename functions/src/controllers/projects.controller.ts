import {createController} from "./index";
import {CustomError} from "../models/error.model";
import Project from "../models/projects.model";

export const getUserProjectByIdController = createController(async (req, res) => {

    const project = await  Project.findOne({ id: req.params.id, owner: req.$currentUser$?._id }).exec();

    if (!project) {
        throw CustomError(
            "Project not found"
        ).status(404);
    }

    return { statusCode: 200, data: { results: project.toObject() }, message: "" };
});