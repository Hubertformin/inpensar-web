import {Router} from 'express';
import {
    createWalletController,
    deleteWalletController,
    getCurrentUserWallets,
    getWalletController, updateWalletController
} from "../controllers/accounts.controller";

const accountRouter = Router();

accountRouter.get('/me', getCurrentUserWallets);

accountRouter.get('/:id', getWalletController);

accountRouter.post('/', createWalletController);

accountRouter.put('/:id', updateWalletController);

accountRouter.delete('/:id', deleteWalletController);

export default accountRouter;