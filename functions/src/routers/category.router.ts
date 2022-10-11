import {Router} from 'express';
import Category from '../models/category.model';

const CategoryRouter = Router();

CategoryRouter.get('/', async (req, res) => {
    // get all users
    try {
    
        const data = await Category.find();

        res.status(200).json({data, success: true});

    } catch (e: any) {
        res.status(500).json({message: e.toString(), success: false})
    }
});

CategoryRouter.get('/:uid', async (req, res) => {
    // get all users
    try {
    
        const data = await Category.findOne({ uid: req.params.uid });

        res.status(200).json({data, success: true});

    } catch (e: any) {
        res.status(500).json({message: e.toString(), success: false})
    }
});

CategoryRouter.post('/', async (req, res) => {
    // get all users
    try {
    
        const data = await Category.create(req.body);


        res.status(200).json({data, success: true});

    } catch (e: any) {
        res.status(500).json({message: e.toString(), success: false})
    }
});

CategoryRouter.put('/:id', async (req, res) => {
    // get all users
    try {
    
        const data = await Category.updateOne({ _id: req.params.id }, req.body);


        res.status(200).json({data, success: true});

    } catch (e: any) {
        res.status(500).json({message: e.toString(), success: false})
    }
});


export default CategoryRouter;