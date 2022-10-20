import {HttpRequest} from "../models/http.model";
import {Response} from "express";

declare type ControllerHandler = (
    req: HttpRequest,
    res: Response
) => Promise<{ statusCode: number; message: string; data: any }>;
interface ControllerReturnProps {
    statusCode: number;
    message: string;
    data: any;
    count?: number;
}

export function createController(controller: ControllerHandler) {
    return async function (req: HttpRequest, res: Response) {
        try {
            const { statusCode, message, data, count }: ControllerReturnProps =
                await controller(req, res);

            return res
                .status(statusCode)
                .json({ message, data: data, ...(count && { count }) });
        } catch (err) {
            console.log(err);
            if ((err as any).code === 11000) {
                const duplicateKeys = Object.keys((err as any).keyPattern);
                return res.status(409).json({
                    message: `The ${duplicateKeys.join(",")} is in use by another user`,
                    errorText: `The ${duplicateKeys.join(",")} is in use by another user`,
                });
            }
            if ((err as any).statusCode) {
                return res.status((err as any).statusCode).json({ message: (err as any).message });
            }
            // Response with status code <500: Internal server error>
            return res.status(500).json({
                message: (err as any).toString(),
                errorText: (err as any).toString(),
            });
        }
    };
}