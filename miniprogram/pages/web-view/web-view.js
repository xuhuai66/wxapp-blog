// pages/web-view/web-view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
          url:e.url
    })
  },
ok(){
  wx.hideLoading();
}
})