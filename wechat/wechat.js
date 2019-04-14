const sha1 = require('sha1'); //引入加密模块https = require('https'), 
const util = require('util'); //引入 util 工具包
const accessTokenJson = require('./accessToken'); //引入本地存储的 access_token
const fs = require('fs');   //引入文件系统
const rp = require('request-promise')
const menuConfig = require('../config/menuConfig.json') //按钮生成的配置

//构建 WeChat 对象 即 js中 函数就是对象
class WeChat {
    constructor(config) {
        //设置 WeChat 对象属性 config
        this.config = config;
        //设置 WeChat 对象属性 token
        this.token = config.token;
        //设置 WeChat 对象属性 appID
        this.appID = config.appID;
        //设置 WeChat 对象属性 appScrect
        this.appScrect = config.appScrect;
        //设置 WeChat 对象属性 apiDomain
        this.apiDomain = config.apiDomain;
        //设置 WeChat 对象属性 apiURL
        this.apiURL = config.apiURL;
        //内存中也保存accessToken
        this.accessToken = "";
    }

    /**
     * 微信接入验证
     */
    auth(req, res) {
        //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
        let signature = req.query.signature,//微信加密签名
            timestamp = req.query.timestamp,//时间戳
            nonce = req.query.nonce,//随机数
            echostr = req.query.echostr;//随机字符串

        //2.将token、timestamp、nonce三个参数进行字典序排序
        let array = [this.token, timestamp, nonce];
        array.sort();

        //3.将三个参数字符串拼接成一个字符串进行sha1加密
        let tempStr = array.join('');
        let resultCode = sha1(tempStr); //对传入的字符串进行加密

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (resultCode === signature) {
            res.send(echostr);
        } else {
            res.send('mismatch');
        }
    }

    // 所有GET请求
    requestGet(uri, qs) {
        return new Promise((resolve, reject) => {
            // 使用了文章中提到的request插件，他相关有一个和promise还有async相关的插件，使用了这个，请求与获取更加优雅
            rp({
                uri,
                qs,
                json: true
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        });
    }

    // 所有Post请求
    requestPost(uri, qs, body) {
        return new Promise((resolve, reject) => {
            // 使用了文章中提到的request插件，他相关有一个和promise还有async相关的插件，使用了这个，请求与获取更加优雅
            rp({
                method: 'POST',
                uri,
                qs,
                body,
                json: true
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        });
    }

    // 获取AccessToken
    getAccessToken() {
        let that = this;
        return new Promise(function (resolve, reject) {
            //获取当前时间 
            let currentTime = new Date().getTime();
            //格式化请求地址
            let url = util.format(that.apiURL.accessTokenApi, that.apiDomain);
            let qs = {
                appid: that.appID,
                secret: that.appScrect,
                grant_type: 'client_credential'
            };
            //判断 本地存储的 access_token 是否有效(虽然有this.accessToken，但程序断开的话就没了，所以还是从文件内先获取一次)
            if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
                that.requestGet(url, qs).then(function (data) {
                    if (!data.errcode) {
                        accessTokenJson.access_token = data.access_token;
                        accessTokenJson.expires_time = new Date().getTime() + (parseInt(data.expires_in) - 200) * 1000;
                        //更新本地存储的，这里的fs.writeFile必须要一个错误的返回
                        fs.writeFile('./wechat/accessToken.json', JSON.stringify(accessTokenJson), (err) => {
                            if (err) reject(err);
                        });
                        //将获取后的 access_token 返回，同时放入实例中
                        that.accessToken = accessTokenJson.access_token;
                        resolve(accessTokenJson.access_token);
                    } else {
                        //将错误返回
                        resolve(data);
                    }
                });
            } else {
                //将本地存储的 access_token 返回
                that.accessToken = accessTokenJson.access_token;
                resolve(accessTokenJson.access_token);
            }
        });
    }

    // 获取微信服务器IP地址
    getWeChatServerIP() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.weChatServerIP, that.apiDomain);
            let qs = { access_token: that.accessToken }
            that.requestGet(uri, qs).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }

    //检测服务器连接
    checkNetWork() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.checkNetWork, that.apiDomain);
            let qs = { access_token: that.accessToken }
            let body = {
                "action": "all",
                "check_operator": "DEFAULT"
            }
            that.requestPost(uri, qs, body).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }

    //检测服务器连接
    menuCreate() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.menuCreate, that.apiDomain);
            let qs = { access_token: that.accessToken }
            let body = menuConfig;
            that.requestPost(uri, qs, body).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }

    // 获取自定义菜单栏
    menuGet() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.menuGet, that.apiDomain);
            let qs = { access_token: that.accessToken }
            that.requestGet(uri, qs).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }
}


//暴露可供外部访问的接口
module.exports = WeChat;