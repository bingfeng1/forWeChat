const express = require('express')
const router = express.Router()
const wechat = require('../wechat/wechat');
let mainConfig = require('../config/mainConfig.json');//引入配置文件
let privateConfig = require('../private.config');//我自己写的私有配置，该文件未放入git内，可以注释这一段，如果将config中的id和Screct,替换

const myMiddleWare = require('../middleware')    //中间件，处理请求时的token获取等

Object.assign(mainConfig, privateConfig) //合并对象，可以注释这一段，如果将config中的id和Screct,替换为自己的话
const wechatApp = new wechat(mainConfig); //实例wechat 模块
//用于处理所有进入 80 端口 get 的连接请求
router.get('/', function (req, res) {
    wechatApp.auth(req, res);
})
    // 本来以为改变中间件位置，可以阻止一层token的获取，结果不行
    .use(
        myMiddleWare.getAccessToken(wechatApp)
    )
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
    //检测服务器连接
    .get('/checkNetWork', (req, res) => {
        wechatApp.checkNetWork().then(
            (data) => {
                res.send(data)
            }
        )
    })
    //自定义菜单栏
    .get('/menuCreate', (req, res) => {
        wechatApp.menuCreate().then(
            (data) => {
                res.send(data)
            }
        )
    })

module.exports = router