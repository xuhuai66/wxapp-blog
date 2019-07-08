var app = getApp();
const db = wx.cloud.database();

Page({

  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  //获取列表
  getList() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('user').where({
    })
      .limit(10) // 限制返回数量为 10 条
      .orderBy('createTime', 'desc')
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
  //设置状态
  verify(e) {
    var that = this;
    var user = e.currentTarget.dataset.user;
    var set = e.currentTarget.dataset.set;
    var reg = RegExp(/true/);
    var set = reg.test(set);//将字符串转boolean
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/people/verify",
        user: user,
        set: set
      },
      complete: res => {
        console.log(res)
        that.getList();
      }
    })
  },
  //设置管理员
  admin(e) {
    var that = this;
    var user = e.currentTarget.dataset.user;
    var set = e.currentTarget.dataset.set;
    var reg = RegExp(/true/);
    var set = reg.test(set);//将字符串转boolean
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/people/admin",
        user: user,
        set: set
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
    db.collection('user').where({
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
})