const sha1 = require('sha1'); //引入加密模块https = require('https'), 
const util = require('util'); //引入 util 工具包
const accessTokenJson = require('./accessToken'); //引入本地存储的 access_token
const fs = require('fs');   //引入文件系统
const rp = require('request-promise')
const menuConfig = require('../config/menuConfig.json') //按钮生成的配置
const xmljson = require('fast-xml-parser')  //使用新的xml与json互换
const receiveMsg = require('./receiveMsg')  //处理传来的信息

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
        //可能出现重复事件发送情况，这里需要对重复事件有一个判断
        this.MsgId = "";
        this.FromUserName_CreateTime = ""
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
    // 删除菜单栏
    menuDelete() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.menuDelete, that.apiDomain);
            let qs = { access_token: that.accessToken }
            that.requestGet(uri, qs).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }

    // 创建个性化菜单栏
    menuAddconditional() {
        let that = this;
        return new Promise((resolve, reject) => {
            let uri = util.format(that.apiURL.menuAddconditional, that.apiDomain);
            let qs = { access_token: that.accessToken }
            let body = menuConfig;
            that.requestPost(uri, qs, body).then(
                data => resolve(data),
                err => reject(err)
            )
        })
    }

    handleMsg(req, res) {
        let buffer = [];
        let that = this;
        //监听 data 事件 用于接收数据
        req.on('data', function (data) {
            buffer.push(data);
        });
        //监听 end 事件 用于处理接收完成的数据
        req.on('end', function () {
            let msgXml = Buffer.concat(buffer).toString('utf-8');
            //解析xml
            let msgJson = xmljson.parse(msgXml)
            if (msgJson) {
                let result = msgJson.xml;
                //微信官方文档中，关于重复发送事件处理已有相应去重办法
                if (that.FromUserName_CreateTime === `${result.FromUserName} + ${result.CreateTime}`) {
                    return res.send('')
                } else {
                    that.FromUserName_CreateTime = `${result.FromUserName} + ${result.CreateTime}`
                }


                //判断使用哪个方式去处理，默认nothing因为处理界面中没有nothing的
                let key = "nothing";
                // 根据文档，菜单事件都包含一个EventKey（注意，部分内容使用res.send没有用处）
                if (result.EventKey) {
                    //判断按钮的EventKey。都是自己在config里面定义的，一样就行
                    key = "EventKey"

                } else if (result.MsgId) {
                    //微信文档对于信息重排的判断
                    if(that.MsgId === result.MsgId){
                        res.send('');
                    }else{
                        that.MsgId = result.MsgId;
                    }

                    //所有接收用户消息，都会有一个MsgId先使用这个判断
                    // let MsgId = result.MsgId;
                    key = "MsgType"
                } else {
                    // 如果没有定义的按钮key也没有msgid，那么就是关注/取消关注事件、上报地理位置事件
                    key = "Event"
                }
                receiveMsg[key].has(result[key]) ? receiveMsg[key].get(result[key])(res, result) : console.log(result, "未知事件，请查看控制台")
            }
        });
    }
}


//暴露可供外部访问的接口
module.exports = WeChat;