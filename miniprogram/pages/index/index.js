//index.js
//功能：展示所有在线商品
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/util.js')
Page({
  data: {
    showState: "",//showState用于区分当reachBottom时是分类触底还是搜索触底，值为"",或者search
    pageNum:0,
    count:5,
    goods:[],
    tip:"到底了(∩_∩)!!",
    sortWay:"tim",
    searchKeyword:"",
    openid:app.globalData.openid
  },
  /*生命周期事件 开始 */
  onLoad:function(){
    wx.setStorageSync("indexClassify",{detailName: "全部", resetPageNum:0})
  },
  onShow: function (options) {
    //默认按照时间倒序排列
    util.changeBgColor("green", "white", "white", "white",this)
    //为了防止在搜索时，每次查看商品详情后，反而去查询按照分类显示的商品
    if (this.data.showState =="search"){
      return
    }
    var that = this
    var indexClassify = wx.getStorageSync("indexClassify");
    this.data.pageNum = indexClassify.resetPageNum
    var detailName = indexClassify.detailName
    this.setData({
      tip:"加载中……",
      detailName: detailName
    })
    var _pageNum = that.data.pageNum
    var _count = that.data.count
    console.log(_pageNum * _count)
    var option = {}
    if (detailName == "全部"){
      option = { 
        flag:1
      }
    }else{
      option = {
        flag: 1,
        clas: detailName
      }
    }
    db.collection('good').where(option)
    .orderBy('pub_dt', 'desc')
    .skip(_pageNum * _count)
    .limit(_count)
    .get()
    .then(res => {
      console.log(res)
      if (res.data.length > 0) {
        var tip = "加载中……"
        if (res.data.length < that.data.count) {
          tip = "到底了(∩_∩)!!"
        }
        that.setData({
          goods: util.sortData(res.data, that.data.sortWay),
          tip: tip
        })
      } else {//一个都没有
        wx.showToast({
          title: '抱歉，还没有哦',
          icon: 'loading',
          duration: 1000
        })
        //如果没有查到当前分类的数据，还原之前的分类以显示
        var oldIndexClassify = wx.getStorageSync("indexClassify")
        wx.setStorageSync("indexClassify", oldIndexClassify)
        that.setData({
          tip: "到底了(∩_∩)!!",
          //刷新分类显示
          detailName: oldIndexClassify.detailName
        })
      }
    })
  },
  onReachBottom:function () {
    this.setData({
      tip: "加载中……",
    })
    this.data.pageNum ++;
    var that = this
    //当为搜索状态时的触底
    if (this.data.showState == "search") {
      console.log(this.data.showState)
      var _pageNum = that.data.pageNum
      var _count = that.data.count
      var option = {
        name: db.RegExp({
          regexp: "[a-zA-Z0-9]*" + keyword + "[a-zA-Z0-9]*",
          options: 'i'
        })
      }
      db.collection('good').where(option)
      .orderBy('pub_dt', 'desc')
      .skip(_pageNum * _count)
      .limit(_count).get()
      .then(res => {
        var showedGoods = that.data.goods;//老数据
        if (res.data.length == 0) {//新数据
          that.setData({
            tip: "到底了(∩_∩)!!"
          })
        } else {//有新数据
          for (var index in res.data) {//追加商品
            showedGoods.push(res.data[index])
          }
          that.setData({
            goods: util.sortData(showedGoods, that.data.sortWay)
          })
        }
      })
    } else {
      //不是搜索触底
      var _pageNum = that.data.pageNum
      var _count = that.data.count
      console.log(_pageNum * _count)
      var indexClassify = wx.getStorageSync("indexClassify")
      var detailName = indexClassify.detailName
      if (detailName == "全部") {
        option = {
          flag: 1
        }
      } else {
        option = {
          flag: 1,
          clas: detailName
        }
      }
      db.collection('good').where(option)
      .orderBy('pub_dt', 'desc')
      .skip(_pageNum * _count)
      .limit(_count).get()
      .then(res => {
        console.log(res)
        var showedGoods = that.data.goods;//老数据
        if (res.data.length == 0) {//新数据
          that.setData({
            tip: "到底了(∩_∩)!!"
          })
        } else {//有新数据
          for (var index in res.data) {//追加商品
            showedGoods.push(res.data[index])
          }
          that.setData({
            goods: util.sortData(showedGoods, that.data.sortWay)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  onPullDownRefresh:function() {
    //如果用户在上拉触底很多次后，那么在下拉刷新的时候pageNum已经累加很多次，需初始化为0
    this.setData({
      tip:"到底了(∩_∩)!!",
      showState:"",//将showState改为默认
      pageNum:0
    })
    var detailName = wx.getStorageSync("indexClassify").detailName
    var that = this
    wx.showNavigationBarLoading()
    var _pageNum = that.data.pageNum
    var _count = that.data.count
    var option = {}
    if (detailName == "全部") {
      option = {
        flag: 1
      }
    } else {
      option = {
        flag: 1,
        clas: detailName
      }
    }
    db.collection('good').where(option)
    .orderBy('pub_dt', 'desc')
    .skip(_pageNum * _count)
    .limit(_count)
    .get()
    .then(res => {
      console.log(res)
      if (res.data.length > 0) {
        var tip = "加载中……"
        if (res.data.length < that.data.count) {
          tip = "到底了(∩_∩)!!"
        }
        that.setData({
          goods: util.sortData(res.data, that.data.sortWay),
          tip: tip
        });
      } else {//一个都没有
        that.setData({
          goods: util.sortData(res.data, that.data.sortWay),
          tip: "到底了(∩_∩)!!"
        });
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }) 
  },
  /*生命周期事件 结束 */
  /*自定义事件 开始 */
  previewImg:function(e){
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  },
  phoneCall:function(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone 
    })
  },
  chooseClassify:function(){
    wx.navigateTo({
      url: '/pages/index-classify/index-classify',
    })
  },
  navigateToGoodDetail:function(e){
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/index-good-detail/index-good-detail?good=" + goodstr
    })
  },
  getKeyword:function(e){
    console.log("等待搜索的关键词"+e.detail.value)
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKeyword:function(){
    var that = this
    if(!this.data.keyword){
      wx.showToast({
        title: '请输入内容哦~',
        icon:"loading",
        duration:800
      })
    }else{
      this.setData({
        showState: "search",
        pageNum: 0,//当搜索时，要从0开始
        count: 5
      })
      var keyword = this.data.keyword
      
      var option = {
        name: db.RegExp({
          regexp: "[a-zA-Z0-9]*" + keyword + "[a-zA-Z0-9]*",
          options: 'i'
        })
      }
      console.log(option)
      db.collection("good").where(option)
      .get()
      .then(res=>{
        if (res.data.length > 0) {
          that.setData({
            goods: util.sortData(res.data, that.data.sortWay),
            tip: "到底了(∩_∩)!!"
          })
        } else {//一个都没有
          wx.showToast({
            title: '没有相关商品',
            icon: 'loading',
            duration: 1000
          })
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
  /*点击排序按钮 */
  changeSortWay:function(e){
    var that = this
    var sortWay = e.currentTarget.dataset.id
    //说明是重复点击当前排序方式，则倒序显示
    if (sortWay == that.data.sortWay){
      console.log("翻转数组")
      this.setData({
        goods: that.data.goods.reverse()
      })
      return 
    }
    /*直接通过js对查询结果排序即可，有新内容则重新排序并setData() */
    if ("tim" == sortWay){
      this.setData({
        sortWay:"tim",
        goods: util.sortData(that.data.goods,"tim")
      })
      //改变背景色
      util.changeBgColor("green", "white", "white", "white",this)
      console.log("sortWay:"+this.data.sortWay)
    } else if ("pri" == sortWay){
      this.setData({
        sortWay: "pri",
        goods: util.sortData(that.data.goods, "pri")
      })
      util.changeBgColor("white", "green", "white", "white",this)
      console.log("sortWay:"+this.data.sortWay)
    } else if ("hot" == sortWay){
      this.setData({
        sortWay: "hot",
        goods: util.sortData(that.data.goods, "hot")
      })
      util.changeBgColor("white", "white", "green", "white",this)
      console.log("sortWay:"+this.data.sortWay)
    } else if ("sum" == sortWay){
      this.setData({
        sortWay: "sum",
        goods: util.sortData(that.data.goods, "sum")
      })
      util.changeBgColor("white", "white", "white", "green",this)
      console.log("sortWay:"+this.data.sortWay)
    }
  },
  getUserInfo: function (res) {
    if ("getUserInfo:ok" == res.detail.errMsg) {
      app.globalData.userInfo = res.detail.userInfo
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(res.detail)
        console.log("调用了 app.userInfoReadyCallback")
      }
      wx.switchTab({
        url: '/pages/index/index',
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
  }
  /*自定义事件 结束 */
})