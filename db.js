// 连接数据库 
 let Mongoose = require('mongoose')

const URL = "mongodb://localhost:27017/test"
Mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})

Mongoose.connection.on('connected', () => {
    console.log('连接数据库成功!');
})

Mongoose.connection.on('disconnected', err => {
    console.log('数据库连接已断开!')
})

module.exports = Mongoose