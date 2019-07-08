const app = getApp();
const db = wx.cloud.database();
var com = require("../../../../com.js");
Page({

  data: {
    openView: true, //默认发布内容公开展示
    title: '',
    video:'',
  },

  onLoad: function (options) {
    this.getKind()
  },
  //选择视频
  chooseVideo() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      success: function (res) {
        console.log(res);
        that.setData({
          video:res
        })
      }
    })
  },
  //获取分类
  getKind() {
    var that = this;
    db.collection('kind').get({
      success: function (res) {
        console.log(res.data)
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
  //标题输入
  titleInput(e) {
    this.data.title = e.detail.value
  },
  //内容校检
  check() {
    var that = this;
     if (that.data.title == '') {
      wx.showToast({
        title: '标题不得为空',
      })
    } else if (that.data.video=='') {
      wx.showToast({
        title: '请选择视频',
      })
    } else {
      that.save();
    }
  },
  //先上传图片到云存储再传数据库
  save() {
    var that = this;
    wx.showLoading({
      title: '保存中...',
    })
    wx.cloud.uploadFile({
      cloudPath: 'video/' + (new Date().getTime()),
      filePath: that.data.video.tempFilePath,
      success: res => {
        that.setData({
          clouldPath: res.fileID
        })
        that.addDb();
      },
    })
  },
  //保存到数据库
  addDb() {
    var date = com.nowTime();
    db.collection('published').add({
      data: {
        title: this.data.title,
        kind: this.data.kind,
        openView: this.data.openView,
        clouldPath: this.data.clouldPath,
        createTime: (new Date()).getTime(),
        updatedTime: (new Date()).getTime(),
        updatedDate: date,
        type: 'video',
        wh:{
          width: this.data.video.width,
          height: this.data.video.height,
        },
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
                url: '/pages/details/video/video?scene=' + published_id,
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