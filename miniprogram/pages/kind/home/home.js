const app = getApp();
const db = wx.cloud.database();
let interstitialAd = null;
const config = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_width: app.globalData.Width
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login();
    this.getKind();
    this.interstitialAd();
  },
  interstitialAd: function () {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({ 
        adUnitId: config.data.InterstitialAd
         })
    }
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  //获取分类
  getKind() {
    var that = this;
    wx.showLoading({
      title: '渲染中',
    })
    db.collection('kind').get({
      success: function (res) {
        that.setData({
          list: res.data
        })
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }
    })
  },
//跳转分类详情内容
  details(e) {
    var e = e.currentTarget.dataset.details;
    console.log(e)
    wx.navigateTo({
      url: '/pages/kind/list/list?title=' + e.title,
    })
  },
  //检测是否登录
  login() {
    var that = this;
    var userInfo = wx.getStorageSync('user')
    if (userInfo) {
      app.globalData.haved = true;
      app.globalData.openid = userInfo._openid;
      app.globalData.userInfo = userInfo;
    } else {
      wx.cloud.callFunction({
        name: 'admin',
        data: {
          $url: "login",
        },
        complete: res => {
          var openid = res.result.openid;
          app.globalData.openid = openid;//全局变量openid
          db.collection('user')
            .where({
              _openid: openid
            }).get({
              success(e) {
                if (e.data == '') {
                  console.log(app.globalData)
                } else {
                  var userInfo = e.data[0];
                  app.globalData.userInfo = userInfo;
                  wx.setStorageSync('user', userInfo);
                  app.globalData.haved = true;
                }
              }
            })
        }
      })
    }
  },
  //分享配置
  onShareAppMessage() {
    return {
      title: config.data.shareTitle,
      imageUrl: config.data.shareImg
    }
  },
})