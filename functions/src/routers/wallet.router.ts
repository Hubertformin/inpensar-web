import {Router} from 'express';
import {
    createWalletController,
    deleteWalletController,
    getCurrentUserWallets,
    getWalletController, updateWalletController
} from "../controllers/wallet.controller";

const WallerRouter = Router();

WallerRouter.get('/me', getCurrentUserWallets);

WallerRouter.get('/:id', getWalletController);

WallerRouter.post('/', createWalletController);

WallerRouter.put('/:id', updateWalletController);

WallerRouter.delete('/:id', deleteWalletController);

export default WallerRouter;