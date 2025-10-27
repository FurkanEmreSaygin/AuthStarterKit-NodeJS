const mongoose = require('mongoose');
const RolesPrivileges = require('./RolesPrivileges');

const schema = mongoose.Schema({
    role_name: {type: String, require: true},
    is_active: {type: Boolean, default: true},
    created_by: {type: mongoose.SchemaTypes.ObjectId,require: true,}

},{
    versionKey: false,
    //timestamps: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

schema.pre("deleteOne", { document: false, query: true }, async function () {
  console.log("Roles 'pre-deleteOne' hook tetiklendi!"); 

  const query = this.getQuery();

  if (query._id) {

    await RolesPrivileges.deleteMany({ role_id: query._id });
  }
});

module.exports = mongoose.model('Roles', schema);
