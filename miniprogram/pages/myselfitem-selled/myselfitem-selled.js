/*我想要的里面没有分页，一次查完了*/
const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    storedPhoneNum: null
  },
  /*生命周期事件 开始 */
  onLoad: function (options) {
    this.setData({
      storedPhoneNum: wx.getStorageSync("storedPhoneNum")
    })
    console.log("加载")
  },
  onShow: function () {
    this.setData({
      storedPhoneNum: wx.getStorageSync("storedPhoneNum")
    })
    var that = this
    var ifLogin = util.checkLogin()
    console.log("myselfpublish.js:登录状态:" + ifLogin)
    if (!ifLogin) {
      return
    } else {
      //表明已经登录
      /*
      wx.request({
        url: config.host+'selled.jsp',
        data: {
          telphone: this.data.storedPhoneNum
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            goods: res.data
          })
        },
        fail: function () {
          console.log("未能成功获取到我卖出的商品")
        }
      })*/
    }
  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  /*生命周期事件 结束 */
  /*自定义事件 开始 */
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  
  navigateToGoodDetail: function (e) {
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/index-good-detail/index-good-detail?good=" + goodstr + "&wanted_png=wanted.png",
    })
  },
  inputTransportOrder:function(e){
    console.log(e)
    var gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '../transport/transport?gid='+gid
    })
  }
  /*自定义事件 结束 */
})