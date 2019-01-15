## 云开发二手买卖商城小程序
## 数据库定义：
# [用户表] user：
{
  "_id":"",
  "name":"",
  "pwd":"",
  "contact":"",
  "publish":[""],
  "_openid":"",
  "want":[""],
  "bought":[""],
  "sell":[""]
}
# [商品表] good：
{
  "_id":"",
  "avatar":"",
  "clas":"",
  "desc":"",
  "flag":{"$numberLong":"1"},
  "msg":[
    {"nick":"","avatar":"","msg_txt":"","openid":"","msg_dt":""}],
  "pub_dt":"",
  "name":"",
  "nick":"",
  "pics":[""],
  "prc_b":"",
  "prc_s":"",
  "_openid":"",
  "buyer":{
    "buyerInfo":{
        "detailInfo":"新港中路397号",
        "nationalCode":"510000",
        "telNumber":"020-81167888",
        "userName":"张三",
        "postalCode":"510000",
        "provinceName":"广东省",
        "cityName":"广州市",
        "countyName":"海珠区"
     },
    "state":{"$numberLong":"0"},
    "payState":{"$numberLong":"0"},
    "payWay":"",
    "transWay":""
  }
}

## 参考文档
[云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

