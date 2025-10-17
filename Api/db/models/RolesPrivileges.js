const mongoose = require('mongoose');


const schema = mongoose.Schema({
    role_id : {type : mongoose.SchemaTypes.ObjectId, require : true},
    permission : {type : String, require : true},
    createdBy : {type : mongoose.SchemaTypes.ObjectId,}
},{
    versionKey: false,
    //timestamps: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

class RolesPrivileges extends mongoose.Model {

}

schema.loadClass(RolesPrivileges);
module.exports = mongoose.model('RolesPrivileges', schema);
