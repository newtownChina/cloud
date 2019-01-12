const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
/**
 * event 参数包含小程序端调用传入的 data
 * 将经自动鉴权过的小程序用户 openid 返回给小程序端
 */
exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
}
