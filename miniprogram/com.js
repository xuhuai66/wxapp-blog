/*
Made By xuhuai
使用说明地址：https://github.com/xuhuai66/wxapp-blog
*/


var nowTime = function () {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  var date = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return date;
}
var get = function (url) {
  var promise = new Promise((resolve, reject) => {
    var that = this;
    wx.request({
      url: url,
      success: function (res) {
        resolve(res);
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

module.exports = {
  nowTime: nowTime,
  get:get
}

