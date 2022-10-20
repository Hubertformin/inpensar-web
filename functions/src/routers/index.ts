import { Express } from 'express';
import userRouter from "./user.router";
import projectRouter from "./project.router";
import TransactionRouter from "./transaction.router";
import CategoryRouter from "./category.router";
import WallerRouter from "./wallet.router";
import budgetRouter from "./budget.router";
import {withAuth, withCurrentUser} from "../middlewares/auth.middleware";

export function useControllers(app: Express) {
    // Routes
    app.use(withAuth);

    app.use(withCurrentUser);
    app.use("/users", userRouter);
    app.use("/projects", projectRouter);
    app.use("/transactions", TransactionRouter);
    app.use("/categories", CategoryRouter);
    app.use("/wallets", WallerRouter);
    app.use("/budgets", budgetRouter);
}