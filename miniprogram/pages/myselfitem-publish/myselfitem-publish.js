//index.js
//获取应用实例
const util = require('../../utils/util.js')
const func = require('./func.js')
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    pageNum: 0,
    count: 5,
    goods: [],
    tip: "到底了(∩_∩)!!",
    tab1ChoosedStyle: "2px solid red;",
    tab2ChoosedStyle: "",
    currentTab:"online",//用于区分在架和上架宝贝，上拉加载哪一个，
    ifonline: "下架",
    storedPhoneNum: wx.getStorageSync("storedPhoneNum"),
    openid: wx.getStorageSync("openid")
  },
  /*声明周期事件 开始*/
  onLoad: function (options) {},
  onShow: function () {
    this.setData({
      tip: "到底了(∩_∩)!!"
    })
    var ifLogin = util.checkLogin()
    console.log("myselfpublish.js:登录状态:" + ifLogin)
    if (!ifLogin) {
      return
    } else {
      if (this.data.currentTab == "online") {
        this.onlineGoods();
      } else if (this.data.currentTab == "offline") {
        this.offlineGoods();
      }
    }
  },
  onReachBottom: function () {
    this.data.pageNum++;
    func.showReachBottomPublishGoods(this)
  },
  onPullDownRefresh: function () {
    func.showReachBottomPublishGoods(this)
  },
  /*生命周期事件 结束*/

  /*自定义事件 开始*/
  //点击预览图片
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  },
  //显示上架的商品
  onlineGoods: function () {
    this.setData({
      tab1ChoosedStyle: "2px solid red;",
      tab2ChoosedStyle: "",
      currentTab: "online",
      ifonline: "下架"
    })
    func.showPublishGoods(1, this);//1表示上架的
  },
  //显示下架的商品
  offlineGoods: function () {
    this.setData({
      tab1ChoosedStyle: "",
      tab2ChoosedStyle: "2px solid red;",
      currentTab: "offline",
      ifonline: "上架"
    })
    func.showPublishGoods(0, this);//0表示下架的 
  },
  //更改商品上架和下架状态
  makeOnlineOffline: function (e) {
    func.makeOnlineOffline(e, this)
  },
  //编辑下架的商品
  editGood:function (e) {
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/edit/edit?good=" + goodstr
    })
  },
  //删除下架的商品
  delGood: function (e) {
    console.log("删除商品")
    var delGoodId = e.currentTarget.dataset.id;
    console.log(delGoodId)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除商品吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中……',
          })
          var removed = db.collection("good").doc(delGoodId).remove()
          console.log(removed)
          wx.hideLoading()
          wx.showToast({
            title: '删除成功',
            duration: 800
          })
          func.showPublishGoods(0,that)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看商品详细信息
  navigateToGoodDetail: function (e) {
    var good = e.currentTarget.dataset.good
    var goodstr = JSON.stringify(good)
    wx.navigateTo({
      url: "/pages/index-good-detail/index-good-detail?good=" + goodstr,
    })
  }
  /*自定义事件 结束 */
})