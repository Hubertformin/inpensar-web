import { createController } from "./index";
import Account from "../models/accounts.model";
import { CustomError } from "../models/error.model";

export const createWalletController = createController(async (req, res) => {
  // TODO: VALIDATE WALLET BODY
  const walletData = req.body;
  const wallet = new Account({ ...walletData, owner: req.$currentUser$?._id });

  await wallet.save();
  return { statusCode: 200, data: { results: wallet.toObject() }, message: "" };
});

export const getCurrentUserWallets = createController(async (req, res) => {
  const wallets = await Account.find({ owner: req.$currentUser$?._id }).exec();

  return { statusCode: 200, data: { results: wallets }, message: "" };
});

export const getWalletController = createController(async (req, res) => {
  const wallet = await Account.findOne({
    _id: req.params.id,
    owner: req.$currentUser$?._id,
  }).exec();

  if (!wallet) {
    throw CustomError("Wallet not found").status(404);
  }

  return { statusCode: 200, data: { results: wallet.toObject() }, message: "" };
});

export const updateWalletController = createController(async (req, res) => {
  const wallet = await Account.findOne({
    _id: req.params.id,
    owner: req.$currentUser$?._id,
  }).exec();

  if (!wallet) {
    throw CustomError("Wallet not found").status(404);
  }

  // TODO: VALIDATE WALLET BODY
  const walletData = req.body;

  Object.assign(wallet, walletData);

  await wallet.save();

  return { statusCode: 200, data: { results: wallet.toObject() }, message: "" };
});

export const deleteWalletController = createController(async (req, res) => {
  await Account.deleteOne({
    _id: req.params.id,
    owner: req.$currentUser$?._id,
  }).exec();

  return {
    statusCode: 200,
    data: { results: req.params.id },
    message: "Wallet deleted",
  };
});
