const express = require("express");
const AuditLogs = require("../db/models/AuditLogs");
const router = express.Router();
const moment = require("moment");
const Response = require("../lib/Response");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

router.post('/', auth.checkRoles("auditlogs_view") , async (req, res, next)=>{
    let body = req.body;
    try {
        let query = {};
        let skip = body.skip || 0;
        let limit = body.limit || 500;
        
        if (typeof body.skip !== "number") skip = 0;
        if (typeof body.limit !== "number" || body.limit > 500) limit = 500;
        
        if (body.beginDate && body.endDate) {
            query.created_at = {
                $gte: moment(body.beginDate), // greater than or equal to
                $lte: moment(body.endDate) // less than or equal to
            }
        }else{
            query.created_at = {
                $gte : moment().subtract(1, 'day').startOf('day'),
                $lte : moment()
            }
        } 
        let logs = await AuditLogs.find(query).skip(skip).limit(limit).sort({created_at: -1});

        res.json(Response.successResponse(logs));

    } catch (err) {

        let errorResponse = Response.errorResponse(err, req.user?.language);
        res.status(errorResponse.code).json(errorResponse);
    }
})

module.exports = router;