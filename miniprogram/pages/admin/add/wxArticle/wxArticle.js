const app = getApp();
const db = wx.cloud.database();
const com = require("../../../../com.js");
const config = require("../../../../config.js");
Page({

  data: {
    openView: true, //默认发布内容公开展示
    html:''
  },

  onLoad: function (options) {
    this.getKind();
  },
  //获取分类。
  getKind() {
    var that = this;
    db.collection('kind').get({
      success: function (res) {
        that.setData({
          kindList: res.data,
          kind: res.data[0].title//设置默认类别
        })
      }
    })
  },
  //选择分类
  kindChange: function (e) {
    console.log(e);
    this.setData({
      kind: this.data.kindList[e.detail.value].title
    });
  },
  //公开/私密控制
  openChange: function (e) {
    this.data.openView = e.detail.value;
  },
  //链接输入
  urlInput(e) {
    this.data.url = e.detail.value
  },
  //检测链接
  checkUrl() {
    var that = this;
    var url = that.data.url;
    if (!(/https:\/\/mp.weixin.qq.com\/s\/\S{22}/.test(url))) {
      wx.showToast({
        title: '链接错误',
      })
      return false;
    }
    that.gather(url);
  },
  //采集文章
  gather(url) {
    wx.showToast({
      title: '加载中',
    })
    var that = this;
    var URL =config.data.GZHcj+ "?url=" + url;
    com.get(URL).then((res) => {
      that.setData({
        article: res.data
      });
      wx.cloud.callFunction({
        name: 'down',
        data: {
          url: url
        },
        complete: res => {
          console.log(res)
          this.setData({
            html: res.result
          })
          wx.hideLoading();
        },
      })
    })
    /*
    wx.cloud.callFunction({
      name: 'down',
      data: {
           url: url
      },
      complete: res => {
        console.log(res)
        this.setData({
          html: res.result
        })
        wx.hideLoading();
      },
    })*/
  },
  //获取剪切板
  stick() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        that.setData({
          url: res.data
        })
      }
    })
  },
  //内容校检
  check() {
    var that = this;
    if (that.data.html == '') {
      wx.showToast({
        title: '内容不得为空',
      })
    } else {
      that.addDb();
    }
  },
  //保存到数据库
  addDb() {
    wx.showLoading({
      title: '保存中',
    })
    var date = com.nowTime();
    db.collection('published').add({
      data: {
        title: this.data.article.title,
        kind: this.data.kind,
        des:this.data.article.des,
        cover:this.data.article.cover,
        openView: this.data.openView,
        content: this.data.html,
        createTime: (new Date()).getTime(),
        updatedTime: (new Date()).getTime(),
        updatedDate: date,
        type: 'wxArticle',
        url:this.data.url,
        origin: {
          name: this.data.article.name,
          avatar: this.data.article.avatar,
        }
      },
      success: res => {
        var published_id = res._id;
        wx.hideLoading();
        wx.showModal({
          title: '保存成功',
          content: '是否跳转到详情页？',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/details/wxArticle/wxArticle?scene=' + published_id,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
})