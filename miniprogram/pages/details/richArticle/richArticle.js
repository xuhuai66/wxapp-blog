const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
const com = require("../../../com.js");
const config = require("../../../config.js");
let interstitialAd = null;
Page({
  data: {
    BannerAd: config.data.BannerAd,
    details: {
      openView: true,
      painting: {},
    },
    randNum: '',
    commentInput: '',
    inputfocus: false,
  },
  onLoad: function (e) {
    this.setData({ published_id: e.scene });
    this.login();
    this.details();
    this.interstitialAd();
  },
  interstitialAd: function () {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: config.data.InterstitialAd
      })
    }
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  //获取文章详情
  details() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    db.collection('published').doc(this.data.published_id).get({
      success: function (res) {
        that.setData({
          details: res.data
        });
        wx.setNavigationBarTitle({
          title: res.data.origin.name,
        });
        wx.hideLoading();
        that.randLike();
        that.getComments();
      }
    })
  },
  //跳转首页
  home() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //随机相似
  randLike() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    db.collection('published').where({
      openView: true
    }).count({
      success: function (res) {
        var rand_num = res.total - 2;//这里2代表前端显示3条，所以总条数减去2再取随机数
        var randNum = Math.floor(Math.random() * rand_num);
        if (randNum == that.data.randNum) {
          that.randLike();//随机数相同，重新进行随机
        } else {
          if (randNum == 0) {
            db.collection('published').where({
              openView: true
            }).limit(3).get({
              success: function (res) {
                that.setData({
                  randNum: randNum,
                  randList: res.data
                });
                wx.hideLoading();
              }
            })
          } else {
            db.collection('published').where({
              openView: true,
              description: _.neq('')
            }).skip(randNum).limit(3).get({
              success: function (res) {
                that.setData({
                  randNum: randNum,
                  randList: res.data
                });
                wx.hideLoading();
              }
            })
          }
        }
      }
    })
  },
  //跳转随机推荐
  goRand(e) {
    var e = e.currentTarget.dataset.details;
    wx.navigateTo({
      url: '/pages/details/' + e.type + '/' + e.type + '?scene=' + e._id,
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

  //评论校检
  checkComment() {
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

  //评论输入
  commentInput(e) {
    this.data.commentInput = e.detail.value;
  },
  //发送评论
  submit() {
    var that = this;
    if (!app.globalData.userInfo.used) {
      wx.showToast({
        title: '您的账号已禁用',
      });
      return false;
    }
    if (that.data.commentInput == "") {
      wx.showToast({
        title: '请输入评论内容',
      });
      return false;
    }

    var date = com.nowTime();
    db.collection('comments').add({
      data: {
        title: that.data.details.title,
        type: that.data.details.type,
        published_id: that.data.details._id,
        date: date,
        content: that.data.commentInput,
        createTime: (new Date()).getTime(),
        userInfo: app.globalData.userInfo.detail,
        reply: {
          code: 0
        },
        openView: false,
      },
      success: function (res) {
        wx.showToast({
          title: '发送成功',
        });
        that.setData({
          commentInput: '',
          inputfocus: false
        })
      },
    })
  },
  //获取评论
  getComments() {
    var that = this;
    db.collection('comments').where({
      openView: true,
      published_id: that.data.details._id
    })
      .limit(10) // 限制返回数量为 10 条
      .orderBy('createTime', 'desc')
      .get({
        success: function (e) {
          that.setData({
            page: 0,
            ["comments[0]"]: e.data
          })
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
    db.collection('comments').where({
      openView: true,
      published_id: that.data.details._id
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
            ["comments[" + page + "]"]: e.data
          })
        }
      })
  },

  //评论聚焦
  toWrite() {
    this.setData({
      inputfocus: true
    })
  },
  //预览图
  previewImg(e) {
    var e = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: e.split(",")
    });
  },
  //分享配置
  onShareAppMessage() {
    var e = this.data.details;
    return {
      title: e.title,
      imageUrl: config.data.shareImg,
      path: '/pages/details/' + e.type + '/' + e.type + '?scene=' + e._id,
    }
  },
  //海报检测
  check_draw() {
    if (app.globalData.haved) {
      this.qrcode();
    } else {
      this.setData({
        modalName: 'authorize'
      })
    }
  },
  //获取二维码
  qrcode() {
    var that = this;
    var url = config.data.Qrcode + '?id=' + that.data.published_id + '&type=' + that.data.details.type;
    com.get(url).then((res) => {
      var q_url = res.data.url;
      that.setData({
        q_url: q_url
      });
      that.eventDraw();
    })
  },
  eventDraw() {
    var e = this.data.details;
    wx.showLoading({
      title: '绘制海报中',
      mask: true
    })
    this.setData({
      painting: {
        width: 375,
        height: 555,
        clear: true,
        views: [
          {
            type: 'image',
            url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531103986231.jpeg',
            top: 0,
            left: 0,
            width: 375,
            height: 555
          },
          {
            type: 'image',
            url: app.globalData.userInfo.detail.avatarUrl,
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: 'image',
            url: 'https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531401349117.jpeg',
            top: 27.5,
            left: 29,
            width: 55,
            height: 55
          },
          {
            type: 'text',
            content: '您的好友【' + app.globalData.userInfo.detail.nickName + '】',
            fontSize: 16,
            color: '#402D16',
            textAlign: 'left',
            top: 33,
            left: 96,
            bolder: true
          },
          {
            type: 'text',
            content: '发现一篇好文章，邀您一起共赏！',
            fontSize: 15,
            color: '#563D20',
            textAlign: 'left',
            top: 59.5,
            left: 96
          },
          {
            type: 'image',
            url: config.data.posterImg,
            top: 136,
            left: 94.5,
            width: 186,
            height: 186
          },
          {
            type: 'image',
            url: this.data.q_url,
            top: 443,
            left: 85,
            width: 68,
            height: 68
          },
          {
            type: 'text',
            content: e.title,
            fontSize: 16,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 336,
            left: 44,
            width: 287,
            MaxLineNumber: 1,
            breakWord: true,
            bolder: true
          },
          {
            type: 'text',
            content: '来源：' + e.origin.name,
            fontSize: 15,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 370,
            left: 44,
            width: 287,
            MaxLineNumber: 1,
            breakWord: true,
            bolder: true
          },
          {
            type: 'text',
            content: '长按识别图中二维码快来抢书呀~',
            fontSize: 14,
            color: '#383549',
            textAlign: 'left',
            top: 460,
            left: 165.5,
            lineHeight: 20,
            MaxLineNumber: 2,
            breakWord: true,
            width: 125
          }
        ]
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        modalName: 'posterTip'
      })
    }
  },
  save_poster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onClose() {
    this.setData({ close: false, painting: {}, });
  },



})