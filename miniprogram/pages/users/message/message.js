const app = getApp();
const db = wx.cloud.database();
const com = require("../../../com.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
     message:'',
     myList:'',
     viewList:'',
  },

  onLoad: function (options) {
    this.myMess();
    this.viewMess();
  },
  //描述输入
  messInput(e) {
    this.data.message = e.detail.value
  },
  //发送评论
  submit() {
    var that = this;
    if (that.data.message == "") {
      wx.showToast({
        title: '请输入留言内容',
      });
      return false;
    }
    var date = com.nowTime();
    db.collection('message').add({
      data: {
        message:that.data.message,
        date: date,
        reply:{
          code:0
        },
        openView:false,
        createTime: (new Date()).getTime(),
        userInfo: app.globalData.userInfo.detail
      },
      success: function (res) {
        wx.showToast({
          title: '发送成功',
        });
        that.myMess();

      },
    })
  },
  //删除我的留言
  del(e) {
    var that = this;
    var details = e.currentTarget.dataset.details;
    db.collection('message').doc(details._id).remove({
      success(){
        that.myMess();
      },
      fail: console.error
    })
  },
  //我的留言【限制最新5条】
  myMess() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('message').where({
      _openid: app.globalData.openid
    })
      .limit(20) // 限制返回数量为 20 条
      .orderBy('createTime', 'desc')
      .get({
        success: function (e) {
          that.setData({
            myList:e.data
          })
          console.log(e.data)
          wx.hideLoading()
        }
      })
  },
  //历史留言【限制最新20条】
  viewMess() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('message').where({
      openView:true
    })
      .limit(20) // 限制返回数量为 8 条
      .orderBy('createTime', 'desc')
      .get({
        success: function (e) {
          that.setData({
            viewList: e.data
          })
          console.log(e.data)
          wx.hideLoading()
        }
      })
  },

  //评论校检
  checkLogin() {
    var that = this;
    if (app.globalData.haved) {
      that.submit();
    } else {
      this.setData({
        modalName: 'authorize'
      })
    }
  },
  //关闭授权框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //获取用户信息
  getuser(e) {
    var that = this;
    var test = e.detail.errMsg.indexOf("ok");
    
    if (test == '-1') {
      wx.showToast({
        title: '请授权后使用~',
      });
    } else {
      that.setData({
        userInfo: e.detail.userInfo
      })
      that.save();
    }
  },
  //保存用户信息
  save() {
    var that = this;
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).get({
      success: function (res) {
        if (res.data == '') {
          that.add();
        } else {
          var _id = res.data[0]._id;
          that.updata(_id);
        }
      }
    })
  },
  add() {
    var that = this;
    db.collection('user').add({
      data: {
        detail: that.data.userInfo,
        creatTime: (new Date()).getTime(),
        used: true,
        admin: false
      },
      success: function (res) {
        that.storage(res._id);
      },
    })
  },
  updata(e) {
    var that = this;
    var _id = e;
    db.collection('user').doc(_id).update({
      data: {
        detail: that.data.userInfo,
        creatTime: (new Date()).getTime(),
        used: true
      },
      success: function (res) {
        that.storage(_id);
      },
    })
  },
  storage(e) {
    var that = this;
    var _id = e;
    db.collection('user').doc(_id).get({
      success: function (res) {
        var userInfo = res.data
        wx.setStorageSync('user', userInfo);
        app.globalData.haved = true;
        app.globalData.userInfo = userInfo;
      }
    })
  },

})