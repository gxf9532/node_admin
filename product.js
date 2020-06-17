/*
 定义一个product的Schema
*/
var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    status: {
        type: Number
    },
    name: {
        type: String
    },
    categoryId: {
        type: String
    },
    desc: {
        type:String
    },
    price: {
        type: String
    },
    detail: {
        type: String
    },
    imgs: {
        type: Array
    }

});

module.exports = mongoose.model('Product', ProductSchema);