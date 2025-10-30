const mongoose = require('mongoose');

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

}

schema.loadClass(Users);
module.exports = mongoose.model('Users', schema);
