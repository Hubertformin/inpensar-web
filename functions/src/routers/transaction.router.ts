import {Router} from 'express';
import {
    createTransactionController, deleteUserTransactionByIdController,
    getUsersTransactionsController, getUserTransactionByIdController,
    updateUserTransactionByIdController
} from "../controllers/transactions.controller";
import {withCurrentProject} from "../middlewares/projects.middleware";

const TransactionRouter = Router();

TransactionRouter.get('/me', getUsersTransactionsController);

TransactionRouter.get('/:id', getUserTransactionByIdController);

TransactionRouter.post('/', withCurrentProject, createTransactionController);

TransactionRouter.put('/:id', updateUserTransactionByIdController);

TransactionRouter.delete('/:id', deleteUserTransactionByIdController);

export default TransactionRouter;