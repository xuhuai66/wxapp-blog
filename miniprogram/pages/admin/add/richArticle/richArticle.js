const app = getApp();
const db = wx.cloud.database();
const com = require("../../../../com.js");
Page({

  data: {
    openView: true, //默认发布内容公开展示
    preContent: false,
    cover:'',
    content:'',
    des:'',
    title:''
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
  //获取剪切板
  stick() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        that.setData({
          content: res.data
        })
      }
    })
  },
  //标题输入
  titleInput(e) {
    this.data.title = e.detail.value
  },
  //描述输入
  desInput(e) {
    this.data.des = e.detail.value
  },
  //内容输入
  contentInput(e) {
    this.data.content = e.detail.value;
  },
  //内容校检
  check() {
    var that = this;
    if (that.data.title=='') {
      wx.showToast({
        title: '标题不得为空',
      })
    } else if (that.data.des == '') {
      wx.showToast({
        title: '描述不得为空',
      })
    } else if (that.data.cover=='') {
      wx.showToast({
        title: '请选择封面',
      })
    } else {
      that.upload();
    }
  },
  //选择封面图
  chooseImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.setData({
          cover: tempFilePaths
        })
      }
    })
  },
  //预览图
  previewImg(e) {
    var e = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: e.split(",")
    });
  },
  //封面图上传云存储
  upload() {
    var that = this;
    wx.showLoading({
      title: '保存中',
    });
    wx.cloud.uploadFile({
      cloudPath: 'cover' + (new Date().getTime()),
      filePath: that.data.cover,
      success: res => {
        that.setData({
          coverUrl: res.fileID
        })
        that.addDb();
      }
    })
  },
  //保存到数据库
  addDb() {
    var date = com.nowTime();
    db.collection('published').add({
      data: {
        title: this.data.title,
        kind: this.data.kind,
        des: this.data.des,
        cover: this.data.coverUrl,
        openView: this.data.openView,
        content: this.data.content,
        createTime: (new Date()).getTime(),
        updatedTime: (new Date()).getTime(),
        updatedDate: date,
        type: 'richArticle',
        origin: {
          name: app.globalData.userInfo.detail.nickName,
          avatar: app.globalData.userInfo.detail.avatarUrl
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
                url: '/pages/details/richArticle/richArticle?scene=' + published_id,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
  },
})