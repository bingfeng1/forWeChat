const express = require('express')
const router = express.Router()
const wechat = require('../wechat/wechat');
let config = require('../config');//引入配置文件
let privateConfig = require('../private.config');//我自己写的私有配置，该文件未放入git内，可以注释这一段，如果将config中的id和Screct,替换

const myMiddleWare = require('../middleware')    //中间件，处理请求时的token获取等

Object.assign(config, privateConfig) //合并对象，可以注释这一段，如果将config中的id和Screct,替换为自己的话
const wechatApp = new wechat(config); //实例wechat 模块
router.use(myMiddleWare.getAccessToken(wechatApp))
//用于处理所有进入 80 端口 get 的连接请求
router.get('/', function (req, res) {
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
    //检测服务器连接
    .get('/checkNetWork',(req,res)=>{
        wechatApp.checkNetWork().then(
            (data) => {
                res.send(data)
            }
        )
    })

module.exports = router