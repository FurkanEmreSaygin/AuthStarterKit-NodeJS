const express = require("express");
const router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLog = require("../lib/AuditLogs");
const logger = require("../lib/logger/loggerClass");
const config = require("../config");
const i18n = new (require("../lib/i18n"))(config.DEFAULT_LANG);

const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

router.get("/", auth.checkRoles("category_view"), async (req, res, next) => {
  try {
    let categories = await Categories.find({});
    res.json(Response.successResponse(categories));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", auth.checkRoles("category_add") , async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    if (!body.name) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["name"])
      );
    }
    let newCategory = new Categories({
      is_active: body.is_active,
      name: body.name,
      createdBy: req.user?.id,
    });

    await newCategory.save();

    AuditLog.info({
      email: req.user?.email,
      location: "Category Creation",
      proc_type: "ADD",
      log: "New category added: " + body.name,
    });

    logger.info(
      req.user?.email,
      "Category Add Route",
      "Add",
      `New category added: ${body.name}`
    );

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    logger.error(
      req.user?.email,
      "Category Add Route",
      "Add",
      `Error adding category: ${err.message}`
    );
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", auth.checkRoles("category_update") , async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["_id"])
      );
    }

    let updates = {};

    if (body.name) {
      updates.name = req.body.name;
    }

    if (typeof body.is_active === "boolean") {
      updates.is_active = req.body.is_active;
    }

    await Categories.updateOne({ _id: body._id }, { $set: updates });

    AuditLog.info({
      email: req.user?.email,
      location: "Category Update",
      proc_type: "Update",
      log: "Category updated" + JSON.stringify({ _id: body._id, ...updates }),
    });

    logger.info(
      req.user?.email,
      "Category Update Route",
      "Update",
      `Category updated: ${JSON.stringify({ _id: body._id, ...updates })}`
    );

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    logger.error(
      req.user?.email,
      "Category Update Route",
      "Update",
      `Error updating category: ${err.message}`
    );
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.delete("/delete",auth.checkRoles("category_delete") , async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["_id"])
      );
    }
    await Categories.deleteOne({ _id: body._id });

    AuditLog.info({
      email: req.user?.email,
      location: "Category Delete",
      proc_type: "Delete",
      log: "Category deleted" + JSON.stringify({ _id: body._id }),
    });

    logger.info(
      req.user?.email,
      "Category Delete Route",
      "Delete",
      `Category deleted: ${JSON.stringify({ _id: body._id })}`
    );

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    logger.error(
      req.user?.email,
      "Category Delete Route",
      "Delete",
      `Error deleting category: ${err.message}`
    );
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
