const express = require('express');
const router = express.Router();
const Users = require('../db/models/Users');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const bcrypt = require('bcrypt-nodejs')
const is = require('is_js')

router.get('/', async(req , res, next)=>{
    try {
        let users = await Users.find({})
        res.json(Response.successResponse(users));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse); 
    }

})
router.post('/add', async(req, res, next)=>{
    let body = req.body;
    try {
        if(!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'Email field is required');
        if(!is.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'Email feald is must be an email')
        if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'Password field is required');
        if(body.password.length < Enum.Pass_Length) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', "Password lenght must be greater than "+ Enum.Pass_Length);
        if(!body.first_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, 'Validation Error', 'First_name field is required');
        if(!body.last_name)throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","Last_Name field is required");
        if(!body.phone_number)throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Phone Number","Phone Number field is required");
        if(typeof body.is_active !== 'boolean') body.is_active = true;
        
        let hashPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

        let newUser = new Users({
            email: body.email,
            password: hashPassword,
            is_active: body.is_active,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
        })
        await newUser.save();
        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})
router.post('/update', async(req,res,next)=>{
    let body = req.body
    try {
        let updates = {}
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_GATEWAY,'Validation Error', 'Id is required')
        if(body.password && body.password.length >= Enum.Pass_Length){
            updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
        }
        if(body.first_name) updates.first_name = body.first_name
        if(body.last_name) updates.last_name = body.last_name
        if(body.phone_number) updates.phone_number = body.phone_number
        if(typeof body.is_active == 'boolean') updates.is_active = body.is_active

        await Users.updateOne({ _id: body._id },updates);
        res.json(Response.successResponse({success: true}))
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.delete('/delete', async(req, res ,next)=>{
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", 'Id is required');
        await Users.deleteOne({ _id: body._id });
        res.json(Response.successResponse({success: true}))
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})
module.exports = router;