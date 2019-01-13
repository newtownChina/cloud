const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()
const db = cloud.database()
const _ = db.command
/**
 * event 参数包含小程序端调用传入的 data
 * 将经自动鉴权过的小程序用户 openid 返回给小程序端
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var returnObj = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
  await db.collection("config").field({
    mallVersion:true
  })
  .get()
  .then(res=>{
    returnObj.mallVersion = res.data[0].mallVersion
  })
  .catch(err=>{
     return err
  })
  return returnObj
}
