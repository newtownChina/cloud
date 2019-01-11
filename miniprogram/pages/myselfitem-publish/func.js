/*myselfitem-publish func.js*/
const db = wx.cloud.database()
var _openid = wx.getStorageSync("openid")
var showPublishGoods = function(flag,_this) {
  _this.setData({
    pageNum: 0,
    tip: "加载中……"
  })
  var _pageNum = _this.data.pageNum
  var _count = _this.data.count
  console.log(_openid)
  db.collection('good').where({
    _openid: _openid,
    flag: flag//上架
  })
  .orderBy('pub_dt', 'desc')
  .skip(_pageNum * _count)
  .limit(_count)
  .get()
  .then(res => {
    console.log(res)
    _this.setData({
      goods: res.data
    })
    if (res.data.length < _this.data.count) {
      _this.setData({
        tip: "到底了(∩_∩)!!"
      });
    }
  })
  .catch(err => {
    console.log(err)
  })
}
var showReachBottomPublishGoods = function (_this){
  _this.setData({
    tip: "加载中……"
  })
  var _pageNum = _this.data.pageNum
  var _count = _this.data.count
  if (_this.data.currentTab == "online") {
    db.collection('good').where({
      _openid: _openid,
      flag: 1   //显示的为上架的
    })
    .orderBy('pub_dt', 'desc')
    .skip(_pageNum * _count)
    .limit(_count)
    .get()
    .then(res => {
      console.log(res.data)
      var showedGoods = _this.data.goods;//老数据
      if (res.data.length < _this.data.count) {//新数据
        _this.setData({
          tip: "到底了(∩_∩)!!"
        })
      }
      for (var index in res.data) {//追加商品
        showedGoods.push(res.data[index])
      }
      _this.setData({
        goods: showedGoods
      })
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    db.collection('good').where({
      _openid: _openid,
      flag: 0     //下架的
    })
    .orderBy('pub_dt', 'desc')
    .skip(_pageNum * _count)
    .limit(_count)
    .get()
    .then(res => {
      console.log(res.data)
      var showedGoods = _this.data.goods;//老数据
      if (res.data.length < _this.data.count) {//新数据
        _this.setData({
          tip: "到底了(∩_∩)!!"
        })
      }
      for (var index in res.data) {//追加商品
        showedGoods.push(res.data[index])
      }
      _this.setData({
        goods: showedGoods
      })
    })
    .catch(err => {
      console.log(err)
    })
  }
}
var pullDownRefresh = function(_this){
  console.log("下拉刷新时的选择的选项卡：" + _this.data.currentTab)
  var currentTab = _this.data.currentTab
  var showOnline = true
  if (currentTab == "online") {
    showOnline = true
    var tab1ChoosedStyle = "2px solid red;"
    var tab2ChoosedStyle = ""
  } else {
    showOnline = false
    var tab1ChoosedStyle = ""
    var tab2ChoosedStyle = "2px solid red;"
  }
  //下拉刷新的时候显示的是在架的
  _this.setData({
    tab1ChoosedStyle: tab1ChoosedStyle,
    tab2ChoosedStyle: tab2ChoosedStyle,
    currentTab: currentTab,
    tip: "加载中……"
  })
  //如果用户在上拉很多次后，那么在下拉刷新的时候pageNum已经累加很多次，不会从头显示，这里要重新初始化
  _this.data.pageNum = 0;
  wx.showNavigationBarLoading()
  var _pageNum = _this.data.pageNum
  var _count = _this.data.count
  console.log(_openid)
  db.collection('good').where({
    _openid: _openid,
    flag: flag//上架
  })
  .orderBy('pub_dt', 'desc')
  .skip(_pageNum * _count)
  .limit(_count)
  .get()
  .then(res => {
    console.log(res)
    _this.setData({
      goods: res.data
    })
    if (res.data.length < _this.data.count) {
      _this.setData({
        tip: "到底了(∩_∩)!!"
      });
    }
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  })
  .catch(err=>{
    console.log(err)
  })
}
var makeOnlineOffline = function (e,_this){
  var flag
  wx.showLoading({
    title: '君稍等……',
  })
  var id = e.target.dataset.id
  if (_this.data.ifonline == "下架") {
    flag = 0;//
  } else if (_this.data.ifonline == "上架") {
    flag = 1//
  }
  db.collection('good').doc(id)
  .update({
    data: {
      flag: flag
    },
  })
  .then(res => {
    console.log(res)
    wx.hideLoading()
    wx.showToast({
      title: _this.data.ifonline + "成功！",
      icon: 'success',
      duration: 1000
    })
    console.log(_this.data.ifonline)
    //重新查询当前选项卡上下架信息
    var flag = _this.data.currentTab == "online" ? 1 : 0;
    showPublishGoods(flag, _this)
  })
  .catch(res => {
    console.log(res)
    wx.hideLoading()
    wx.showToast({
      title: _this.data.ifonline + "失败！",
      icon: 'loading',
      duration: 1000
    })
  })
}
module.exports.showPublishGoods = showPublishGoods
module.exports.showReachBottomPublishGoods = showReachBottomPublishGoods
module.exports.pullDownRefresh = pullDownRefresh
module.exports.makeOnlineOffline = makeOnlineOffline