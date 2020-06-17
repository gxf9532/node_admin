/*
    自定义项目配置文件
*/
// 加载项目核心入口文件
let express = require('express')

// 加载body-parser模块
let bodyParser = require('body-parser')
var path = require('path')
let cookieParser = require('cookie-parser')

let fs = require('fs')
let multiparty = require('multiparty')
// 引入User的数据库Model
let User = require('./user.js')

// 引入Category   
let Category = require('./category')

// 引入Role
let Role = require('./role')

let Product = require('./product')
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
    User.findOne(loginData, { username: 1, password: 1 }, (err, result) => {
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

                res.json({ status: 1, mes: '用户名或密码不正确!' })
                return
            }
        }
    })
})

// 处理添加分类
app.post('/manage/category/add', (req, res) => {
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


// 获取所有分类列表
app.get('/manage/category/listAll', (req, res2) => {

    // 查找分类数据
    Category.find({}, (err, res) => {
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



// 根据分类id查找分类路由
app.get('/manage/category/info', (req, res2) => {
    const categoryId = req.query.categoryId

    // 根据分类id查找对应分类
    Category.findOne({
        _id: categoryId
    }, (err, res) => {

        if (!err) {
            res2.json({
                status: 0,
                data: res
            })
        } else {
            res2.json({
                status: 1
            })
        }

    })
})

// 文件上传路由 
app.post('/manage/img/upload', (req, res2) => {

    let form = new multiparty.Form()

    // 设置上传文件路径
    form.uploadDir = __dirname + '/public/images/'

    // 解析上传文件
    form.parse(req, function(err, fields, files) {
        console.log(files)
        // 获取上传文件的原名
        let name = files.image[0].originalFilename
        let url = files.image[0].path 
        let uploadName = url.substr(url.lastIndexOf('\\') + 1)
        url = "http://localhost:" + PORT + "/public/images/" +  uploadName
        
        if (!err) {
            let status = 0
            let data = {
                name,
                url
            }
            res2.json({
                status,
                data
            })
        
        } else {
            let status = 1
            let data = {
                mes: "上传文件失败!"
            }
            res2.json({
                status,
                data
            })
        }
       
    });
})

// 文件删除路由 
app.post('/manage/img/delete', (req, res2) => {
    // 获取要删除的文件名
    const name = req.body.name
    const url = "public/images"
    // console.log(name)
    // 删除后台文件
    fs.readdirSync(url).map(file => {
        if (file === name) {
            // console.log(file)
            fs.unlink(`${url}/${name}`, err => {
                if (err) {
                    res2.json({ status: 1})
                } else {
                    res2.json({ status: 0})
                }
            })
        }
    })
})



// 设置监听端口
const PORT = 8080
app.listen(PORT)

console.log(`后台正在监听${PORT}端口...`)

module.exports = app