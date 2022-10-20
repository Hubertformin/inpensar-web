import {Router} from "express";
import {getUserProjectByIdController} from "../controllers/projects.controller";

const router = Router();

router.get('/:id', getUserProjectByIdController);

export default router;