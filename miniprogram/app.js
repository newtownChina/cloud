//app.js
App({
  globalData: {
    userInfo: null,
    windowHeight: 0,
    code:"",//临时登录凭证
    openid:""
  },
  onLaunch: function () {
    var app = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      console.log("新版本下载失败")
    })
    wx.login({//获取临时登录凭证
      success: function (res) {
        console.log(res)
        wx.setStorageSync("code", res.code)
      }
    })
    wx.cloud.callFunction({
      name:'login',
      data:{}
    })
    .then(res=>{
      console.log(res.result.openid)
      wx.setStorageSync("openid", res.result.openid)
      wx.setStorageSync("mallVersion", res.result.mallVersion)
    })
    .catch(err=>{
      console.log(err)
    })
  }
})
