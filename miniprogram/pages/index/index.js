const app = getApp();
const db = wx.cloud.database();
const config = require("../../config.js");
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    noticeList: [
       { content:'暂无公告' }]
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    });
    this.login();
    this.getNotice();
    this.width();
    this.list();
  },
  //搜索关键词输入
  keyInput(e) {
    this.data.key = e.detail.value;
  },
//搜索
search(){
  wx.navigateTo({
    url: '/pages/search/search?key=' +this.data.key,
  })
},
  //获取公告
  getNotice(){
    var that = this;
    db.collection('notice').where({
    }).get({
      success: function (res) {
       that.setData({
         noticeList:res.data
       })
      }
    })
  },
  //获取发布数据
list(){
  var that = this;
  db.collection('published')
   .where({
    openView:true
    })
    .limit(10) // 限制返回数量为 20 条
    .orderBy('updatedTime', 'desc')
    .get({
      success(e){
        that.setData({
          page:0,
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
    var page = that.data.page+10;
    db.collection('published')
        .where({
         openView:true
        })
       .skip(page) // 跳过结果集中的前(page)条，从第(page+1) 条开始返回
      .limit(10) // 限制返回数量为20 条
      .orderBy('updatedTime', 'desc')
      .get({
        success(e) {
          if (e.data =="") {
            wx.hideLoading();
            wx.showToast({
              title: '已加载到底',
            });
            return false;
          }
          that.setData({
            page:page,
            ["list[" + page + "]"]:e.data
          })
          wx.hideLoading();
        }
      })
  },


//计算横宽
width() {
  var Width = app.globalData.Width - 30;
  var Height = Width*0.618;
  var img2_width = Width/2;
  var img2_height = img2_width*0.618;
  var img3_width = Width / 3;
  var img3_height = img3_width * 0.618;
    this.setData({
      w_width:app.globalData.Width,
      Width: Width,
      Height:Height,
      img2_width: img2_width,
      img2_height: img2_height,
      img3_height: img3_height ,
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
  details(e){
    var e = e.currentTarget.dataset.details;
    console.log(e)
     wx.navigateTo({
       url: '/pages/details/' + e.type + '/' + e.type +'?scene='+e._id,
    })
  },
  //检测是否登录
  login() {
    var that = this;
    var userInfo = wx.getStorageSync('user')
    if (userInfo) {
      app.globalData.haved = true;
      app.globalData.openid = userInfo._openid;
      app.globalData.userInfo = userInfo;
    } else {
      wx.cloud.callFunction({
        name: 'admin',
        data: {
          $url: "login",
        },
        complete: res => {
          var openid = res.result.openid;
          app.globalData.openid = openid;//全局变量openid
          db.collection('user')
            .where({
              _openid: openid
            }).get({
              success(e) {
                if (e.data == '') {
                  console.log(app.globalData)
                } else {
                  var userInfo = e.data[0];
                  app.globalData.userInfo = userInfo;
                  wx.setStorageSync('user', userInfo);
                  app.globalData.haved = true;
                }
              }
            })
        }
      })
    }
  },
  //分享配置
  onShareAppMessage() {
    return {
      title: config.data.shareTitle,
      imageUrl: config.data.shareImg,
      path: '/pages/index/index'
    }
  },
})
