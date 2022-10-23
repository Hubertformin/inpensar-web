import { Express } from 'express';
import userRouter from "./user.router";
import projectRouter from "./project.router";
import CategoryRouter from "./category.router";
import {withAuth, withCurrentUser} from "../middlewares/auth.middleware";
import accountRouter from "./account.router";

export function useControllers(app: Express) {
    // Routes
    app.use(withAuth);

    app.use(withCurrentUser);
    app.use("/users", userRouter);
    app.use("/categories", CategoryRouter);
    app.use("/projects", projectRouter);
    app.use("/accounts", accountRouter);
}