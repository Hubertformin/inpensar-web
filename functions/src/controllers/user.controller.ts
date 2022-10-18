import {createController} from "./index";
import User from "../models/user.model";
import {validateCreateUser} from "../../validators/user.validator";
import {getAuth} from "firebase-admin/auth";
import Project from "../models/projects.model";

export const getUsersController = createController(async (req, res) => {
    // get all User
    const users = await User.find().exec();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: users }, message: "Users fetched" };
});

export const getCurrentUserController = createController(async (req, res) => {
    // get all User
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: req.$currentUser$ }, message: "User fetched" };
});

export const getUserByUid = createController(async (req, res) => {
    // get all User
    const user = await User
        .findOne({ uid: req.params.uid })
        .populate('wallets')
        .exec();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: user }, message: "User fetched" };
});

export const getUserById = createController(async (req, res) => {
    // get all User
    const user = await User
        .findOne({ uid: req.params.uid })
        .populate('wallets')
        .exec();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data: { results: user }, message: "User fetched" };
});

export const createUserController = createController(async (req, res) => {

    const userData = await validateCreateUser(req.body);
    const user = new User({
        ...userData,
        settings: {
            country: userData.country?.alpha2Code,
            currency: userData.currency?.code,
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
    const authToken = await getAuth().createCustomToken(userCredential.uid);

    // Create default project for the user
    const project = new Project({ name: 'Personal Finance', currency: userData.currency, owner: user._id});
    await project.save();

    return {
        statusCode: 200,
        data: {
            results: user.toObject(),
            authToken,
            project: project.toObject()
        },
        message: "Users Created" };
});

export const updateUserController = createController(async (req, res) => {
    // get all User
    const data = await User.find();
    // res.status(200).json({data, success: true});
    return { statusCode: 200, data, message: "Users Updated" };
});