import {Router} from "express";
import {getUserProjectByIdController, getUserProjectCategoriesController} from "../controllers/projects.controller";

const router = Router();

router.get('/:projectId', getUserProjectByIdController);

/**
 * ====== CATEGORIES =======
 *
 */
router.get('/categories/all', getUserProjectCategoriesController);

export default router;