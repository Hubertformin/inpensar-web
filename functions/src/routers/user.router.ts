import {Router} from 'express';
import {
    createUserController,
    getCurrentUserController,
    getUserById,
    getUserByUid,
    getUsersController, updateUserController
} from "../controllers/user.controller";

const router = Router();

router.get('/', getUsersController);

router.get('/me', getCurrentUserController);

router.get('/uid/:uid', getUserByUid);

router.route('/:id')
    .get(getUserById)
    .put(updateUserController)

router.post('/', createUserController);

export default router;