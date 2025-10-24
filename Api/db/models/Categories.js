const mongoose = require('mongoose');

const schema = mongoose.Schema({
    is_active : {type:Boolean, default:true},
    name : {type : String, required : true, unique : true},
    createdBy : {type : mongoose.SchemaTypes.ObjectId,}

},{
    versionKey: false,
    //timestamps: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

class Categories extends mongoose.Model {

}

schema.loadClass(Categories);
module.exports = mongoose.model('Categories', schema);
