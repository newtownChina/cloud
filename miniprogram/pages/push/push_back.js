//logs.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    addPicPosition: "0 auto",
    tempjpgs: [],//用于上传数据的tempjpgs
    showtempjpgs:[],//用于在wxml显示
    textposition: "",
    classifyDetailName: "分类",
    sellPrice: "开价",
    isHidden: true
  },
  getLocation: function (event) {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              util.openMapLocation();
            }
          })
        } else {
          util.openMapLocation();
        }
      }
    })
  },
  addPic: function () {
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          showtempjpgs: tempFilePaths,
          tempjpgs: tempFilePaths,
          addPicPosition: "0"
        });
        console.log(that.data.tempjpgs);
      }
    })
  },
  navigateToClassify: function () {
    wx.navigateTo({ url: "../classify/classify" })
  },
  showPriceGivenPane: function () {
    this.setData({
      isHidden: false
    });
  },
  yesPrice: function () {
    this.setData({
      isHidden: true
    });
  },
  checkAndPush: function () {
    //检查登录状态
    var ifLogin = util.checkLogin()
    if(!ifLogin){//用户没登录则结束
      return;
    }
    if (!this.data.tempjpgs.length > 0) {
      wx.showToast({
        title: "请添加照片",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.goodName) {    //检查名字
      wx.showToast({
        title: "请给商品取个名字",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.goodDesc) {    //检查描述
      wx.showToast({
        title: "请添加描述",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.classifyDetailName || this.data.classifyDetailName === "分类" || this.data.classifyDetailName === "显示全部") {     //检查分类
      wx.showToast({
        title: "请选择分类",
        icon: "loading",
        duration: 800
      })
    } else if (this.data.sellPrice <= 0) {    //检查售价
      wx.showToast({
        title: "价格不能为0",
        icon: "loading",
        duration: 800
      })
    } else if (this.data.cosePrice <= 0) {    //检查原价
      wx.showToast({
        title: "原价不能为0",
        icon: "loading",
        duration: 800
      })
    } else {//输入检查合格
      console.log(this.data.tempjpgs)
      console.log(this.data.goodName)
      console.log(this.data.goodDesc)
      console.log(this.data.classifyDetailName)
      console.log(this.data.sellPrice)
      console.log(this.data.costPrice)
      console.log(this.data.telphone)
      //上传数据
      wx.showLoading({
        title: '发布中……',
      })
      var that = this
      wx.request({
        url: 'https://www.51taojin.cc/xywt/upload.jsp',
        data: {
          "goodName": that.data.goodName,
          "goodDesc": that.data.goodDesc,
          "classifyDetailName": that.data.classifyDetailName,
          "sellPrice": that.data.sellPrice,
          "costPrice": that.data.costPrice,
          "telphone": that.data.storedPhoneNum,
          "nickName": that.data.userInfo.nickName,
          "avatarUrl": that.data.userInfo.avatarUrl,
          "ifSavePic": false
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)//在用户添加的商品插入成功后再获取id插入图片
          var jpgCount = that.data.tempjpgs.length
          for (var i = 0; i < jpgCount; i++) {
            console.log(that.data.tempjpgs[i]!=null)
            if (that.data.tempjpgs[i]!=null){
              wx.uploadFile({
                url: 'https://www.51taojin.cc/xywt/upload.jsp',
                filePath: that.data.tempjpgs[i],
                name: 'uploadPic',
                formData: {
                  telphone: that.data.storedPhoneNum,
                  ifSavePic: true
                },
                success: function (res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: "发布成功!",
                    icon: "success",
                    duration: 800
                  })
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                },
                fail: function (res) {
                  wx.showToast({
                    title: "发布失败%>_<%",
                    icon: "loading",
                    duration: 800
                  })
                }
              })
            }
          }
          app.globalData.classifyDetailName = "显示全部"//如果不设置，则只显示当前选中的分类
        }
      })
    }
  },
  getGoodName: function (e) {
    this.setData({
      goodName: e.detail.value
    })
  },
  getGoodDesc: function (e) {
    this.setData({
      goodDesc: e.detail.value
    })
  },
  getTelphone: function (e) {
    this.setData({
      telphone: e.detail.value
    })
  },
  getSellPrice: function (e) {
    this.setData({
      sellPrice: e.detail.value
    })
  },
  getCostPrice: function (e) {
    this.setData({
      costPrice: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "userInfo": app.globalData.userInfo
    })
    console.log("push.js:"+this.data.userInfo.nickName)
  },
  //获取分类页面设置的全局变量，这样从分类页返回时候可以获取值
  onShow: function () {
    this.setData({
      classifyDetailName: app.globalData.classifyDetailName,
      storedPhoneNum: wx.getStorageSync("storedPhoneNum")
    })
  },
  deleteChoosedPic:function(e){
    //用于上传的图片tempjpgs和用于在wxml中显示的showtempjpgs的区别是有null填充
    var index = e.target.dataset.id;
    console.log("index:"+index)
    this.data.tempjpgs.splice(index,1,null);//返回删除元素后的新数组
    this.data.showtempjpgs.splice(index, 1);
    this.setData({
      tempjpgs: this.data.tempjpgs,
      showtempjpgs: this.data.showtempjpgs
    })
    console.log(this.data.tempjpgs)
    console.log(this.data.showtempjpgs)
    //图片删光后，添加图片按钮还要居中
    if (this.data.showtempjpgs.length<1){
      this.setData({
        addPicPosition: "0 auto"
      })
    }
  },
  //点击预览等待上传的图片
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  }
})
