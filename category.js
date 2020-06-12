/*
 定义一个category的Schema
*/
var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var CateSchema = new Schema({
  name: { type: String },
  parentId: { 
    type: String,
    default: '0' // 默认设置分类id为0(顶级分类)
  }

});

module.exports = mongoose.model('Category', CateSchema);