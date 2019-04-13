const express = require('express'), //express 框架 
    wechat = require('./wechat/wechat');
let config = require('./config');//引入配置文件
let privateConfig = require('./private.config');//我自己写的私有配置，该文件未放入git内，可以注释这一段，如果将config中的id和Screct,替换为自己的话

const app = express();//实例express框架

Object.assign(config,privateConfig) //合并对象，可以注释这一段，如果将config中的id和Screct,替换为自己的话
const wechatApp = new wechat(config); //实例wechat 模块

//用于处理所有进入 80 端口 get 的连接请求
app.get('/', function (req, res) {
    wechatApp.auth(req, res);
})

    //监听80端口
    .listen(80, () => {
        console.log('localhost:80 但必须注意要有互联网域名这东西')
    });