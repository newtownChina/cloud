# 云开发二手买卖商城小程序
## 功能定义：
1.`微信登录`  
2.`发布商品`  
3.`查看已发布`  
4.`查看已售出`  
5.`查看已买到`  
6.`查看已收藏`  
7.`商品浏览`  
8.`留言`  
9.`下单`  
10.`快递查询`（开发中……）  
11.`微信支付`（开发中……）  
## 数据库定义：
### [用户表] user：
```
{  
  "_id":"", 
  "_openid":"", 
  "name":"",  
  "pwd":"",  
  "contact":"",  
  "publish":["",……],   
  "want":["",……],  
  "bought":["",……],  
  "sell":["",……]  
}
```
### [商品表] good：
```
{  
  "_id":"",  
  "_openid":"",  
  "avatar":"",  
  "clas":"",  
  "desc":"",  
  "flag":0 || 1,  
  "msg":[  
    {
        "openid":"",  
        "nick":"",
        "avatar":"",
        "msg_txt":"",
        "msg_dt":""
    },
    ……
  ],  
  "pub_dt":"",  
  "name":"",  
  "nick":"",  
  "pics":["",……],  
  "prc_b":"",  
  "prc_s":"",    
  "buyer":{  
    "buyerInfo":{
        "detailInfo":"", //新港中路397号
        "nationalCode":"",  //510000
        "telNumber":"",  //020-81167888
        "userName":"",  
        "postalCode":"",  //510000
        "provinceName":"",  //广东省
        "cityName":"",  //广州市
        "countyName":""  //海珠区
     },  
    "state":0 || 1,  //0表示交易中，1表示交易完成
    "payState":0 || 1,  //0表示未支付，1表示支付完成
    "payWay":"",  //货到付款、微信支付
    "transWay":""  //圆通，中通，……
  }  
}  
```
## 参考文档
[云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

