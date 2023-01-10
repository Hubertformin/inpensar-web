import {createController} from "./index";
import User from "../models/user.model";
import {validateCreateFirebaseUserData, validateCreateUser} from "../validators/user.validator";
import {getAuth} from "firebase-admin/auth";
import Project from "../models/projects.model";
import {CustomError} from "../models/error.model";

export const getUsersController = createController(async (req, res) => {
    // get all User
    const users = await User.find().exec();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: users }, message: "Users fetched" };
});

export const getCurrentUserController = createController(async (req, res) => {
    // get all User
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: req.$currentUser$ }, message: "User fetched" };
});

export const getUserByUid = createController(async (req, res) => {
    // get all User
    const user = await User
        .findOne({ uid: req.params.uid })
        .populate('wallets')
        .exec();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: user }, message: "User fetched" };
});

/**
 * This controller will be invoked when the firebase user data exist and the data does not exist in the database...
 */
export const createFirebaseUserData = createController(async (req, res) => {

    const userData: any = await validateCreateFirebaseUserData(req.body);
    const user = new User({
        ...userData,
        uid: req.params.uid,
        settings: {
            country: userData.country?.alpha2Code,
            currency: userData.currency?.code || 'XAF',
            language: 'en'
        }
    });

    await user.save();
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: user }, message: "User fetched" };
});

export const getUserById = createController(async (req, res) => {
    // get user
    const user = await User
        .findOne({ uid: req.params.uid })
        .populate('wallets')
        .exec();

    // If user does not exist, return 404
    if (!user) {
        throw CustomError(
            "User not found"
        ).status(404);
    }
    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: { results: user }, message: "User fetched" };
});

export const createUserController = createController(async (req, res) => {

    const userData: any = await validateCreateUser(req.body);
    const user = new User({
        ...userData,
        settings: {
            country: userData.country?.alpha2Code,
            currency: userData.currency?.code || 'XAF',
            language: 'en'
        }
    });
    // create firebase user account
    const userCredential = await getAuth().createUser({
        displayName: userData.name,
        email: userData.email,
        password: userData.password,
        ...(userData.phoneNumber && { phoneNumber: userData.phoneNumber})
    });

    user.uid = userCredential.uid;
    // save user
    await user.save();

    /**
     *
     * Create custom token to be user by the user to sign in
     */
    // const authToken = await getAuth().createCustomToken(userCredential.uid);

    // Create default project for the user
    const project = new Project({ name: 'Personal Finance', currency: userData.currency, owner: user._id});
    await project.save();

    return {
        statusCode: 200,
        data: {
            results: user.toObject(),
            // authToken,
            project: project.toObject()
        },
        message: "Users Created" };
});

export const updateUserController = createController(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        throw CustomError(
            "User not found"
        ).status(404);
    }

    const userData = req.body;

    Object.assign(user, userData);

    // Update firebase info
    if (userData.name) {
        await getAuth().updateUser(user.uid as string, {
            displayName: userData.name
        });
    }


    await user.save();

    // res.status(200).json({.data, success: true});
    return { statusCode: 200, data: user.toObject(), message: "Users Updated" };
});