const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    focus:false,
    telphone:null,
    userInfo: null,
    good: null,
    wanted_icon:"nowanted.png",
    leaveMessage:null,
    leaveMessage_icon:"leaveMessage.png",
    leave_messages:[],
    wanted_flag:false,
    weatherHidePane: true, //默认隐藏
    openid: wx.getStorageSync("openid"),
    mallVersion: wx.getStorageSync("mallVersion")
  },
  /*生命周期事件 开始*/
  onLoad: function (options) {
    console.log(app.globalData)
    var telphone = wx.getStorageSync("storedPhoneNum")
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo
      })
    }
    var good = JSON.parse(options.good);
    console.log(good)
    this.setData({
      wanted_icon: options.wanted_png || "nowanted.png",//从“我的”点进来的，默认是想要
      userInfo: app.globalData.userInfo,
      telphone: telphone,
      good, good
    })
    this.hasWanted()
  },
  onShow: function () {
    var that = this
    //不能直接调用queryLeaveMessage,会提示尚未定义346134
    //不要放到onload，否则如果用户没登录，前往登录后，再返回，此时由于留言已经查询过了，这么自己发布的留言将会没有删除按钮
  },
  
  /*生命周期事件 结束*/ 
  /*自定义事件 开始 */
  wanted:async function () {
    var id = this.data.good._id
    var openid = this.data.openid
    var that = this
    db.collection("user").where({
      _openid: openid
    })
    .get()
    .then(res => {
      var u_id = res.data[0]._id
      console.log(u_id)
      if (that.data.wanted_flag){//已经收藏，此时点击则取消收藏
        db.collection("user").where({
          _openid: that.data.openid
        })
        .get()
        .then(res => {
          console.log(res)
          var want = res.data[0].want
          var length = want.length
          for(var i = 0;i < length;i++){
            var index = want.indexOf(id)
            if (index > -1) {
              want.splice(index, 1)
            }
          } 
          db.collection("user").doc(u_id).update({
            data: {
              want: want
            }
          })
          that.setData({
            wanted_icon: "nowanted.png",
            wanted_flag:false
          })
        })
      }else{//加入收藏
        db.collection("user").doc(u_id).update({
          data: {
            want: _.push([id])
          }
        })
        that.setData({
          wanted_icon: "wanted.png",
          wanted_flag:true
        })
      }
    })
  },
  hasWanted:function(){
    /*查询当前商品是否为我想要的,以设置收藏图标的颜色*/
    var that = this
    var id = this.data.good._id
    db.collection("user").where({
      _openid: that.data.openid
    })
    .get()
    .then(res => {
      console.log(res)
      var want = res.data[0].want
      for (var i in want) {
        if (id == want[i]) {
          that.setData({
            wanted_icon: "wanted.png",
            wanted_flag:true,
            want_arr: want
          })
          break;
        }
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  getLeaveMessage: function (e) {
    console.log("留言:" + e.detail.value)
    var leaveMessage = e.detail.value
    this.setData({
      leaveMessage: leaveMessage
    })
  },
  showLeaveMessagePane: function () {
    var telphone = util.checkLogin()
    if (!telphone) {//手机号不存在
      return
    }
    this.setData({
      weatherHidePane: false,
      submitBtnText: "留言",
      focus: true
    })
    console.log(this.data.userInfo)
  },
  submitLeaveMessage: function () {
    //获取留言者的账号（手机号/微信号）
    //留言的商品的id
    var id = this.data.good._id
    var openid  = this.data.openid
    //获取留言者的头像
    var avatarUrl = this.data.userInfo.avatarUrl
    //获取微信昵称
    var nickName = this.data.userInfo.nickName
    var that = this
    setTimeout(function () {
      //获取留言
      var leaveMessage = that.data.leaveMessage
      if (!leaveMessage || !leaveMessage.trim()) {
        wx.showToast({
          title: "说点什么吧~",
          icon: "loading",
          duration: 600
        })
        return
      }
      wx.showLoading({
        title: '奋力' + that.data.submitBtnText + '中^^',
      })
      if (that.data.submitBtnText == "留言") {
        db.collection("good").doc(id).update({
          data:{
            msg: _.push([{
              nick: nickName,
              avatar: avatarUrl,
              msg_txt: leaveMessage,
              openid: openid,
              msg_dt: util.formatTime(new Date()) 
            }])
          }
        })
        .then(res=>{
          wx.hideLoading()
          that.setData({
            weatherHidePane: true
          })
          wx.showToast({
            title: that.data.submitBtnText + '成功！',
            icon: 'success',
            duration: 600
          })
          that.queryLeaveMessage(id)
        })
        .catch(err=>{
          wx.showToast({
            title: that.data.submitBtnText + '失败！',
            icon: 'success',
            duration: 600
          })
        })
      }
    }, 500)
  },
  deleteLeaveMessage: function (e) {
    var index = e.target.dataset.index
    var msg_left = this.data.good.msg.splice(index,1)
    console.log(this.data.good)
    var id = this.data.good._id
    var that = this
    db.collection("good").doc(id).update({
      data:{
        msg:that.data.good.msg
      }
    })
    .then(res=>{
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 500
      })
      that.queryLeaveMessage(id)
    })
    .catch(err=>{
      console.log(err)
    })
  },
  queryLeaveMessage:function(id){
    var that = this
    db.collection("good").doc(id)
    .get()
    .then(res=>{
      console.log(res)
      that.setData({
        good:res.data
      })
    })
  },
  buyNowBtn: function () {
    /*不能买自己的商品*/
    var phonenum = util.checkLogin()//当前用户电话
    var telphone = this.data.good.telphone//商品所对应的电话
    var userInfo = this.data.userInfo
    if (phonenum && userInfo) {//phonenum && userInfo表示用户已经登录
      if (phonenum == telphone) {
        wx.showModal({
          title: '提示',
          content: '亲，不能买自己的商品哦',
        })
        return
      } else {
        var goodstr = JSON.stringify(this.data.good)
        wx.navigateTo({
          url: '/pages/order/order?good=' + goodstr
        })
      }
      // var goodstr = JSON.stringify(this.data.good)
      // wx.navigateTo({
      //   url: '/pages/order/order?good=' + goodstr
      // })
    }
  },
  contactSeller: function (e) {
    /*不能买自己的商品*/
    var good = e.currentTarget.dataset.good
    var phonenum = util.checkLogin()//当前用户电话
    var telphone = good.telphone//商品所对应的电话
    var userInfo = this.data.userInfo
    if (phonenum && userInfo) {//phonenum && userInfo表示用户已经登录
      if (phonenum == telphone) {
        wx.showModal({
          title: '提示',
          content: '亲，不能和自己聊天哦',
        })
        return
      } else {
        var goodstr = JSON.stringify(good)
        wx.navigateTo({
          url: "/pages/nim/nim?good=" + goodstr,
        })
      }
    }
  },
  closePane: function () {
    this.setData({
      weatherHidePane: true
    })
  },
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  }
  /*自定义事件 结束 */
})