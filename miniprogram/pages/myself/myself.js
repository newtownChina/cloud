const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    userInfo:null,
    ifAdmin:false,
    openid: wx.getStorageSync("openid")
  },
  /*生命周期事件 开始 */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShow:function(){
    var that = this
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        if (res.authSetting['scope.userInfo'] == true) {
          that.setData({
            userInfo: app.globalData.userInfo
          })
        }
      }
    })
  },
  /*生命周期事件 结束 */

  /*自定义事件 开始 */
  navigateToMsgList: function () {
    wx.navigateTo({
      url: "/pages/nimlist/nimlist",
    })
  },
  navigateToPublish:function(){
    wx.navigateTo({
      url: "/pages/myselfitem-publish/myselfitem-publish",
    })
  },
  navigateToSelled: function () {
    wx.navigateTo({
      url: "/pages/myselfitem-selled/myselfitem-selled",
    })
  },
  navigateToBought: function () {
    wx.navigateTo({
      url: "/pages/myselfitem-bought/myselfitem-bought",
    })
  },
  navigateToWanted: function () {
    wx.navigateTo({
      url: "/pages/myselfitem-wanted/myselfitem-wanted",
    })
  },
  navigateToContact:function () {
    wx.navigateTo({
      url: "/pages/contact/contact",
    })
  },
  navigateToUserAdmin:function(){
    wx.navigateTo({
      url: "/pages/myselfitem-userAdmin/myselfitem-userAdmin",
    })
  },
  navigateToComplaintAdmin:function(){
    // wx.navigateTo({
    //   url: "/pages/phoneReg/phoneReg",
    // })
  },
  getUserInfo: function (res) {
    console.log(res)
    if ("getUserInfo:ok" == res.detail.errMsg) {
      app.globalData.userInfo = res.detail.userInfo
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法正常使用。请检查网络状态或删除小程序重新进入',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  },
  getPhoneNumber: function (res) {
    var that = this
    var code = wx.getStorageSync("code")
    if (res.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '获取手机号失败',
        content: '请检查网络状态和授权',
      })
    } else {
      var encryptedData = res.detail.encryptedData
      var iv = res.detail.iv
      console.log(res)
      console.log(code)
      //解密数据获取手机号
      wx.cloud.callFunction({
        name: 'decryptedData',
        data: {
          encryptedData: encryptedData,
          iv: iv,
          code: code
        }
      }).then(function (res) {
        wx.setStorageSync("storedPhoneNum", res.result.data.phoneNumber)
      }).catch(function (res) {
        console.log(res)
      })
    }
    console.log(res)
  }
  /*自定义事件 结束 */
})