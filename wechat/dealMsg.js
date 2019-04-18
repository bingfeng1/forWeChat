//和xml相关的消息回复模板都扔这里了
// 返回消息时需要互换
const Parser = require("fast-xml-parser").j2xParser;  //JSON转XML
const defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: "@", //default is false
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: true,
    indentBy: "  ",
    supressEmptyNode: false
};
const parser = new Parser(defaultOptions);

/**
 * 发送文字信息
 * @param {*} result xml解析结果
 * @param {*} content 文字内容
 */
const sendText = (result, content) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: content
    })
}

/**
 * 回复图片消息
 * @param {*} result xml解析结果
 * @param {*} MediaId 通过素材管理中的接口上传多媒体文件，得到的id
 */
const sendImage = (result, MediaId) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'image',
        Image: {
            MediaId
        }
    })
}

/**
 * 回复语音消息
 * @param {*} result xml解析结果
 * @param {*} MediaId 通过素材管理中的接口上传多媒体文件，得到的id
 */
const sendVoice = (result, MediaId) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'voice',
        Voice: {
            MediaId
        }
    })
}


/**
 * 回复视频消息
 * @param {*} result xml解析结果
 * @param {Object} item MediaId必填，通过素材管理中的接口上传多媒体文件，得到的id、Title：视频标题、Description：视频描述
 */
const sendVideo = (result, item) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'video',
        Video: {
            MediaId: item.MediaId,
            Title: item.Title,
            Description: item.Description
        }
    })
}

/**
 * 回复音乐消息
 * @param {*} result xml解析结果
 * @param {Object} item ThumbMediaId必填，缩略图的媒体id，通过素材管理中的接口上传多媒体文件，得到的id、Title：音乐标题、Description：音乐描述、MusicURL：音乐链接、HQMusicUrl：高质量音乐链接，WIFI环境优先使用该链接播放音乐
 */
const sendMusic = (result, item) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'music',
        Music: {
            Title: item.Title,
            Description: item.Description,
            MusicURL: item.MusicURL,
            HQMusicUrl: item.HQMusicUrl,
            ThumbMediaId: item.ThumbMediaId
        }
    })
}
/**
 * 回复图文消息
 * @param {*} result xml解析结果
 * @param {Object} items ArticleCount:图文消息个数；当用户发送文本、图片、视频、图文、地理位置这五种消息时，开发者只能回复1条图文消息；其余场景最多可回复8条图文消息、Articles：数组对象。包含：Title：图文消息标题、Description：图文消息描述、PicUrl：图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200、Url：点击图文消息跳转链接
 */
const sendArticles = (result, items) => {
    return jsonxml({
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'news',
        ArticleCount: items.ArticleCount,
        Articles: items.Articles
    })
}

//对象增加cdata的处理，并增加了cdata的限制
function newObj(obj) {
    if (Object.keys(obj) != 0) {
        for (let k in obj) {
            if (typeof obj[k] === 'object') {
                obj[k] = newObj(obj[k]);
            } else {
                obj[k] = {
                    __cdata: obj[k]
                }
            }
        }
    }
    return obj
}

// 处理后的对象，转xml
const jsonxml = function (obj) {
    obj = newObj(obj)
    let tempObj = new Object();
    //封装一层xml，并增加__cdata属性
    tempObj.xml = obj
    let xml = parser.parse(tempObj);
    // console.log(xml)
    return xml;
}

module.exports = {
    jsonxml,
    sendText,
    sendImage,
    sendVoice,
    sendVideo,
    sendMusic,
    sendArticles
}