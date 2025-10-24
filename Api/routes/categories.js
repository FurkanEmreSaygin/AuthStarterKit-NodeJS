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

module.exports = router;