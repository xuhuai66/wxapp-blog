const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    gzh: '',
    gzhModel: true
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
  },
  //删除分类
  del(e) {
    var that = this;
    var gzh = e.currentTarget.dataset.gzh;
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/gzh/delete",
        gzh:gzh
      },
      complete: res => {
        that.getList();
      }
    })
  },
  getList() {
    var that = this;
    db.collection('gzh').where({
    }).get({
      success: function (res) {
        that.setData({
          gzh: '',
          list: res.data
        })
        wx.hideLoading();
      }
    })
  },
  showModal(e) {
    this.setData({
      gzhModel: false
    })
  },
  hideModal(e) {
    this.setData({
      gzhModel: true
    })
  },
  gzhInput(e) {
    console.log(e.detail.value)
    this.data.gzh = e.detail.value
  },
  addDb() {
    var that = this;
    if (that.data.gzh == "") {
      wx.showToast({
        title: '请输入内容',
      });
      return false;
    }
    wx.showLoading({
      title: '上传中',
    })
    db.collection('gzh').add({
      data: {
        name: that.data.gzh
      },
      success: function (res) {
        that.hideModal();
        that.getList();

      },
    })
  }
})