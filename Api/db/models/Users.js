const mongoose = require('mongoose');
const {Pass_Length, HTTP_CODES} = require("../../config/Enum")
const is = require("is_js");
const CustomError = require('../../lib/Error');
const bcrypt = require("bcrypt-nodejs");

const schema = mongoose.Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    is_active: { type: Boolean, default: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    phone_number: { type: String },
  },
  {
    versionKey: false,
    //timestamps: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

class Users extends mongoose.Model {

  validPassword(passport) {
    return bcrypt.compareSync(passport, this.password);
  }


  static validateFieldBeforeAuthentication(email, password) {
    if (typeof password !== "string" || password.length < Pass_Length || is.not.email(email)){
      throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Authentication Error", "Invalid email or password");
    }
  return null;
  }
}

schema.loadClass(Users);
module.exports = mongoose.model('Users', schema);
