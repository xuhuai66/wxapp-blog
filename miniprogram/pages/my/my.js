const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  //赞赏图
  likeImg() {
    var e = "https://tvax1.sinaimg.cn/large/005BYqpggy1g4ljw56qwhj30st0sttao.jpg";
    wx.previewImage({
      urls: e.split(",")
    });
  },
  tips(){
    wx.showToast({
      title: '开发中',
    })
  },
  //切换页面
  go(e) {
    var e = e.currentTarget.dataset.to;
    wx.navigateTo({
      url:  e,
    })
  }
})