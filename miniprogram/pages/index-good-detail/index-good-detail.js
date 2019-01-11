const util = require('../../utils/util.js')
const app = getApp()
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
    weatherHidePane: true, //默认隐藏
    openid: wx.getStorageSync("openid")
  },
  wanted: function () {
    if(!telphone){//手机号不存在
      return
    }
    var g_id = this.data.good.id
    var that = this
    wx.request({
      url: config.host+'wanted.jsp',
      data: {
        telphone: telphone,
        g_id: g_id
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.trim() == "wanted") {
          that.setData({
            wanted_icon: "wanted.png"
          })
        } else if (res.data.trim() == "nowanted") {
          that.setData({
            wanted_icon: "nowanted.png"
          })
        }
      }
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
      submitBtnText:"留言",
      focus:true
    })
    console.log(this.data.userInfo)
  },
  submitLeaveMessage: function () {
    //获取留言者的账号（手机号/微信号）
    var telphone = util.checkLogin();
    //留言的商品的id
    var g_id = this.data.good.id
    //获取留言者的头像
    var avatarUrl = this.data.userInfo.avatarUrl
    //获取微信昵称
    var nickName = this.data.userInfo.nickName
    var that = this
    setTimeout(function(){
      //获取留言
      var leaveMessage = that.data.leaveMessage
      if (!leaveMessage||!leaveMessage.trim()) {
        wx.showToast({
          title: "说点什么吧~",
          icon:"loading",
          duration:600
        })
        return
      }
      wx.showLoading({
        title: '奋力'+that.data.submitBtnText+'中^^',
      })
      if(that.data.submitBtnText == "留言"){
        wx.request({
          url: config.host+'leaveMessage.jsp',
          data: {
            g_id: g_id,
            oper: "add",//增加留言,del是删除
            avatarUrl: avatarUrl,
            nickName: nickName,
            telphone: telphone,
            leaveMessage: leaveMessage
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading()
            wx.showToast({
              title: that.data.submitBtnText + '成功！',
              icon: 'success',
              duration: 600
            })
            if (res.data.trim() == "addLeaveMessageSuccess") {
              //刷新留言
              that.queryLeaveMessage(that, g_id)//传入当前页面，否则会提示that未定义
              //留言成功关闭留言板
              that.setData({
                weatherHidePane: true
              })
            }
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      }else if(that.data.submitBtnText=="回复"){
        console.log('回复的id：' + that.data.respId)
        wx.request({
          url: config.host+'leaveMessage.jsp',
          data: {
            oper: "resp",//增加回复
            respId: that.data.respId,
            leaveMessage: leaveMessage//此时是回复
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading()
            wx.showToast({
              title: that.data.submitBtnText + '成功！',
              icon: 'success',
              duration: 600
            })
            if (res.data.trim() == "addRespLeaveMessageSuccess") {
              //刷新回复
              that.queryLeaveMessage(that, g_id)//传入当前页面，否则会提示that未定义
              //留言成功关闭留言板
              that.setData({
                weatherHidePane: true
              })
            }
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      }
    },500)
  },
  deleteLeaveMessage: function (e) {
    var deleteId = e.target.dataset.id
    var g_id = this.data.good.id
    var that = this
    wx.request({
      url: config.host+'leaveMessage.jsp',
      data: {
        oper: "del",
        telphone: this.data.telphone,
        id: deleteId
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 500
        })
        if (res.data.trim() == "deletedLeaveMessageSuccess") {
          that.queryLeaveMessage(that, g_id)
        }
      }
    })
  },
  deleteRespLeaveMessage:function(e){
    var deleteRespId = e.target.dataset.id
    var g_id = this.data.good.id
    var that = this
    console.log("删除的回复的id:"+deleteRespId)
    wx.request({
      url: config.host+'leaveMessage.jsp',
      data: {
        oper: "delResp",
        id: deleteRespId
      },
      success: function (res) {
        if (res.data.trim() == "deletedRespLeaveMessageSuccess") {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 500
          })
          that.queryLeaveMessage(that, g_id)
        }
      }
    })
  },
  showRespLeaveMessagePane:function(e){
    //回复的留言的id
    var respId = e.target.dataset.id
    console.log("回复的留言的id:"+respId)
    this.setData({
      weatherHidePane:false,
      submitBtnText:"回复",
      respId:respId
    })
  },
  buyNowBtn:function(){
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
  closePane:function(){
    this.setData({
      weatherHidePane:true
    })
  },
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  },
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
      good,good
    })
    
    /*查询当前商品是否为我想要的,以设置收藏图标的颜色*/
    var that = this
    return
    if (telphone) {//如果手机号存在，则查询
      console.log("手机号存在")
      wx.request({
        url: config.host+'queryWeatherInWanted.jsp',
        data: {
          telphone: this.data.telphone,
          g_id: g_id
        },
        success: function (res) {
          console.log(res.data)
          /*默认是nowanted.png，如果是已经加入我想要了，则变为wanted.png*/
          if (res.data.trim() == "hasInWanted") {
            that.setData({
              wanted_icon: "wanted.png"
            })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
    } else {
      console.log("手机号还不存在")
    }
    this.setData({
      good: good
    })
  },
  onShow: function () {
    var that = this
    //不能直接调用queryLeaveMessage,会提示尚未定义346134
    //不要放到onload，否则如果用户没登录，前往登录后，再返回，此时由于留言已经查询过了，这么自己发布的留言将会没有删除按钮
  },
  contactSeller:function(e){
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
  }
})