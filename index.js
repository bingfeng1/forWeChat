const express = require('express'); //express 框架 
const wechat = require('./wechat/wechat');
// const fs = require('fs')
// const morgan = require('morgan')
// const path = require('path')
// const rfs = require('rotating-file-stream')
let config = require('./config');//引入配置文件
let privateConfig = require('./private.config');//我自己写的私有配置，该文件未放入git内，可以注释这一段，如果将config中的id和Screct,替换为自己的话
const myMiddleWare = require('./middleware')    //中间件，处理请求时的token获取等

const app = express();//实例express框架
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

Object.assign(config, privateConfig) //合并对象，可以注释这一段，如果将config中的id和Screct,替换为自己的话
const wechatApp = new wechat(config); //实例wechat 模块
app.use(myMiddleWare.getAccessToken(wechatApp))

//用于处理所有进入 80 端口 get 的连接请求
app.get('/', function (req, res) {
    wechatApp.auth(req, res);
})
    //获取TOKEN
    .get('/getAccessToken', function (req, res) {
        res.send(wechatApp.accessToken);
    })
    //获取微信服务器IP
    .get('/getWeChatServerIP', function (req, res) {
        wechatApp.getWeChatServerIP().then(
            (data) => {
                res.send(data)
            }
        )
    })
    //监听80端口
    .listen(80, () => {
        console.log('localhost:80 但必须注意要有互联网域名这东西')
    });