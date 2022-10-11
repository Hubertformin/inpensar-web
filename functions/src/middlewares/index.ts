import {NextFunction, Response} from "express";
import {HttpRequest} from "../models/http.model";

export const excludePaths = (paths: Array<string>, middleware: any) => {
    return (req: HttpRequest, res: Response, next: NextFunction) => {
        const isExcludedPath = paths.some((path) => {
            return req.path.startsWith(path);
        });
        if (isExcludedPath) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};