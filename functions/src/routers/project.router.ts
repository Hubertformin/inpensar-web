import {Router} from "express";
import {
    addUserProjectsController,
    getUserProjectByIdController,
    getUserProjectCategoriesController,
    getUserProjectsController, updateUserProjectByIdController
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
import {getProjectReports} from "../controllers/reports.controller";
import {withCurrentProject} from "../middlewares/projects.middleware";

const router = Router();

router.route("/")
    .get(getUserProjectsController)
    .post(addUserProjectsController);

router.route('/:projectId')
    .get(getUserProjectByIdController)
    .put(updateUserProjectByIdController)

/**
 * Reports
 */
router.get('/:projectId/reports/', withCurrentProject, getProjectReports)

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
router.route("/:projectId/transactions/").post(withCurrentProject, createTransactionController);

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
