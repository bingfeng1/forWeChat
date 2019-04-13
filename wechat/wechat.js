const sha1 = require('sha1'); //引入加密模块https = require('https'), 
const https = require('https'); //引入 htts 模块
const util = require('util'); //引入 util 工具包
const accessTokenJson = require('./accessToken'); //引入本地存储的 access_token
const fs = require('fs');   //引入文件系统

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
    requestGet(url) {
        return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                let buffer = [], result = "";
                //监听 data 事件
                res.on('data', function (data) {
                    buffer.push(data);
                });
                //监听 数据传输完成事件
                res.on('end', function () {
                    result = Buffer.concat(buffer).toString('utf-8');
                    //将最后结果返回
                    resolve(result);
                });
            }).on('error', function (err) {
                reject(err);
            });
        });
    }

    getAccessToken() {
        let that = this;
        return new Promise(function (resolve, reject) {
            //获取当前时间 
            let currentTime = new Date().getTime();
            //格式化请求地址
            let url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);
            //判断 本地存储的 access_token 是否有效
            if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
                that.requestGet(url).then(function (data) {
                    let result = JSON.parse(data);
                    if (data.indexOf("errcode") < 0) {
                        accessTokenJson.access_token = result.access_token;
                        accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                        //更新本地存储的，这里的fs.writeFile必须要一个错误的返回
                        fs.writeFile('./wechat/accessToken.json', JSON.stringify(accessTokenJson),(err)=>{
                            if (err) reject(result);
                        });
                        //将获取后的 access_token 返回
                        resolve(accessTokenJson.access_token);
                    } else {
                        //将错误返回
                        resolve(result);
                    }
                });
            } else {
                //将本地存储的 access_token 返回
                resolve(accessTokenJson.access_token);
            }
        });
    }
}


//暴露可供外部访问的接口
module.exports = WeChat;