var db = wx.cloud.database();
var _ = db.command;
const app = getApp();
let interstitialAd = null;
const config = require("../../config.js");
Page({

  data: {
  },

  onLoad: function (e) {
     this.setData({ key:e.key});
     this.width();
     this.list();
    this.interstitialAd();
  },
  //插屏广告
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
  keyInput(e){
    this.data.key= e.detail.value;
  },
  //获取列表数据
  list() {
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.key+'的搜索结果',
    })
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('published')
      .where({
        openView: true,
        title: db.RegExp({
          regexp: '.*' + that.data.key + '.*',
          options: 'i',
        })
      })
      .limit(20) // 限制返回数量为20 条
      .orderBy('updatedTime', 'desc')
      .get({
        success(e) {
          console.log(e.data)
          that.setData({
            page: 0,
            ["list[0]"]: e.data
          })
          wx.hideLoading();
        }
      })
  },
  onReachBottom(){
   this.bottom();
  },
  //触底加载
  bottom() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var page = that.data.page + 20;
    db.collection('published')
      .where({
        openView: true,
        title: db.RegExp({
          regexp: '.*' + that.data.key + '.*',
          options: 'i',
        })
      })
      .skip(page) // 跳过结果集中的前(page)条，从第(page+1) 条开始返回
      .limit(20) // 限制返回数量为20条
      .orderBy('updatedTime', 'desc')
      .get({
        success(e) {
          wx.hideLoading();
          if (e.data == "") {
            wx.showToast({
              title: '已加载到底',
            });
            return false;
          }
          that.setData({
            page: page,
            ["list[" + page + "]"]: e.data
          })
        }
      })
  },

  //计算横宽
  width() {
    var Width = app.globalData.Width - 30;
    var Height = Width * 0.618;
    var img2_width = Width / 2;
    var img2_height = img2_width * 0.618;
    var img3_width = Width / 3;
    var img3_height = img3_width * 0.618;
    this.setData({
      w_width: app.globalData.Width,
      Width: Width,
      Height: Height,
      img2_width: img2_width,
      img2_height: img2_height,
      img3_height: img3_height,
      img3_width: img3_width,
    })
  },
  //预览图
  previewImg(e) {
    var e = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: e.split(",")
    });
  },
  //加载详情
  details(e) {
    var e = e.currentTarget.dataset.details;
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/' + e.type + '/' + e.type + '?scene=' + e._id,
    })
  },
  //分享配置
  onShareAppMessage() {
    return {
      title: config.data.shareTitle,
      imageUrl: config.data.shareImg,
      path: '/pages/index/index'
    }
  },
})