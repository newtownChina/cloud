const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//自定的授权并打开地图组件
function openMapLocation(){
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      console.log("成功");
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000,

      })
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28,
        success:function(res){//想要根据经纬度获取位置信息，需要第三方API
          console.log(name);
        }
      })
    },
    fail: function (res) {
      console.log("失败");
    },
    complete: function (res) {
      console.log("完成");
    }
  })
}
/*根据排序方式对后台返回的goods数据进行排序 */
function sortData(data, sortWay) {
  console.log(data)
  console.log("若提示data.sort is not a function，说明返回的goods数据有问题")
  if ("tim" == sortWay) {
    console.log("待排序数组，排序方式为tim：降序")
    if (null != data && undefined != data && "" != data) {
      data.sort(function (x, y) {
        if (x.pub_dt < y.pub_dt) {
          return 1
        } else if (x.pub_dt > y.pub_dt) {
          return -1
        } else if (x.pub_dt === y.pub_dt) {
          return 0
        }
      })
    }
    return data
  } else if ("pri" == sortWay) {
    console.log("待排序数组，排序方式为pri：升序")
    data.sort(function (x, y) {
      if (parseFloat(x.prc_s) < parseFloat(y.prc_s)) {
        return -1
      } else if (parseFloat(x.prc_s) > parseFloat(y.prc_s)) {
        return 1
      } else if (parseFloat(x.prc_s) === parseFloat(y.prc_s)) {
        return 0
      }
    })
    return data
  } else if ("hot" == sortWay) {
    console.log("待排序数组，排序方式为hot：降序")
    data.sort(function (x, y) {
      if (x.msg.length < y.msg.length) {
        return 1
      } else if (x.msg.length > y.msg.length) {
        return -1
      } else if (x.msg.length === y.msg.length) {
        return 0
      }
    })
    return data
  } else if ("sum" == sortWay) {
    console.log("待排序数组，排序方式为sum综合：升序")
    data.sort(function (x, y) {
      /*价格低 留言多,往前放；反之，往后放，其他不变*/
      if (parseFloat(x.prc_s) < parseFloat(y.prc_s) && x.msg.length > y.msg.length) {
        return -1
      } else if (parseFloat(x.prc_s) > parseFloat(y.prc_s) && x.msg.length < y.msg.length) {
        return 1
      } else {
        return 0
      }
    })
    return data
  }
}
function changeBgColor(tim_bg_color, pri_bg_color, hot_bg_color, sum_bg_color,obj) {
  var tim_color, pri_color, hot_color, sum_color
  if ("#5cc45b" == tim_bg_color) {
    tim_color = "white"
    pri_color = "#888"
    hot_color = "#888"
    sum_color = "#888"
  }
  if ("#5cc45b" == pri_bg_color) {
    tim_color = "#888"
    pri_color = "white"
    hot_color = "#888"
    sum_color = "#888"
  }
  if ("#5cc45b" == hot_bg_color) {
    tim_color = "#888"
    pri_color = "#888"
    hot_color = "white"
    sum_color = "#888"
  }
  if ("#5cc45b" == sum_bg_color) {
    tim_color = "#888"
    pri_color = "#888"
    hot_color = "#888"
    sum_color = "white"
  }
  obj.setData({
    tim_bg_color: tim_bg_color,
    tim_color: tim_color,
    pri_bg_color: pri_bg_color,
    pri_color: pri_color,
    hot_bg_color: hot_bg_color,
    hot_color: hot_color,
    sum_bg_color: sum_bg_color,
    sum_color: sum_color,
  })
}
function checkLogin(){
  console.log("进入checkLogin")
  var ifLogin = false
  var userInfo = app.globalData.userInfo
  if (!userInfo) {
    wx.showModal({
      title: '提示',
      content: '登录后才能正常使用小程序哦',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/myself/myself',
          })
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  } else {
    ifLogin = true
  }
  return ifLogin
}
module.exports = { formatTime: formatTime }//注意不能放到最后，否则相当于重新赋值，则openMapLocation，checkLogin，sortData会未定义
module.exports.openMapLocation= openMapLocation
module.exports.checkLogin = checkLogin
module.exports.sortData = sortData
module.exports.changeBgColor = changeBgColor



