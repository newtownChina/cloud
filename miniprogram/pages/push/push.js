const util = require('../../utils/util.js')
const db = wx.cloud.database()
const app = getApp();
Page({
  data: {
    userInfo: {},
    addPicPosition: "0 auto",
    tempjpgs: [],//用于上传数据的tempjpgs
    textposition: "",
    classifyDetailName: "分类",
    goodName:"",
    goodDesc:"",
    sellPrice: "",
    costPrice:"",
    priceFocus:false,//移动光标到价格输入面板
    isHidden: true//,
    //publishing:false//是否正在发布中，防止用户多次点击
  },
  /*生命周期事件 开始 */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  //获取分类页面设置的全局变量，这样从分类页返回时候可以获取值
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log("页面加载")
    if (app.globalData.classifyDetailName) {//表示是在分类选项卡选了新分类
      this.setData({
        classifyDetailName: app.globalData.classifyDetailName
      })
    }
    //没有改变分类则使用editingGoodInfo的分类
  },
  /*生命周期事件 结束 */

  /*自定义事件 开始*/
  /*用于再次发布时初始化 */
  init:function(){
    this.setData({
      addPicPosition: "0 auto",
      tempjpgs: [],//用于上传数据的tempjpgs
      showtempjpgs: [],//用于在wxml显示
      textposition: "",
      classifyDetailName: "分类",
      goodName: null,
      goodDesc: "",
      sellPrice: "",
      costPrice: "",
      priceFocus:false,
      isHidden: true
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
        console.log(that.data.tempjpgs)
        var old_tempjpgs = that.data.tempjpgs
        console.log("开始向缓存中插入图片")
        if (old_tempjpgs.length + tempFilePaths.length > 3) {
          wx.showToast({
            title: '还可以添加' + (3 - old_tempjpgs.length) + "张图片",
          })
        } else {//原有的图片和新选择的图片不多于3张图片
          for (var i = 0; i < tempFilePaths.length; i++) {
            old_tempjpgs.push(tempFilePaths[i])
          }
          that.setData({
            tempjpgs: old_tempjpgs,
            addPicPosition: "0"
          })
        }
        console.log("以下是添加选择的图片后的新tempjpgs")
        console.log(that.data.tempjpgs);
        console.log("一下是匹配以https://tmp开的路径")
        for (var i = 0; i < that.data.tempjpgs.length; i++) {
          console.log(that.data.tempjpgs[i])
          console.log(that.data.tempjpgs[i].indexOf("//tmp"))
        }
      }
    })
  },
  navigateToClassify: function () {
    wx.navigateTo({ url: "../classify/classify" })
  },
  showPriceGivenPane: function () {
    this.setData({
      isHidden: false,
      priceFocus:true
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
    if (!ifLogin) {
      return
    }
    console.log(this.data.classifyDetailName)
    if (this.data.tempjpgs.length <= 0) {
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
      })//parseFloat在价格是0.0.1.0.1这种情况会解析成0，防止价格输入错误，发布失败
    } else if (parseFloat(!this.data.sellPrice) || parseFloat(this.data.sellPrice) <= 0.01) {    //检查售价
      wx.showToast({
        title: "卖价低于1分",
        icon: "loading",
        duration: 800
      })
    } else if (parseFloat(!this.data.costPrice) || parseFloat(this.data.costPrice) <= 0.01) {    //检查原价
      wx.showToast({
        title: "原价低于1分",
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
      console.log(this.data.storedPhoneNum)
      wx.showLoading({
        title: '发布中……',
      })
      //数据校验通过，发布商品 
      var that = this
      setTimeout(function () {
        /*注意务必在数据校验通过这里设置发布状态，否则在校验前发布，
        可能因为校验不通过再次修改，而使得发布状态改变导致无法发布*/
        // if (that.data.publishing) {//正在发布中，不准再次发布
        //   console.log("已经在发布中，请勿重复发布")
        //   return
        // }
        // that.setData({//如果之前没在发布中
        //   publishing: true //改变状态为发布中
        // })
        var jpgCount = that.data.tempjpgs.length
        var good_pics = []
        for (var i = 0; i < jpgCount; i++) {
          console.log("我是uploadFile方法：")
          if (that.data.tempjpgs[i] != null && that.data.tempjpgs[i].indexOf("//tmp") >= 0) {
            console.log("准备上传：" + that.data.tempjpgs[i])
            var ext_name = that.data.tempjpgs[i].match(/.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/)[0]
            var date = new Date()
            var timestamp = date.getTime()
            wx.cloud.uploadFile({
              cloudPath: "images/" + timestamp + ext_name,
              filePath: that.data.tempjpgs[i], // 文件路径
            }).then(res => {
              // get resource ID
              console.log(res.fileID)
              good_pics.push(res.fileID)
              if (good_pics.length == jpgCount) {//表明图片已经传完
                db.collection('good').add({
                  data: {
                    avatar: that.data.userInfo.avatarUrl,
                    clas: that.data.classifyDetailName,
                    desc: that.data.goodDesc,
                    flag: 1,
                    msg: [],
                    name: that.data.goodName,
                    nick: that.data.userInfo.nickName,
                    pics: good_pics,
                    prc_b: that.data.costPrice,
                    prc_s: that.data.sellPrice,
                    pub_dt: util.formatTime(new Date())//,
                    //tel: that.data.storedPhoneNum
                  }
                }).then(res => {
                  console.log(res)
                  wx.hideLoading()
                  wx.showModal({
                    title: '发布成功',
                    content: '是否继续发布？',
                    success(res) {
                      if (res.confirm) {
                        console.log('继续发布')
                        that.init()   
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                        console.log('不继续发布')
                      }
                    }
                  })
                }).catch(res => {
                  wx.showToast({
                    title: '商品发布失败',
                  })
                  console.log(res)
                })
              }
            }).catch(error => {
              wx.showToast({
                title: '图片上传失败',
              })
              console.log(error)
            })
          }
        }
      }, 1000)
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
    console.log("获取到的新价格:" + e.detail.value)
    this.setData({
      sellPrice: e.detail.value
    })
  },
  getCostPrice: function (e) {
    console.log("获取到的新价格:" + e.detail.value)
    this.setData({
      costPrice: e.detail.value
    })
  },

  deleteChoosedPic: function (e) {
    //用于上传的图片tempjpgs和用于在wxml中显示的showtempjpgs的区别是有null填充
    var index = e.target.dataset.id;
    var deletedPic = this.data.tempjpgs.splice(index, 1);//返回被删除元素的数组
    console.log("删除的元素:" + deletedPic)
    this.setData({
      tempjpgs: this.data.tempjpgs,
    })
    //图片删光后，添加图片按钮还要居中
    if (this.data.tempjpgs.length < 1) {
      this.setData({
        addPicPosition: "0 auto"
      })
    }
    console.log("------------------点叉号后tempjpgs:--------------")
    console.log(this.data.tempjpgs)
    console.log(this)
    console.log("------------------点叉号后tempjpgs:--------------")
  },
  //点击预览等待上传的图片
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  }
  /*自定义事件 结束 */
})
