import { Express } from 'express';
import userRouter from "./user.router";
import projectRouter from "./project.router";
import CategoryRouter from "./category.router";
import {withAuth, withCurrentUser} from "../middlewares/auth.middleware";
import WallerRouter from "./wallet.router";
import TransactionRouter from "./transaction.router";
import budgetRouter from "./budget.router";

export function useControllers(app: Express) {
    // Routes
    app.use(withAuth);

    app.use(withCurrentUser);
    app.use("/users", userRouter);
    app.use("/categories", CategoryRouter);
    app.use("/projects", projectRouter);
    app.use("/projects/:projectId/transactions", TransactionRouter);
    app.use("/projects/:projectId/budgets", budgetRouter);
    app.use("/accounts", WallerRouter);
}