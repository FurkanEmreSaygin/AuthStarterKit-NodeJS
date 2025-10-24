const express = require('express');
const router = express.Router();


router.get('/:id', function(req, res, next) {
  res.json({
    message: 'Categories Endpoint',
    body: req.body,
    params: req.params,
    query: req.query,
    Headers: req.headers
  }
  );
  next();
});


router.get('/', function(req, res, next) {
  res.send('Categories Endpoint');
});


router.post('/update', async(req, res, next)=>{
  try{
    if (!req.body.id) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", 'Id Faild is required');
    }
    if(body.name){
      let updates = {};
      updates.name = body.name;
    }
    if(body.is_active === typeof Boolean){ 
      updates.is_active = body.is_active;
    }
    await Categories.updates({_id: body.id}, updates);
    res.json(Response.successResponse({success: true}));
    
  }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
  } 

})
module.exports = router;