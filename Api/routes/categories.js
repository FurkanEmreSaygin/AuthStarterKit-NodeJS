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


module.exports = router;