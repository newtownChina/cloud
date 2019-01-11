/*我想要的里面没有分页，一次查完了*/
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    storedPhoneNum:null
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
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
      wx.request({
        data:{
          telphone: this.data.storedPhoneNum
        },
        success:function(res){
          that.setData({
            goods: res.data
          })
        },
        fail:function(){
          console.log("未能成功获取到我想要的商品")
        }
      })
    }
  },
  navigateToGoodDetail: function (e) {
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/index-good-detail/index-good-detail?good=" + goodstr+"&wanted_png=wanted.png",
    })
  },
  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    
  }
})