const express = require('express');
const router = express.Router();
const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');

router.get('/', async(req, res, next)=>{
  try {
    let categories = await Categories.find({});
    res.json(Response.successResponse(categories));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post('/add', async(req, res, next)=>{
  let body = req.body;
  try {
    if (!body.name) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", 'Category name is required');
    };
    let newCategory = new Categories({
      is_active: body.is_active,
      name: body.name,
      createdBy: req.user?.id
    });

    await newCategory.save();
    res.json(Response.successResponse({success: true}));

  } catch (err) {

    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  
  }
});

router.post('/update', async (req, res, next) => {
  let body = req.body;
    try {
        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", 'Id field is required');
        }

        let updates = {};

        if (body.name) {
            updates.name = req.body.name;
        }

        if (typeof body.is_active === 'boolean') {
            updates.is_active = req.body.is_active;
        }

        await Categories.updateOne({ _id: body._id }, { $set: updates });

        res.json(Response.successResponse({ success: true }));

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(statusCode).json(errorResponse);
    }
});

router.delete('/delete', async (req, res, next) => {
  let body = req.body;
    try {
      if(!body._id){
        throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", 'Id field is required');
      }
      await Categories.deleteOne({_id: body._id});
      res.json(Response.successResponse({success: true}));

    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;