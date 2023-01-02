import {Router} from 'express';
import {
    createFirebaseUserData,
    createUserController,
    getCurrentUserController,
    getUserById,
    getUserByUid,
    getUsersController, updateUserController
} from "../controllers/user.controller";

const router = Router();

router.get('/', getUsersController);

router.get('/me', getCurrentUserController);

router
    .route('/uid/:uid')
    .get(getUserByUid)
    .post(createFirebaseUserData)

router.route('/:id')
    .get(getUserById)
    .put(updateUserController)

router.post('/', createUserController);

export default router;