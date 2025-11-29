const express = require("express");
const router = express.Router();
const Users = require("../db/models/Users");
const UserRoles = require("../db/models/UserRoles");
const Roles = require("../db/models/Roles");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const bcrypt = require("bcrypt-nodejs");
const is = require("is_js");
const jwt = require("jwt-simple");
const config = require("../config");
const auth = require("../lib/auth")();
const i18n = new (require("../lib/i18n"))(config.DEFAULT_LANG);

router.post("/register", async (req, res, next) => {
  let body = req.body;
  let userLang = body.language || "tr";
  try {
    let user = await Users.findOne({ email: body.email });
    if (user)
      return res
        .status(Enum.HTTP_CODES.CONFLICT)
        .send("Bu e-posta adresi zaten kullanılıyor.");

    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["email"])
      );
    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["valid email"])
      );
    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["password"])
      );
    if (body.password.length < Enum.Pass_Length)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["password length greater than " + Enum.Pass_Length])
      );
    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["first_name"])
      );
    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["last_name"])
      );
    if (!body.phone_number)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["phone_number"])
      );
    if (typeof body.is_active !== "boolean") body.is_active = true;
    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["roles"])
      );

    let validRoles = await Roles.find({ _id: { $in: body.roles } }).select(
      "_id"
    );
    if (validRoles.length !== body.roles.length)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["valid roles"])
      );

    let hashPassword = bcrypt.hashSync(
      body.password,
      bcrypt.genSaltSync(8),
      null
    );
    let newUser = new Users({
      email: body.email,
      password: hashPassword,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
    });
    await newUser.save();

    const userRolesToCreate = validRoles.map((role) => ({
      user_id: newUser._id,
      role_id: role._id,
    }));

    if (userRolesToCreate.length > 0) {
      await UserRoles.insertMany(userRolesToCreate);
    }

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, userLang);
    res.status(errorResponse.code).json(errorResponse);
  }
});
router.post("/auth", async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    let { email, password } = body;
    
    Users.validateFieldBeforeAuthentication(email, password);

    let user = await Users.findOne({ email: email });

    if (!user)
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
      );

    if (!user.validPassword(password))
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        i18n.translate("COMMEN.UNAUTHORIZED_ACCESS", userLang),
        i18n.translate("COMMEN.UNAUTHORIZED_ACCESS", userLang)
      );

    let payload = {
      id: user._id,
      exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME,
    };

    let token = jwt.encode(payload, config.JWT.SECRET);
    let userData = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    res.json(Response.successResponse({ token, user: userData }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, userLang);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

router.get("/", async (req, res, next) => {
  try {
    let users = await Users.find({});
    res.json(Response.successResponse(users));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});
router.post("/add", async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["email"])
      );
    if (!is.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["valid email"])
      );
    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["password"])
      );
    if (body.password.length < Enum.Pass_Length)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, [
          "password length greater than " + Enum.Pass_Length,
        ])
      );
    if (!body.first_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["first_name"])
      );
    if (!body.last_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["last_name"])
      );
    if (!body.phone_number)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, [
          "phone_number",
        ])
      );
    if (typeof body.is_active !== "boolean") body.is_active = true;

    let hashPassword = bcrypt.hashSync(
      body.password,
      bcrypt.genSaltSync(8),
      null
    );

    let newUser = new Users({
      email: body.email,
      password: hashPassword,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
    });
    await newUser.save();
    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});
router.post("/update", async (req, res, next) => {
  let body = req.body;
  let userLang = req.user?.language;
  try {
    let updates = {};
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMEN.VALIDATION_ERROR", userLang),
        i18n.translate("COMMEN.FIELD_MUST_BE_FILLED", userLang, ["_id"])
      );
    }
    if (body.password && body.password.length >= Enum.Pass_Length) {
      updates.password = bcrypt.hashSync(
        body.password,
        bcrypt.genSaltSync(8),
        null
      );
    }
    if (body.first_name) updates.first_name = body.first_name;
    if (body.last_name) updates.last_name = body.last_name;
    if (body.phone_number) updates.phone_number = body.phone_number;
    if (typeof body.is_active == "boolean") updates.is_active = body.is_active;
    if (Array.isArray(body.roles) && body.roles.length > 0) {
      const newRoleIds = body.roles;
      const currentDbUserRoles = await UserRoles.find({ user_id: body._id });
      const currentRoleIds = currentDbUserRoles.map((doc) =>
        doc.role_id.toString()
      );
      const rolesToAdd = newRoleIds.filter(
        (id) => !currentRoleIds.includes(id)
      );
      const rolesToDelete = currentRoleIds.filter(
        (id) => !newRoleIds.includes(id)
      );

      const userRoleToDelete = currentDbUserRoles.filter((doc) =>
        rolesToDelete.includes(doc.role_id.toString())
      );

      if (userRoleToDelete.length > 0) {
        await UserRoles.deleteMany({ _id: { $in: userRoleToDelete } });
      }
      if (rolesToAdd.length > 0) {
        const newRoleDocs = rolesToAdd.map((roleId) => ({
          role_id: roleId,
          user_id: body._id,
        }));
        await UserRoles.insertMany(newRoleDocs);
      }
    }

    await Users.updateOne({ _id: body._id }, updates);
    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.delete("/delete", async (req, res, next) => {
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
    await UserRoles.deleteMany({ user_id: body._id });
    await Users.deleteOne({ _id: body._id });
    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
