//edit.js
//功能：在用户发布商品后，用户可编辑（文字，图片）并重新发布（在push页面的基础上修改的）
const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    userInfo:{},
    addPicPosition: "0 auto",
    textposition: "",
    classifyDetailName: "分类",
    sellPrice: "0",
    isHidden: true
  },
  /*声明周期事件 开始 */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log("push.js:" + this.data.userInfo.nickName)
    var editingGoodInfo = JSON.parse(options.good);
    console.log("edit.js:进入editingGoodInfo:")
    console.log(editingGoodInfo)
    this.setData({
      "good": editingGoodInfo,
      "addPicPosition": editingGoodInfo.pics.length == 0 ? "0 auto" : "0",
      "ifSavePic": false
    })
    console.log("onload时候的分类:" + this.data.classifyDetailName)
  },
  //获取分类页面设置的全局变量，这样从分类页返回时候可以获取值
  onShow: function () {
    this.setData({
      storedPhoneNum: wx.getStorageSync("storedPhoneNum")
    })
    console.log("页面加载")
    if (app.globalData.classifyDetailName) {//表示是在分类选项卡选了新分类
      this.setData({
        "good.clas": app.globalData.classifyDetailName
      })
    }
    //没有改变分类则使用editingGoodInfo的分类
  },
  /*生命周期事件 结束 */
  /*自定义事件 开始 */
  addPic: function () {
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var old_pics = that.data.good.pics
        console.log("开始向缓存中插入图片")
        if (old_pics.length + tempFilePaths.length > 3) {
          wx.showToast({
            title: '还可以添加' + (3 - old_pics.length) + "张图片",
          })
        } else {//原有的图片和新选择的图片不多于3张图片
          for (var i = 0; i < tempFilePaths.length; i++) {
            old_pics.push(tempFilePaths[i])
          }
          that.data.good.pics = old_pics
          that.setData({
            good: that.data.good,
            addPicPosition: "0"
          })
        }
        console.log("以下是添加选择的图片后的新good.pics")
        console.log(that.data.good.pics);
        console.log("一下是匹配以https://tmp开的路径")
        for (var i = 0; i < that.data.good.pics.length; i++) {
          console.log(that.data.good.pics[i])
          console.log(that.data.good.pics[i].indexOf("//tmp"))
        }
      }
    })
  },
  //出价面板
  showPriceGivenPane: function () {
    this.setData({
      isHidden: false
    });
  },
  //确定出价
  yesPrice: function () {
    this.setData({
      isHidden: true
    });
  },
  //校验各字段值并发布
  checkAndPush: function () {
    //检查登录状态
    var ifLogin = util.checkLogin()
    if (!ifLogin || !app.globalData.userInfo) {
      return
    }
    console.log(this.data.classifyDetailName)
    if (!this.data.good.pics.length > 0) {
      wx.showToast({
        title: "请添加照片",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.good.name) {    //检查名字
      wx.showToast({
        title: "请给商品取个名字",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.good.desc) {    //检查描述
      wx.showToast({
        title: "请添加描述",
        icon: "loading",
        duration: 800
      })
    } else if (!this.data.good.clas || this.data.clas === "分类" || this.data.clas === "显示全部") {     //检查分类
      wx.showToast({
        title: "请选择分类",
        icon: "loading",
        duration: 800
      })
    } else if (this.data.good.prc_s <= 0) {    //检查售价
      wx.showToast({
        title: "价格不能为0",
        icon: "loading",
        duration: 800
      })
    } else if (this.data.prc_b <= 0) {    //检查原价
      wx.showToast({
        title: "原价不能为0",
        icon: "loading",
        duration: 800
      })
    } else {//输入检查合格
      console.log(this.data.good.pics)
      console.log(this.data.good.name)
      console.log(this.data.good.desc)
      console.log(this.data.good.clas)
      console.log(this.data.good.prc_s)
      console.log(this.data.good.prc_b)
      console.log(this.data.good.tel)
      console.log("等待中……")
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
        var good_pics = that.data.good.pics
        var jpgCount = good_pics.length
        var id = that.data.good._id
        var waitForUploadingPics = 0
        //首先计算出有多少个需要上传的新图片
        for (var i = 0; i < jpgCount; i++){
          if (good_pics[i] != null && good_pics[i].indexOf("//tmp") >= 0) {
            waitForUploadingPics++
          }
        }
        //没有新增图片则直接更新信息
        if (waitForUploadingPics == 0){
          that.updateGoodInfo(id)
        }else{
          //已经上传的图片
          var uploadedPics = 0
          console.log("我是uploadFile方法：")
          that.uploadPics(0, jpgCount, good_pics, waitForUploadingPics, uploadedPics,id)
        }
      }, 1000)
    }
  },
  uploadPics: function (i, jpgCount,good_pics,waitForUploadingPics,uploadedPics,id){
    var that = this
    if (i < jpgCount && good_pics[i] != null && good_pics[i].indexOf("//tmp") >= 0) {
      console.log("准备上传：" + good_pics[i])
      var ext_name = good_pics[i].match(/.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/)[0]
      var date = new Date()
      var timestamp = date.getTime()
      wx.cloud.uploadFile({
        cloudPath: "images/" + timestamp + ext_name,
        filePath: good_pics[i], // 文件路径
      }).then(res => {
        console.log(res.fileID)
        //上传图片后把http://tmp/替换成cloud://网络路径存入pics字段
        good_pics[i] = res.fileID
        uploadedPics++
        //tmp文件上传完了
        if (uploadedPics == waitForUploadingPics) {
          that.updateGoodInfo(id)
        }else{//继续上传
          i++
          that.uploadPics(i, jpgCount, good_pics, waitForUploadingPics, uploadedPics,id)
        }
      }).catch(error => {
        wx.showToast({
          title: '图片上传失败',
        })
        console.log(error)
      })
    }else{
      i++
      that.uploadPics(i, jpgCount, good_pics, waitForUploadingPics, uploadedPics, id)
    }
  },
  updateGoodInfo:function(id){
    var that = this
    console.log("updateGoodInfo")
    db.collection('good').doc(id).set({
      data: {
        avatar: that.data.good.avatar,
        clas: that.data.good.clas,
        desc: that.data.good.desc,
        flag: 0,
        msg: [],
        name: that.data.good.name,
        nick: that.data.good.nick,
        pics: that.data.good.pics,
        prc_b: that.data.good.prc_b,
        prc_s: that.data.good.prc_s,
        pub_dt: new Date(),
        tel: wx.getStorageSync("storedPhoneNum")
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }).catch(res => {
      wx.showToast({
        title: '信息上传失败',
      })
      console.log(res)
    })
  },
  deleteChoosedPic: function (e) {
    //用于上传的图片tempjpgs和用于在wxml中显示的showtempjpgs的区别是有null填充
    var index = e.target.dataset.id;
    var deletedPic = this.data.good.pics.splice(index, 1);//返回被删除元素
    console.log("删除的元素:" + deletedPic)
    this.setData({
      good: this.data.good,
    })
    //图片删光后，添加图片按钮还要居中
    if (this.data.good.pics.length < 1) {
      this.setData({
        addPicPosition: "0 auto"
      })
    }
    console.log("------------------点叉号后good.pics:--------------")
    console.log(this.data.good.pics)
  },
  getGoodName: function (e) {
    this.setData({
      "good.name":e.detail.value
    })
  },
  getGoodDesc: function (e) {
    console.log("描述:" + e.detail.value)
    this.setData({
      "good.desc": e.detail.value
    })
  },
  getTelphone: function (e) {
    this.setData({
      "good.tel": e.detail.value
    })
  },
  getSellPrice: function (e) {
    this.setData({
      "good.prc_s": e.detail.value
    })
  },
  getCostPrice: function (e) {
    this.setData({
      "good.prc_b": e.detail.value
    })
  },
  //点击预览等待上传的图片
  previewImg: function (e) {
    wx.previewImage({
      urls: [e.target.dataset.src], // 当前显示图片的http链接
    })
  },
  navigateToClassify: function () {
    wx.navigateTo({ url: "../classify/classify" })
  }
  /*自定义事件 结束 */
})
