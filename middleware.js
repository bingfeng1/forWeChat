/**
 * 中间件处理
 */

const getAccessToken = (wechatApp) => {
    return async function (req, res, next) {
        await wechatApp.getAccessToken().then(function (data) {
            console.log(data)
        },function(data){
            console.error(data)
        });
        next();
    }
}

module.exports = {
    getAccessToken
}