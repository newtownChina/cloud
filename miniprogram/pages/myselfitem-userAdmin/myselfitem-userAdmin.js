// pages/myselfitem-userAdmin/userAdmin.js
Page({
  data: {
    pageNum:0,
    count:10,
    users:[]
  },
  onLoad: function (options) {
    this.data.pageNum = 0
  },
  onShow: function () {
    var that = this
    wx.request({
      url: config.host+'admin.jsp',
      data: {pageNum:this.data.pageNum, count:this.data.count, oper: "queryAllUser" },
      success:function(res){
        console.log(res.data)
        that.setData({
          users:res.data
        })
      }
    })
  },
  switchChange:function(e){
    console.log(e)
    var that = this
    var telphone = e.currentTarget.dataset.telphone
    var value = e.detail.value;//这个值是携带的值
    if(value){//表明冻结了
      wx.request({
        url: config.host+'admin.jsp',
        data: { telphone: telphone, oper:"freezingAccount"},
        success:function(res){
          console.log(res.data)
          if (res.data.freezingState == "true"){
            wx.showLoading({
              title: '已冻结！',
              duration:500
            })
          }else{
            wx.showModal({
              title: '冻结失败！',
              content: '请检查网络连接！',
            })
          }
        }
      })
    }else{//表明解冻
      wx.request({
        url: config.host+'admin.jsp',
        data: { telphone: telphone, oper: "unFreezingAccount" },
        success: function (res) {
          console.log(res.data)
          if (res.data.unFreezingState == "true") {
            wx.showLoading({
              title: '已解冻！',
              duration: 500
            })
          }else{
            wx.showModal({
              title: '解冻失败！',
              content: '请检查网络连接！',
            })
          }
        }
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: config.host+'admin.jsp',
      data: { pageNum: 0, count: this.data.count, oper: "queryAllUser" },
      success: function (res) {
        console.log(res.data)
        that.setData({
          users: res.data
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    this.data.pageNum += this.data.count
    console.log("页码："+this.data.pageNum)
    console.log("个数："+this.data.count)
    that.setData({
      tip: "加载中……"
    })
    wx.request({
      url: config.host+'admin.jsp',
      data: {pageNum: this.data.pageNum,count: this.data.count,oper: "queryAllUser"},
      success:function(res){
        var showedUsers = that.data.users;//老数据
        if (res.data.length == 0) {//新数据
          that.setData({
            tip: "到底了(∩_∩)!!"
          })
        } else {//有新数据
          for (var index in res.data) {//追加商品
            showedUsers.push(res.data[index])
          }
          that.setData({
            users: showedUsers
          })
          console.log(that.data.users)
        }
      }
    })
  }
})