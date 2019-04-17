'use strict' //设置为严格模式
//和xml相关的消息回复模板都扔这里了
const Parser = require("fast-xml-parser").j2xParser;  //JSON转XML
const defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
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
        ToUserName: fromUser,
        FromUserName:toUser,
        CreateTime:new Date().getTime(),
        MsgType:'text',
        Content:content
    })
}



//对象转json，并增加了cdata的限制
const jsonxml = function(obj){
    let tempObj = new Object();
    //封装一层xml，并增加__cdata属性
    tempObj.xml = {}
    for(let k in obj){
        tempObj.xml[k] = {
            __cdata:obj[k]
        }
    }
    let xml = parser.parse(tempObj);
    return xml;
}

module.exports = {
    jsonxml,
    sendText
}