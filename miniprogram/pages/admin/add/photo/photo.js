const app = getApp();
const db = wx.cloud.database();
var com = require("../../../../com.js");
Page({

  data: {
    imgList: [],
    openView:true, //默认发布内容公开展示
    title:'',
    des:''
  },

  onLoad: function (options) {
    this.getKind()
  },
  //选择相册图片
  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  //预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  DelImg(e) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
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
          kind:res.data[0].title//设置默认类别
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
    this.data.openView=e.detail.value;
  },
  //标题输入
  titleInput(e) {
    this.data.title = e.detail.value
  },
  //描述输入
  desInput(e) {
    this.data.des = e.detail.value
  },
  //内容校检
  check() {
    var that = this;
    if (that.data.imgList.length > 9) {
      wx.showToast({
        title: '最多上传九张哦',
      })
    }else if(that.data.title==''){
      wx.showToast({
        title: '标题不得为空',
      })
    }else if(that.data.imgList.length<1){
      wx.showToast({
        title: '请选择照片',
      })
    }else{
      that.save();
    }
  },
  //先上传图片到云存储再传数据库
  save() {
    var count = 0;
    wx.showLoading({
      title: '保存中...',
    })
    var that = this;
    var cloudPath = []
    var myPath = []
    for (var i = 0; i < that.data.imgList.length; i++) {
      cloudPath[i] = 'photo/' + (new Date().getTime()) + that.data.imgList[i].match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath: cloudPath[i],
        filePath: that.data.imgList[i],
        success: res => {
          myPath.push(res.fileID)
          that.setData({
            clouldPath: myPath
          })
          count++;
          if (count == cloudPath.length) {
            that.addDb();
          }
        },
      })
    }
  },
  //保存到数据库
  addDb() {
    var date = com.nowTime();
    db.collection('published').add({
      data: {
        title:this.data.title,
        des: this.data.des,
        kind:this.data.kind,
        openView:this.data.openView,
        clouldPath: this.data.clouldPath,
        createTime: (new Date()).getTime(),
        updatedTime: (new Date()).getTime(),
        updatedDate: date,
        type: 'photo',
        origin:{
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
                url: '/pages/details/photo/photo?scene=' + published_id,
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