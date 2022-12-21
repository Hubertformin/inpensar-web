import {HttpRequest} from "../models/http.model";
import {NextFunction, Response} from "express";
import {getAuth} from "firebase-admin/auth";
import User from "../models/user.model";

export const withAuth = async (req: HttpRequest, res: Response, next: NextFunction) => {
    try {
        // if route is create account ignore
        if (req.path.startsWith('/users') && req.method.toLowerCase() == 'post') {
            next();
            return;
        }

        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                errorText: 'You are not authorized to access this API',
                message: 'You are not authorized to access this API',
            })
        }

        let idToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1];

        } else {
            // No cookie
            return res.status(401).json({
                errorText: 'You are not authorized to access this API',
                message: 'You are not authorized to access this API',
            });
        }

        try {
            req.$firebaseUser$ = await getAuth().verifyIdToken(idToken);
            next();
            return;
        } catch (error) {
            console.error(error)
            return res.status(401).json({
                errorText: (error as any).toString(),
                message: 'You are not authorized to access this API',
            })
        }
    } catch (error) {
        return res.status(401).json({
            errorText: (error as any).toString(),
            message: 'You are not authorized to access this API',
        })
    }
};

export const withCurrentUser = async (req: HttpRequest, res: Response, next: NextFunction) => {
    try {

        // if route is create account ignore
        if (req.path.startsWith('/users') && req.method.toLowerCase() == 'post') {
            next();
            return;
        }

        const user = await User.findOne({ uid: req.$firebaseUser$?.uid });

        if (user == null) {
            res.status(404).json({
                errorText: "User's record not found",
                message: 'You are not authorized to access this API',
            });
            return;
        }

        req.$currentUser$ = user;

        next();
    } catch (e) {
        res.status(401).json({
            errorText: 'You are not authorized to access this API',
            message: 'You are not authorized to access this API',
        })
    }
}