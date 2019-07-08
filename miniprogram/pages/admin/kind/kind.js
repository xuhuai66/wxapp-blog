const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
       title:"",
       des:'',
       poster:'',
      addModel: true
  },

  onLoad: function (options) {
   this.getList();
  },
//获取分类列表
  getList() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('kind').where({
    }).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        wx.hideLoading();
      }
    })
  },
//标题输入
titleInput(e){
  this.data.title = e.detail.value
},
  //描述输入
  desInput(e) {
    this.data.des = e.detail.value
  },
  //选择封面图
  chooseImg(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.setData({
          poster:tempFilePaths
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
  showModal(e) {
    this.setData({
      addModel: false
    })
  },
  hideModal(e) {
    this.setData({
      addModel: true
    })
  },
  //保存校检
  add(){
    var that = this;
    if(that.data.title==""){
      wx.showToast({
        title: '标题不能空',
      })
    }else if(that.data.des==''){
      wx.showToast({
        title: '描述不能空',
      })
    }else if(that.data.poster==''){
      wx.showToast({
        title: '请选择封面',
      })
    }else{
      that.upload();
    }
  },
  //封面图上传云存储
  upload(){
    var that = this;
    wx.showLoading({
      title: '保存中',
    });
    wx.cloud.uploadFile({
      cloudPath: 'poster' + (new Date().getTime()) ,
      filePath:that.data.poster,
      success: res => {
       that.setData({
         posterUrl:res.fileID
       })
        that.addDb();
      }
    })
  },
  addDb(){
    var that = this;
    console.log(that.data.posterUrl)
    db.collection('kind').add({
      data: {
        des: that.data.des,
        title:that.data.title,
        posterUrl: that.data.posterUrl,
        createTime: (new Date()).getTime(),   
      },
      success: function (res) {   
        console.log(res)
        that.setData({
          addModel: true,
          title: "",
          des: '',
          poster: ''
        })
        wx.hideLoading();
        that.getList();
      },
    })     
  },
  //删除分类
  del(e) {
    var that = this;
    var kind = e.currentTarget.dataset.kind;
    wx.cloud.callFunction({
      name: "admin",
      data: {
        $url: "admin/kind/delete",
        kind: kind,
      },
      complete: res => {
        that.getList();
      }
    })
  },
  //跳转分类详情内容
  goList(e) {
    var e = e.currentTarget.dataset.details;
    console.log(e)
    wx.navigateTo({
      url: '/pages/kind/list/list?title=' + e.title,
    })
  },
})