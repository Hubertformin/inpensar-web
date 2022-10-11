import {Router} from 'express';
import {
    createBudgetController, deleteUserBudgetController,
    getCurrentUserBudgetsController,
    getUserBudgetByIdController, updateUserBudgetController
} from "../controllers/budget.controller";

const router = Router();

router.get('/me', getCurrentUserBudgetsController);

router.get('/:id', getUserBudgetByIdController);

router.post('/', createBudgetController);

router.put('/:id', updateUserBudgetController);

router.delete('/:id', deleteUserBudgetController);

export default router;