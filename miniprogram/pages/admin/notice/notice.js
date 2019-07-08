const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
      notice:'',
      noticeModel:true
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
    var notice = e.currentTarget.dataset.notice;
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/notice/delete",
        notice: notice,
      },
      complete: res => {
        that.getList();
      }
    })
  },
getList(){
  var that = this;
  db.collection('notice').where({
  }).get({
    success: function (res) {
     that.setData({
       notice: '',
       list:res.data
     })
     wx.hideLoading();
    }
  })
},
  showModal(e) {
    this.setData({
      noticeModel: false
    })
  },
  hideModal(e) {
    this.setData({
      noticeModel: true
    })
  },
  noticeInput(e){
    console.log(e.detail.value)
    this.data.notice = e.detail.value
  },
  addDb(){
    var that = this;
    if(that.data.notice==""){
      wx.showToast({
        title: '请输入内容',
      });
      return false;
    }
    wx.showLoading({
      title: '上传中',
    })
    db.collection('notice').add({
      data: {
        content:that.data.notice
      },
      success: function (res) {
       that.hideModal();
       that.getList();

      },
    })
  }
})