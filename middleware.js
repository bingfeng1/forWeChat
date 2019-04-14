/**
 * 中间件处理
 */

const getAccessToken = (wechatApp) => {
    return async function (req, res, next) {
        // 开着这个，微信会自动来获取，不知道为什么，这里做了一个阻止功能
        if (req.method === 'POST' && req.query.openid) {
            console.log(req.query.openid, "这是微信自带的URL请求，不需要使用TOKEN，所以阻止本次中间件的执行")
            next();
        } else {
            await wechatApp.getAccessToken().then(function (data) {
                console.log(data)
            }, function (data) {
                console.error(data)
            });
            next();
        }
    }
}

module.exports = {
    getAccessToken
}