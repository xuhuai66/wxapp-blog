var app = getApp();
const db = wx.cloud.database();

Page({


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.width();
    this.getList();
  },
  //获取列表
  getList() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('published').where({
    })
      .limit(10) // 限制返回数量为 10 条
      .orderBy('updatedTime', 'desc')
      .get({
        success: function (e) {
          that.setData({
            page: 0,
            ["list[0]"]: e.data
          })
          console.log(e.data)
          wx.hideLoading()
        }
      })
  },

  //删除
  del(e) {
    var that = this;
    var details = e.currentTarget.dataset.details;
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/contents/delete",
        details:details
      },
      complete: res => {
        that.getList();
      }
    })
  },
  onReachBottom() {
    this.bottom();
  },
  //触底加载
  bottom() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var page = that.data.page + 10;
    db.collection('published').where({
    })
      .skip(page) // 跳过结果集中的前(page)条，从第(page+1) 条开始返回
      .limit(10) // 限制返回数量为 10 条
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
  tips() {
    wx.showToast({
      title: '开发中',
    })
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