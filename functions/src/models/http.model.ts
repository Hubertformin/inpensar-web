import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import {UserBaseDocument} from "./user.model";

export enum ROUTE_ACCESS {
    ADMIN = "admin",
    BASIC = "basic",
}

export enum ROUTE_TYPES {
    ME = "me",
    ADMIN = "admin",
}

export interface HttpRequest extends Request {
    userAgent?: {
        ua: string;
        browser: {
            name?: string;
            version?: string;
            major?: string;
        };
        engine: {
            name?: string;
            version?: string;
        };
        os: {
            name?: string;
            version?: string;
        };
        device: {
            vendor?: string;
            model?: string;
            type?: string;
        };
        cpu: {
            architecture?: string;
        };
    };
    $uid$?: string;
    $currentUser$?: UserBaseDocument;
    $permissionGranted$?: boolean;
    $idToken$?: string;
    $firebaseUser$?: DecodedIdToken;
    $routeType$?: ROUTE_TYPES;
    $access$?: ROUTE_ACCESS;
    $scopes$?: string[];
}
