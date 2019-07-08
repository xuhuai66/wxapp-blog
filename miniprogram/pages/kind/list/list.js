const app = getApp();
const db = wx.cloud.database();
const config = require("../../../config.js");
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    BannerAd: config.data.BannerAd,
    noticeList: [
      { content: '暂无公告' }]
  },

  onLoad: function (e) {
    this.setData({
      kind:e.title
    });
    wx.setNavigationBarTitle({
      title: e.title,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    this.width();
    this.list();
  },

  //获取分类数据
  list() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('published')
      .where({
        openView: true,
        kind:that.data.kind
      })
      .limit(20) // 限制返回数量为 20 条
      .orderBy('updatedTime', 'desc')
      .get({
        success(e) {
          that.setData({
            page: 0,
            ["list[0]"]: e.data
          })
          wx.hideLoading();
        }
      })
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
        kind: that.data.kind
      })
      .skip(page) // 跳过结果集中的前(page)条，从第(page+1) 条开始返回
      .limit(20) // 限制返回数量为20 条
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
})
