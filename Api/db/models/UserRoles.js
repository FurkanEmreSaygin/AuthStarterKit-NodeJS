const mongoose = require('mongoose');


const schema = mongoose.Schema({
    role_id : {type : mongoose.SchemaTypes.ObjectId, require : true},
    user_id : {type : mongoose.SchemaTypes.ObjectId, require : true},
},{
    versionKey: false,
    //timestamps: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

class UserRoles extends mongoose.Model {

}

schema.loadClass(UserRoles);
module.exports = mongoose.model('UserRoles', schema);
