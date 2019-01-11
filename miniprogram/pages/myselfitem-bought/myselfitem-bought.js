/*我想要的里面没有分页，一次查完了*/
const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    storedPhoneNum: null,
    //物流信息
    tracesData:null
  },
  receiveGoodBtn:function(e){
    var that = this
    var gid = e.currentTarget.dataset.gid
    /*wx.request({
      url: config.host+'bought.jsp',
      data:{
        oper:"receiveGood",
        gid:gid
      },
      success:function(res){
        console.log(res.data)
        if(res.data.trim() == "确认收货成功"){
          wx.showToast({
            title: '确认收货成功',
            icon:"success",
            duration:618
          })
        }
      },
      fail:function(){

      },
      complete:function(){

      }
    })*/
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
      var openid = wx.getStorageSync("openid")
      console.log(openid)
      db.collection("user").where({
        _openid: openid
      })
      .get()
      .then(res=>{
        console.log(res)
        that.setData({
          goods: res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
  navigateToGoodDetail: function (e) {
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/index-good-detail/index-good-detail?good=" + goodstr + "&wanted_png=wanted.png",
    })
  },
  getTraces:function(e){
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/transport_query/transport_query?good=" + goodstr
    })
  },
  pay_not_pay:function(e){
    console.log(e)
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    var gid = good.id
    var out_trade_no = good.out_trade_no
    var total_fee = good.sell_price
    //支付未支付订单
    var payState = wxpay.pay(gid, out_trade_no, total_fee);
  },
  onPullDownRefresh: function () {},

  onReachBottom: function () {}
})