//和xml相关的消息回复模板都扔这里了
const Parser = require("fast-xml-parser").j2xParser;  //JSON转XML
const defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: true,
    indentBy: "  ",
    supressEmptyNode: false
};
const parser = new Parser(defaultOptions);

/**
 * 发送文字信息
 * @param {*} fromUser 给谁发送
 * @param {*} toUser 从哪里发
 * @param {*} content 文字内容
 */
const sendText = (fromUser,toUser,content)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'text',
        Content:content
    })
}

const sendImage = (fromUser,toUser,content)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'image',
        Image:{
            MediaId:content
        }
    })
}

// {/* <xml>
//   <ToUserName><![CDATA[toUser]]></ToUserName>
//   <FromUserName><![CDATA[fromUser]]></FromUserName>
//   <CreateTime>12345678</CreateTime>
//   <MsgType><![CDATA[voice]]></MsgType>
//   <Voice>
//     <MediaId><![CDATA[media_id]]></MediaId>
//   </Voice>
// </xml> */}

const sendVoice = (fromUser,toUser,voice)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'voice',
        Voice:voice
    })
}


// {/* <xml>
//   <ToUserName><![CDATA[toUser]]></ToUserName>
//   <FromUserName><![CDATA[fromUser]]></FromUserName>
//   <CreateTime>12345678</CreateTime>
//   <MsgType><![CDATA[video]]></MsgType>
//   <Video>
//     <MediaId><![CDATA[media_id]]></MediaId>
//     <Title><![CDATA[title]]></Title>
//     <Description><![CDATA[description]]></Description>
//   </Video>
// </xml> */}

const sendVideo = (fromUser,toUser,video)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'video',
        Video:video
    })
}

// {/* <xml>
//   <ToUserName><![CDATA[toUser]]></ToUserName>
//   <FromUserName><![CDATA[fromUser]]></FromUserName>
//   <CreateTime>12345678</CreateTime>
//   <MsgType><![CDATA[music]]></MsgType>
//   <Music>
//     <Title><![CDATA[TITLE]]></Title>
//     <Description><![CDATA[DESCRIPTION]]></Description>
//     <MusicUrl><![CDATA[MUSIC_Url]]></MusicUrl>
//     <HQMusicUrl><![CDATA[HQ_MUSIC_Url]]></HQMusicUrl>
//     <ThumbMediaId><![CDATA[media_id]]></ThumbMediaId>
//   </Music>
// </xml> */}

const sendMusic = (fromUser,toUser,music)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'music',
        Music:music
    })
}

// {/* <xml>
//   <ToUserName><![CDATA[toUser]]></ToUserName>
//   <FromUserName><![CDATA[fromUser]]></FromUserName>
//   <CreateTime>12345678</CreateTime>
//   <MsgType><![CDATA[news]]></MsgType>
//   <ArticleCount>1</ArticleCount>
//   <Articles>
//     <item>
//       <Title><![CDATA[title1]]></Title>
//       <Description><![CDATA[description1]]></Description>
//       <PicUrl><![CDATA[picurl]]></PicUrl>
//       <Url><![CDATA[url]]></Url>
//     </item>
//   </Articles>
// </xml> */}

const sendArticles = (fromUser,toUser,articles)=>{
    return jsonxml({
        ToUserName: toUser,
        FromUserName:fromUser,
        CreateTime:new Date().getTime(),
        MsgType:'news',
        ArticleCount:articles.count,
        Articles:articles.items
    })
}

//对象增加cdata的处理，并增加了cdata的限制
function newObj(obj){
    if(Object.keys(obj)!=0){
        for(let k in obj){
            if(typeof obj[k] === 'object'){
                obj[k] = newObj(obj[k]);
            }else{
                obj[k] = {
                    __cdata:obj[k]
                }
            }            
        }
    }
    return obj
}

// 处理后的对象，转xml
const jsonxml = function(obj){
    obj = newObj(obj)
    let tempObj = new Object();
    //封装一层xml，并增加__cdata属性
    tempObj.xml =obj
    let xml = parser.parse(tempObj);
    console.log(xml)
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