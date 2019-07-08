var app = getApp();
const db = wx.cloud.database();

Page({
  data: {
  },
  onLoad: function (options) {
    this.getList();
  },
//获取详情
  getList() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('comments').where({
      _openid: app.globalData.openid
    })
      .limit(10) // 限制返回数量为10条
      .orderBy('createTime', 'desc')
    .get({
      success: function (e) {
        that.setData({
          page: 0,
          ["list[0]"]: e.data
        })
        wx.hideLoading()
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
    var page = that.data.page + 10;
    db.collection('comments')
        .where({
          _openid: app.globalData.openid
        })
      .skip(page) // 跳过结果集中的前(page)条，从第(page+1) 条开始返回
      .limit(10) // 限制返回数量为 10 条
      .orderBy('createTime', 'desc')
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
  //删除我的评论
  del(e) {
    var that = this;
    var details = e.currentTarget.dataset.details;
    db.collection('comments').doc(details._id).remove({
      success() {
        that.getList();
      },
      fail: console.error
    })
  },
  //加载详情
  details(e) {
    var e = e.currentTarget.dataset.details;
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/' + e.type + '/' + e.type + '?scene=' + e.published_id,
    })
  }
})