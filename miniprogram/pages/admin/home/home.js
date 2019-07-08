// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //新增跳转
  add(e) {
    var e = e.currentTarget.dataset.to;
    wx.navigateTo({
      url: '/pages/admin/add/' + e + '/' + e,
    })
  },
  //切换页面
  go(e){
    var e = e.currentTarget.dataset.to;
    wx.navigateTo({
      url: '/pages/admin/' +e+'/'+e,
    })
  }
})