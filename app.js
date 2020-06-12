/*
    自定义项目配置文件
*/
// 加载项目核心入口文件
let express = require('express')

// 加载body-parser模块
let bodyParser = require('body-parser')
var path = require('path')
let cookieParser = require('cookie-parser')

// 引入User的数据库Model
let User = require('./user.js')

// 引入Category   
let Category = require('./category')
// 创建项目应用
let app = express()


// 当用户的访问是/public时  就将地址定义到项目的public目录下 
app.use('/public', express.static(__dirname + '/public'))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// 搭建后台路由 
app.post('/login', (req, res) => {
    
    // 接收post表单传递的信息
    let username = req.body.username || ''
    let password = req.body.password || ''
    let loginData = {
        username,
        password
    }
    
    // 从数据库中查找数据
     User.findOne( loginData, {username: 1, password: 1}, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result) {
                res.json({ status: 0, result })
                return
            } else {
                // 如果没有找到该用户则自动添加一个新用户
                // let user = new User( loginData )

                // user.save((err, result2) => {
                //     if (err) {
                //         console.log(err)
                //     } else {
                //         res.json({ status: 2, mes:`注册新用户${result2.username}成功!`})
                //     }
                // })

                res.json({ status: 1, mes: '用户名或密码不正确!'})
                return
            }
        }
     })
})

// 处理添加分类
app.post('/manage/category/add', (req,res) => {
    let { name, parentId } = req.body
    
    // 向后台数据库写入 
    Category.create({ name, parentId }, (err, doc) => {
        if (!err) {
            res.json({
                status: 0,
                doc
            })
        }
    })

})

// 处理获取分类列表 
app.get('/manage/category/list', (req, res2) => {
    // 获取传递过来的parentId 
    let { parentId } = req.query
   
    // 根据parentId查找分类数据
    Category.find({ parentId }, (err, res) => {
        res2.json({
            status: 0,
            data: res
        })
    })

})

// 处理更新分类
app.post('/manage/category/update', (req, res) => {
    // 接受要修改的分类信息
    const { _id, name } = req.body
    
    // 修改条件
    let conditions = { _id }

    // 修改操作
    let updates = {
        $set: { name }
    }
    Category.update(conditions, updates, err => {
        if (err) {
            res.json({
                status: 1,
                mes: '更新分类失败!'
            })
        } else {
            res.json({
                status: 0,
                mes: "更新分类成功!"
            })
        }
    })
})
// 设置监听端口
const PORT = 8080
app.listen(PORT)

console.log(`后台正在监听${PORT}端口...`)

module.exports = app