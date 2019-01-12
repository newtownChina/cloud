// 云函数入口文件
const cloud = require('wx-server-sdk')
var WXBizDataCrypt = require('./WXBizDataCrypt')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var appId = 'wxc154a40d1a41cbd8'
  var code = event.code
  var encryptedData = event.encryptedData
  var iv = event.iv
  var res = await cloud.callFunction({
    name:'SessionKey',
    data:{code:code}
  })
  var sessionKey = res.result.session_key
  var openid = res.result.openid
  /*return {
    sessionKey:sessionKey
  }*/
  var pc = new WXBizDataCrypt(appId, sessionKey)
  var data = pc.decryptData(encryptedData, iv)
  return {//sync函数内部return语句返回的值，会成为then方法回调函数的参数。调用了new Promise里的resolve
    data: data,
    openid:openid
  }
}