import {Router} from 'express';
import {
    createUserController,
    getCurrentUserController,
    getUserById,
    getUserByUid,
    getUsersController
} from "../controllers/user.controller";

const router = Router();

router.get('/', getUsersController);

router.get('/me', getCurrentUserController);

router.get('/uid/:uid', getUserByUid);

router.get('/:id', getUserById);

router.post('/', createUserController);

export default router;