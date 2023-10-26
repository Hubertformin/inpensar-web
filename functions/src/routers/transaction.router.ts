// import {Router} from 'express';
// import {
//     createTransactionController, deleteUserTransactionByIdController,
//     getUsersTransactionsController, getUserTransactionByIdController,
//     updateUserTransactionByIdController
// } from "../controllers/transactions.controller";
// import {withCurrentProject} from "../middlewares/projects.middleware";
//
// const TransactionRouter = Router();
//
// TransactionRouter.get('/me', getUsersTransactionsController);
//
// TransactionRouter.route('/:id')
//     .get(getUserTransactionByIdController)
//     .put(updateUserTransactionByIdController)
//     .delete(deleteUserTransactionByIdController)
//
// TransactionRouter.post('/', withCurrentProject, createTransactionController);
//
// export default TransactionRouter;
