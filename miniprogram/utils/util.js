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
  return data
  console.log(data)
  console.log("若提示data.sort is not a function，说明返回的goods数据有问题")
  if ("tim" == sortWay) {
    console.log("待排序数组，排序方式为tim：降序")
    if (null != data && undefined != data && "" != data) {
      data.sort(function (x, y) {
        if (x.publish_time < y.publish_time) {
          return 1
        } else if (x.publish_time > y.publish_time) {
          return -1
        } else if (x.publish_time === y.publish_time) {
          return 0
        }
      })
    }
    return data
  } else if ("pri" == sortWay) {
    console.log("待排序数组，排序方式为pri：升序")
    data.sort(function (x, y) {
      if (parseFloat(x.sell_price) < parseFloat(y.sell_price)) {
        return -1
      } else if (parseFloat(x.sell_price) > parseFloat(y.sell_price)) {
        return 1
      } else if (parseFloat(x.sell_price) === parseFloat(y.sell_price)) {
        return 0
      }
    })
    return data
  } else if ("hot" == sortWay) {
    console.log("待排序数组，排序方式为hot：降序")
    data.sort(function (x, y) {
      if (x.leave_msg_count < y.leave_msg_count) {
        return 1
      } else if (x.leave_msg_count > y.leave_msg_count) {
        return -1
      } else if (x.leave_msg_count === y.leave_msg_count) {
        return 0
      }
    })
    return data
  } else if ("sum" == sortWay) {
    console.log("待排序数组，排序方式为sum综合：升序")
    data.sort(function (x, y) {
      /*价格低 留言多,往前放；反之，往后放，其他不变*/
      if (parseFloat(x.sell_price) < parseFloat(y.sell_price) && x.leave_msg_count > y.leave_msg_count) {
        return -1
      } else if (parseFloat(x.sell_price) > parseFloat(y.sell_price) && x.leave_msg_count < y.leave_msg_count) {
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
  if ("green" == tim_bg_color) {
    tim_color = "white"
    pri_color = "black"
    hot_color = "black"
    sum_color = "black"
  }
  if ("green" == pri_bg_color) {
    tim_color = "black"
    pri_color = "white"
    hot_color = "black"
    sum_color = "black"
  }
  if ("green" == hot_bg_color) {
    tim_color = "black"
    pri_color = "black"
    hot_color = "white"
    sum_color = "black"
  }
  if ("green" == sum_bg_color) {
    tim_color = "black"
    pri_color = "black"
    hot_color = "black"
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
  var userInfo
  var value;
  try {
    userInfo = app.globalData.userInfo
    value = wx.getStorageSync("storedPhoneNum")
    console.log("util.js:本地缓存中的手机号："+value)
    if (!value || !userInfo){
      wx.showModal({
        title: '提示',
        content: '请先点击两个“微信图标”授权后才能正常使用小程序哦',
        success: function (res) {
          if (res.confirm) {
            // wx.navigateTo({
            //   老方法用发短信登录
            //   url: '/pages/phoneReg/phoneReg',
            // })
            wx.switchTab({
              url: '/pages/myself/myself',
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1
            })
            return
          }
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
  return value;//返回手机号
}
module.exports = { formatTime: formatTime }//注意不能放到最后，否则相当于重新赋值，则openMapLocation，checkLogin，sortData会未定义
module.exports.openMapLocation= openMapLocation
module.exports.checkLogin = checkLogin
module.exports.sortData = sortData
module.exports.changeBgColor = changeBgColor



