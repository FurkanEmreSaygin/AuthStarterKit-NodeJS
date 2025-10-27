const express = require("express");
const router = express.Router();
const Roles = require("../db/models/Roles");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const role_privileges = require("../config/role_privileges");
const RolesPrivileges = require("../db/models/RolesPrivileges");

router.get("/", async (req, res, next) => {
  try {
    let roles = await Roles.find({});
    res.json(Response.successResponse(roles));
  } catch (err) {
    let errorResponse = response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post("/add", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.name) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "Role name is required"
      );
    }
    if (
      !body.permissions ||
      !Array.isArray(body.permissions) ||
      body.permissions.length == 0
    ) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "Permissions field is required"
      );
    }
    if (typeof body.is_active !== "boolean") {
      body.is_active = true;
    }
    let newRole = new Roles({
      is_active: body.is_active,
      role_name: body.name,
      created_by: req.user?.id,
    });
    await newRole.save();

    const privilegesToInsert = body.permissions.map((perm) => ({
      role_id: newRole._id,
      permission: perm,
      createdBy: req.user?.id,
    }));

    if (privilegesToInsert.length > 0) {
      await RolesPrivileges.insertMany(privilegesToInsert);
    }
    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error ",
        "Id field is required"
      );
    }

    let updatedRole = {};
    if (body.name) {
      updatedRole.role_name = body.name;
    }
    if (typeof body.is_active === "boolean") {
      updatedRole.is_active = body.is_active;
    }
    if (
      body.permissions &&
      Array.isArray(body.permissions)
    ) {
      let currentDbPermissions = await RolesPrivileges.find({
        role_id: body._id,
      });
      let currentPermissionKeys = currentDbPermissions.map((p) => p.permission);

      let newPermissionKeys = body.permissions;
      
      let permissionsToRemove = currentDbPermissions.filter((db_perm) => !newPermissionKeys.includes(db_perm.permission));

      let permissionKeysToAdd = newPermissionKeys.filter((key) => !currentPermissionKeys.includes(key));

      if (permissionsToRemove.length > 0) {
        let idsToRemove = permissionsToRemove.map((p) => p._id);
        await RolesPrivileges.deleteMany({_id: { $in: idsToRemove },});
      }

      if (permissionKeysToAdd.length > 0) {
        let privilegesToInsert = permissionKeysToAdd.map((key) => ({
          role_id: body._id,
          permission: key, 
          createdBy: req.user?.id, 
        }));
        await RolesPrivileges.insertMany(privilegesToInsert);
      }
    }

    await Roles.updateOne({ _id: body._id }, { $set: updatedRole });
    res.json(Response.successResponse({ success: true }));
    
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.delete("/delete", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error ",
        "Id field is required"
      );
    }
    await Roles.deleteOne({ _id: body._id });
    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.get("/role_privileges", async (req, res, next) => {
  res.json(role_privileges);
});
module.exports = router;
