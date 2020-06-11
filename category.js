/*
 定义一个category的Schema
*/
var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var CateSchema = new Schema({
  categoryName: { type: String }

});

module.exports = mongoose.model('Category', CateSchema);