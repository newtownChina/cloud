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
  saveQrCode:function(){
    wx.saveImageToPhotosAlbum({
      filePath: '/images/qun.png',
      success:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      storedPhoneNum: wx.getStorageSync("storedPhoneNum")
    })
    console.log("加载")
  }
})