import {HttpRequest} from "../models/http.model";
import {NextFunction, Response} from "express";
import Project from "../models/projects.model";

export const withCurrentProject = async (req: HttpRequest, res: Response, next: NextFunction) => {
    try {

        const project = await Project.findOne({ id: req.params.projectId }).exec();

        if (project == null) {
            res.status(404).json({
                errorText: 'The current project was not found',
                message: 'Attempting to add records o existing project',
            });
            return;
        }

        req.$currentProject$ = project;

        next();
    } catch (e) {
        res.status(500).json({
            errorText: 'There was a problem fetching the active project',
            message: 'We could not complete your request, there was a problem fetching the active project',
        })
    }
}
