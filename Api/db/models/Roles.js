const mongoose = require('mongoose');
const { version } = require('react');

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

class Roles extends mongoose.Model {

}

schema.loadClass(Roles);
module.exports = mongoose.model('Roles', schema);
