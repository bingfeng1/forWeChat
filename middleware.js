/**
 * 中间件处理
 */

const getAccessToken = (wechatApp) => {
    console.log("进入getAccessToken中间件");
    return async function (req, res, next) {
        // 开着这个，微信会自动来获取，不知道为什么，这里做了一个阻止功能
        if (req.method === 'POST' && req.query.openid) {
            console.log(req.query.openid)
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