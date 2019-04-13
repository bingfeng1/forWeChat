const express = require('express');

var app = express();//实例express框架

//用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function (req, res) {
    res.send('hello world')
});
//监听80端口
app.listen(80, () => {
    console.log(`localhost:80`)
});