// pages/order/order.js
const util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    visible:false,
    qita_addr:"",
    trade_addr:"",
    transportWayStr:"圆通",
    items: [
      { name: 'yuantong', value: '圆通',checked: 'true' },
      { name: 'yunda', value: '韵达',},
      { name: 'shentong', value: '申通' },
      { name: 'zhongtong', value: '中通' },
      { name: 'shunfeng', value: '顺丰' },
      { name: 'qita', value: '其它' },
    ],
    transportWay:["yuantong"],//配送方式
    //主要用于在view中展示数据，实际传到后台的是完整拼接后的trad_addr
    buyerInfo:{},
    good:[],
    openid:wx.getStorageSync("openid")
  },
  /*生命周期事件 开始 */
  onLoad: function (options) {
    var good = JSON.parse(options.good)
    console.log(good)
    this.setData({
      good: good
    })
    console.log(this.data.userInfo)
  },
  /*生命周期事件 结束 */

  /*自定义事件 开始 */
  confirmOrder:function(e){
    var that = this
    console.log(this.data.transportWayStr.indexOf(this.data.qita_addr))
    //防止输入其它后点击确认下单后，其它的地址没加上（如果其它可见，且其它地址不在transportWayStr（-1），则加上）
    if (this.data.visible && this.data.transportWayStr.indexOf(this.data.qita_addr)==-1){
      this.data.transportWayStr += this.data.qita_addr
    }
    console.log(this.data.buyerInfo)
    console.log(this.data.trade_addr.trim())
    console.log(this.data.transportWayStr)
    if (!that.data.trade_addr.trim()) {
      wx.showToast({
        title: '请填写交易地点',
        icon: "loading",
        duration: 618
      })
      return
    }else if (that.data.transportWay.length == 0) {
      wx.showToast({
        title: '请选择配送方式',
        icon: "loading",
        duration: 618
      })
      return
    }else{
      console.log("下单中……")
      var id = e.currentTarget.dataset.id
      //我的openid
      var openid = that.data.openid
      /*检查是否已经登录*/
      var ifLogin = util.checkLogin()
      if (ifLogin){
        db.collection('user').where({
          _openid: openid
        })
        .get()
        .then(res=>{
          console.log(res.data)
          var u_id = res.data[0]._id
          var id = that.data.good._id
          db.collection("user").doc(u_id)
          .update({
            data:{
              bought: _.push(id)//将当前商品加入我买到的
            }
          })
          .then(res=>{
            console.log(res)
            if(res.stats.updated==1){
              //更新商品的买家信息（也就是我的信息）
              var transWayStr = that.data.transportWayStr
              var buyerInfo = that.data.buyerInfo
              var payWay = "货到付款"
              var buyer = {
                payWay: payWay,
                transWay: transWayStr,
                buyerInfo: buyerInfo,
                state: 0,//交易状态 0交易中  1完成
                payState:0    //0未付款 1 已付款         
              }
              console.log(buyer)
              db.collection("good").doc(id)
              .update({
                data: {
                  buyer: _.set(buyer)
                }
              })
              .then(res=>{
                console.log(res)
                if (res.stats.updated == 1) {
                  //将该商品追加到“该商品的卖家”的“我卖出的（sell）”字段
                  // that.data.good._openid 卖家的openid
                  // that.data.openid  我的openid
                  var seller_openid = that.data.good._openid
                  db.collection('user').where({
                    _openid: seller_openid
                  })
                  .get()
                  .then(res => {
                    console.log(res.data)
                    var u_id = res.data[0]._id
                    var id = that.data.good._id
                    db.collection("user").doc(u_id)
                    .update({
                      data: {
                        sell: _.push(id)//将当前商品加入该商品发布者的卖出的
                      }
                    })
                    .then(res=>{
                      if (res.stats.updated == 1) {
                        wx.showModal({
                          title: '下单成功',
                          content: '是否查看详细信息',
                          success(res) {
                            if (res.confirm) {
                              wx.navigateTo({
                                url: '/pages/myselfitem-bought/myselfitem-bought',
                              })
                            } else if (res.cancel) {
                                console.log('不查看订单详细信息')
                            }
                          }
                        })
                      }
                    })
                    .catch(err=>{
                      wx.showToast({
                        title: '下单失败',
                        duration: 600
                      })
                    })
                  })
                }
              })
              .catch(err=>{
                wx.showToast({
                  title: '下单失败',
                  duration: 600
                })
              })
            }else{
              wx.showToast({
                title: '下单失败',
                duration: 600
              })
            }
          })
          .catch(err=>{
            console.log(err)
            wx.showToast({
              title: '下单失败',
              duration: 600
            })
          })
        })
        .catch(err=>{
          console.log(err)
          wx.showToast({
            title: '下单失败',
            duration: 600
          })
        })
      }
    }
  },
  checkboxChange: function (e) {
    var that = this
    this.setData({
      transportWay: e.detail.value
    })
    console.log(this.data.transportWay)
    if (this.data.transportWay.length==0){
        this.setData({
          visible: false
        }) 
        wx.showToast({
          title: '请选择配送方式',
          icon: "loading",
          duration: 618
        })
    }
    for (var i in this.data.transportWay){
      console.log(i)
      if (this.data.transportWay[i]=="qita") {
        this.setData({
          visible: true
        })
        break
      }else{//没有选其它的时候默认隐藏
        this.setData({
          visible: false,
        })
      }
      console.log(this.data.visible)
    }
    if(that.data.visible==false){
      that.setData({
        qita_addr: ""
      })
    }
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var transportWayString=""
    for (var i in that.data.transportWay) {
      if (that.data.transportWay[i] == "yuantong") {
        transportWayString += "圆通,"
      }
      if (that.data.transportWay[i] == "yunda") {
        transportWayString += "韵达,"
      }
      if (that.data.transportWay[i] == "shentong") {
        transportWayString += "申通,"
      }
      if (that.data.transportWay[i] == "zhongtong") {
        transportWayString += "中通,"
      }
      if (that.data.transportWay[i] == "shunfeng") {
        transportWayString += "顺丰,"
      }
      if (that.data.transportWay[i] == "qita") {
        if (that.data.qita_addr != null && that.data.qita_addr != ""){
          transportWayString += that.data.qita_addr+","
        }
      }
    }
    that.setData({
      transportWayStr:transportWayString
    })
    console.log(transportWayString)
  },
  getTransportWay:function(e){
    console.log(e)
    this.setData({
      qita_addr:e.detail.value
    })
  },
  chooseAddress:function(){
    var that = this
    wx.chooseAddress({
      success:function(res){
        var trade_addr = 
            res.provinceName + 
            res.cityName + 
            res.countyName + 
            res.detailInfo+"  "
            res.userName+"收  "
            "电话:" + res.telNumber
            "邮编:" + res.postalCode
        var buyerInfoStr = "{" +
          "\"userName\":\"" + res.userName + "\"," +
          "\"postalCode\":\"" + res.postalCode + "\"," +
          "\"provinceName\":\"" + res.provinceName + "\"," +
          "\"cityName\":\"" + res.cityName + "\"," +
          "\"countyName\":\"" + res.countyName + "\"," +
          "\"detailInfo\":\"" + res.detailInfo + "\"," +
          "\"nationalCode\":\"" + res.nationalCode + "\"," +
          "\"telNumber\":\"" + res.telNumber + "\"" +
          "}"
        that.setData({
          trade_addr: trade_addr,
          buyerInfo: JSON.parse(buyerInfoStr)
        })
        console.log("买家信息如下：")
        console.log(that.data.buyerInfo)
      }
    })
  }
  /*自定义事件 结束 */
})