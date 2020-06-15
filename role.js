/*
 定义一个role的Schema
*/
var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({ 
  menus: { type: Array }, // 权限
  name: { type: String },// 角色名称
  create_time: { 
      type: String,
      default: new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000)
},
  auth_time: { 
      type: String
},
  auth_name: { type: String }
});

module.exports = mongoose.model('Role', RoleSchema);