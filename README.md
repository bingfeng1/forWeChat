# 微信平台的建立
通过对微信官方文档、购买公共域名和nodejs基本介绍搭建微信服务号

# 准备
- 微信官网：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432
- nodejs介绍文档：http://www.cnblogs.com/hvkcode/p/6941121.html
- 域名服务：https://echosite.2bdata.com/login

* 相关账号密码请自备*

# 建立本地服务与外网的连接
- 通过 https://echosite.2bdata.com/experience/more/4 教程
- https://echosite.2bdata.com/console/download 下载对应的客户端，并下载配置文件
- 在本地使用cmd启动
```
linux ./echosite -config=./echosite.yml start name1
mac ./echosite -config=./echosite.yml start name1
windows echosite -config=echosite.yml start name1
```
命令行中的状态变为online成功

- 2019-4-15更新为花生壳，使用花生壳注册使用3000端口

# 建立微信与本地服务的连通
- 微信公众平台中，基本配置--IP白名单，将购买的域名的ip地址放入
- 然后在本页面中配置服务器，先等下点击启动
- 在本地写连接程序，[wechart.auth](##weChart.js)
*本地有一个private.config.json放了我自己的ID和Screct，可以自己也建立一个，或直接在config.json里面修改，但要将代码中使用的地方自行改正*

# 本软件API
## index.js
- 文件入口
- 日志功能（已被全部注释）

## middleware.js
中间件
- getAccessToken：对token的获取，有一层阻止验证的过滤

## router/router.js
从index.js拆出，放入路由功能
- '/'：微信与服务器建立连接
- '/getAccessToken'：从微信服务器获取Access_token
- '/getWeChatServerIP'：从微信服务器获取微信服务器的IP
- '/checkNetWork'：验证服务器连通情况（可能会用于放在中间件，有三个可用连接地址，如果不通过可以再调用下一个地址）
- 'menuCreate'：自定义菜单栏
- 'menuGet'：获取菜单栏信息
- 'menuDelete'：删除菜单栏
- 'menuAddconditional'：个性化菜单
- post'/'：POST请求，用于解析客户端发送来的数据（未完成）

# wechat
## weChart.js
- auth：与微信服务器进行连接测试
- requestGet：所有Get请求（已使用request代替实现）
- requestPost：所有POST请求（这个插件仅获取body内容，不过可以获取全部内容）
- getAccessToken：获取验证accessToken
- getWeChatServerIP：获取微信服务器IP地址
- checkNetWork：检测服务器连接
- menuCreate：菜单栏的生成
- menuGet：获取菜单栏信息
- menuDelete：删除菜单栏
- menuAddconditional：个性化菜单
- handleMsg：客户端过来的请求（未完成），多重判断，还需要整理一下，哪些是需要服务器提供回复的，因为部分回复是必须的

## dealMsg.js
将传来的内容，变为微信规定的xml
- sendText：发送文字信息
- sendImage：回复图片消息
- sendVoice：回复语音消息
- sendVideo：回复视频消息
- sendMusic：回复音乐消息
- sendArticles：回复图文消息

## receiveMsg.js
- EventKey：自定义按钮设置的key
- Msg：用户主动发送信息
- Event：其他事件

# config
## mainConfig.json
主要配置和路径

## menuConfig.json
菜单栏的配置

# 启动方式
- 以在VSCODE中直接F5为最好，可以断点调试
- 也可以通过npm start进行热更新
- 正式部署，需要安装node环境，并全局安装pm2
https://www.npmjs.com/package/pm2

# 所使用技术
- 后台：nodejs
- 版本管理：git（本地）
- 语法验证：eslint
- 自动更新：nodemon