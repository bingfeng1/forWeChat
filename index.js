const express = require('express'); //express 框架 
// const fs = require('fs')
// const morgan = require('morgan')
// const path = require('path')
// const rfs = require('rotating-file-stream')为自己的话
const router = require('./router/router')

const app = express();//实例express框架
app.use(express.json()) //不知道有什么用，但会多一个req.body
// const logDirectory = path.join(__dirname, 'log')

// 如果不存在log文件夹，那就创建
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// // 生成一个定时日志
// const accessLogStream = rfs('access.log', {
//     interval: '1M', // rotate daily
//     size: '200M',
//     path: logDirectory,
//     maxSize: '1G'
// })

// // 中间件中启用
// app.use(morgan('combined', { stream: accessLogStream }))
app
    .use('/', router)

    //监听80端口
    .listen(80, () => {
        console.log('localhost:80 但必须注意要有互联网域名这东西')
    });