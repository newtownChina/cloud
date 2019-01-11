// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
var querystring = require("querystring");
cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  var js_code = event.code
  var url = "https://api.weixin.qq.com/sns/jscode2session?";
  var appid = "wxc154a40d1a41cbd8";
  var secret = "69a33ab2a697c2c45bfff243cd7de1a2";
  var grant_type = "authorization_code";
  var postData = querystring.stringify({
    "appid": appid,
    "secret": secret,
    "js_code": js_code,
    "grant_type": grant_type
  });
  var requestUrl = url + postData
  return new Promise((resolve, reject) => {
    var url = requestUrl
    var option = {
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: postData
    }
    request(option, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
    });
  });
}
