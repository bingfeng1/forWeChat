/**
 * 获取Post事件，拆分wechat的功能
 * EventKey，是和menuConfig.json定义的内容一一匹配
 * 先把不会有回馈推送的给注释了
 */
const msg = require('./dealMsg')

//按钮事件的接收，并处理
const EventKey = new Map()
    .set("V1001_TODAY_MUSIC",
        function (res, result) {
            res.send(msg.sendText(result, `这是一个按钮`));
        })
    .set("http://www.soso.com/",
        function (res, result) {
            // res.send(msg.sendText(result, `网络连接地址`));
        })
    .set("rselfmenu_0_1",
        function (res, result) {
            console.log(`这是扫码推送事件
                ScanCodeInfo：${result.ScanCodeInfo}（扫描信息）
                ScanType：${result.ScanCodeInfo.ScanType}（扫描类型，一般是qrcode）
                ScanResult：${result.ScanCodeInfo.ScanResult}（扫描结果，即二维码对应的字符串信息）`);
            // res.send(msg.sendText(result, `这是扫码推送事件`));
        })
    .set("rselfmenu_0_0",
        function (res, result) {
            console.log(`这是扫码带提示
                ScanCodeInfo：${result.ScanCodeInfo}（扫描信息）
                ScanType：${result.ScanCodeInfo.ScanType}（扫描类型，一般是qrcode）
                ScanResult：${result.ScanCodeInfo.ScanResult}（扫描结果，即二维码对应的字符串信息）`);
            res.send(msg.sendText(result, `这是扫码带提示`));
        })
    .set("rselfmenu_1_0",
        function (res, result) {
            console.log(`系统拍照发图
                SendPicsInfo${result.SendPicsInfo}（发送的图片信息）
                Count${result.SendPicsInfo.Count}（发送的图片数量）
                PicList${result.SendPicsInfo.PicList}（图片列表）
                PicMd5Sum${result.SendPicsInfo.PicList.item.PicMd5Sum}（图片的MD5值，开发者若需要，可用于验证接收到图片）`);
                // res.send(msg.sendText(result, `系统拍照发图`));
        })
    .set("rselfmenu_1_1",
        function (res, result) {
            console.log(`拍照或者相册发图
                SendPicsInfo${result.SendPicsInfo}（发送的图片信息）
                Count${result.SendPicsInfo.Count}（发送的图片数量）
                PicList${result.SendPicsInfo.PicList}（图片列表）
                PicMd5Sum${result.SendPicsInfo.PicList.item.PicMd5Sum}（图片的MD5值，开发者若需要，可用于验证接收到图片）`);
            // res.send(msg.sendText(result, `拍照或者相册发图`));
        })
    .set("rselfmenu_1_2",
        function (res, result) {
            console.log(`微信相册发图
                SendPicsInfo${result.SendPicsInfo}（发送的图片信息）
                Count${result.SendPicsInfo.Count}（发送的图片数量）
                PicList${result.SendPicsInfo.PicList}（图片列表）
                PicMd5Sum${result.SendPicsInfo.PicList.item.PicMd5Sum}（图片的MD5值，开发者若需要，可用于验证接收到图片）`);
            // res.send(msg.sendText(result, `微信相册发图`));
        })
    .set("rselfmenu_2_0",
        function (res, result) {
            console.log(`发送位置
                SendLocationInfo${result.SendLocationInfo}（发送的位置信息）
                Location_X${result.SendLocationInfo.Location_X}（X坐标信息）
                Location_Y${result.SendLocationInfo.Location_Y}（Y坐标信息）
                Scale${result.SendLocationInfo.Scale}（精度，可理解为精度或者比例尺、越精细的话 scale越高）
                Label${result.SendLocationInfo.Label}（地理位置的字符串信息）
                Poiname${result.SendLocationInfo.Poiname}（朋友圈POI的名字，可能为空）`);
            // res.send(msg.sendText(result, `发送位置`));
        })

const MsgType = new Map()
    .set('text',
        function (res, result) {
            let textContent = result.Content;
            console.log(textContent);
            textContent = autoWord.has(textContent) ? autoWord.get(textContent) : textContent;
            res.send(msg.sendText(result, textContent));
        })
    .set("image"
        , function (res, result) {
            let imagePicUrl = result.PicUrl;
            let imageMediaId = result.MediaId;
            console.log(imagePicUrl, imageMediaId)
            res.send(msg.sendText(result, `回馈图片`));
        })
    .set("voice"
        , function (res, result) {
            let voiceMediaID = result.MediaId;
            let voiceFormat = result.Format;
            let voiceRecognition = result.Recognition;
            console.log(voiceMediaID, voiceFormat, voiceRecognition)
            res.send(msg.sendText(result, `回馈声音`));
        })
    .set("video"
        , function (res, result) {
            let videoMediaID = result.MediaId;
            let videoThumbMediaId = result.ThumbMediaId;
            console.log(videoMediaID, videoThumbMediaId)
            res.send(msg.sendText(result, `回馈视频`));
        })
    .set("shortvideo"
        , function (res, result) {
            let shortvideoMediaID = result.MediaID;
            let shortvideoThumbMediaId = result.ThumbMediaId;
            console.log(shortvideoMediaID, shortvideoThumbMediaId)
            res.send(msg.sendText(result, `回馈小视频`));
        })
    .set("location"
        , function (res, result) {
            let locationLocation_X = result.Location_X;
            let locationLocation_Y = result.Location_Y;
            let locationScale = result.Scale;
            let locationLabel = result.Label;
            console.log(locationLocation_X, locationLocation_Y, locationScale, locationLabel)
            res.send(msg.sendText(result, `回馈地理`));
        })
    .set("link"
        , function (res, result) {
            let linkTitle = result.Title;
            let linkDescription = result.Description;
            let linkUrl = result.Url;
            console.log(linkTitle, linkDescription, linkUrl)
            res.send(msg.sendText(result, `回馈连接`));
        })

const Event = new Map()
    .set("subscribe",
        function (res, result) {
            res.send(msg.sendText(result, `欢迎关注晓鸣测试公众号，回复1查看git地址`));
            console.log('有人关注公众号了')
        })
    .set("unsubscribe",
        function (res, result) {
            // res.send(msg.sendText(result, `成功取消关注公众号`));
            console.log('有人取关公众号了')
        })
    .set("LOCATION",
        function (res, result) {
            let Latitude = result.Latitude;
            let Longitude = result.Longitude;
            let Precision = result.Precision;
            console.log('??????',Latitude, Longitude, Precision);
        })

module.exports = {
    EventKey,
    MsgType,
    Event
}

// 文字自动回复
const autoWord = new Map()
    .set('1','项目的git 地址为：git@github.com:bingfeng1/forWeChat.git')
    .set('2','自动回复还是蛮成功的')