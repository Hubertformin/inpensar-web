import {Router} from "express";
import {
    getUserProjectByIdController,
    getUserProjectCategoriesController,
    getUserProjectsController
} from "../controllers/projects.controller";
import {
    createBudgetController, deleteUserBudgetController,
    getCurrentUserBudgetsController,
    getUserBudgetByIdController, updateUserBudgetController
} from "../controllers/budget.controller";
import {
    createTransactionController, deleteUserTransactionByIdController,
    getUsersTransactionsController,
    getUserTransactionByIdController, updateUserTransactionByIdController
} from "../controllers/transactions.controller";

const router = Router();

router.get('/', getUserProjectsController);

router.get('/:projectId', getUserProjectByIdController);

/**
 * Budgets
 */
router.route("/:projectId/budgets/").post(createBudgetController);

router.route("/:projectId/budgets/me").get(getCurrentUserBudgetsController);

router.route("/:projectId/budgets/:id")
    .get(getUserBudgetByIdController)
    .put(updateUserBudgetController)
    .delete(deleteUserBudgetController);

/**
 * Transactions
 */
router.route("/:projectId/transactions/").post(createTransactionController);

router.route("/:projectId/transactions/me").get(getUsersTransactionsController);

router.route("/:projectId/transactions/:id")
    .get(getUserTransactionByIdController)
    .put(updateUserTransactionByIdController)
    .delete(deleteUserTransactionByIdController);
/**
 * ====== CATEGORIES =======
 *
 */
router.get('/categories/all', getUserProjectCategoriesController);

export default router;