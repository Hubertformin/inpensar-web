import {HttpRequest} from "../models/http.model";
import {NextFunction, Response} from "express";
import {getAuth} from "firebase-admin/auth";
import User from "../models/user.model";

export const withAuth = async (req: HttpRequest, res: Response, next: NextFunction) => {
    try {
        // if route is create account ignore
        if (req.path.startsWith('/users') && req.method.toLowerCase() == 'post') {
            next()
        }

        if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
            !(req.cookies && req.cookies.__session)) {
            return res.status(401).json({
                errorText: 'You are not authorized to access this API',
                message: 'You are not authorized to access this API',
            })
        }

        let idToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else if(req.cookies) {
            // Read the ID Token from cookie.
            idToken = req.cookies.__session;
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
            return res.status(401).json({
                errorText: 'You are not authorized to access this API',
                message: 'You are not authorized to access this API',
            })
        }
    } catch (e) {
        return res.status(401).json({
            errorText: 'You are not authorized to access this API',
            message: 'You are not authorized to access this API',
        })
    }
};

export const withCurrentUser = async (req: HttpRequest, res: Response, next: NextFunction) => {
    try {

        // if route is create account ignore
        if (req.path.startsWith('/users') && req.method.toLowerCase() == 'post') {
            next()
        }

        const user = await User.findOne({ uid: req.$currentUser$?.uid });

        if (user == null) {
            res.status(401).json({
                errorText: 'You are not authorized to access this API',
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