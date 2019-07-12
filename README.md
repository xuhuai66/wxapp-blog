# 欢迎使用wxapp-blog

**让写博客像发朋友圈一样简单**


##### 详细说明地址：[https://mp.weixin.qq.com/s/mZTUrHREm5vw6c4Z7mMKeQ](https://mp.weixin.qq.com/s/mZTUrHREm5vw6c4Z7mMKeQ "https://mp.weixin.qq.com/s/mZTUrHREm5vw6c4Z7mMKeQ")

##### 线上预览：

![宅梦网](https://graph.baidu.com/resource/1124be3d5edde39f5b7b801562744885.jpg "小程序：宅梦网")

无需服务器无需域名，仅需注册一个小程序（免费）即可拥有自己的完整博客系统


## 使用教程

#### 一、注册申请小程序

官网地址[https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=](https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token= "https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=")

#### 二、下载源码到本地

Github：[https://github.com/xuhuai66/wxapp-blog](https://github.com/xuhuai66/wxapp-blog "https://github.com/xuhuai66/wxapp-blog")

导入小程序开发工具，开通云开发


#### 三、云开发设置

数据库表：

|  表名 |  作用 |
| ------------ | ------------ |
|  gzh |  关联的公众号 |
| kind  |  分类 |
| user  |  注册的用户信息 |
|  message |  留言板内容 |
| comments  |  评论内容 |
|  notice |  首页公公告 |
|  published |  发布的内容 |

云函数

admin、down安装依赖，并上传

存储

|  文件夹 | 作用  |
| ------------ | ------------ |
|  cover |  存放内容封面 |
| photo  | 存放图片博客  |
|  video | 存放视频博客  |

#### 四、小程序配置

app.js中配置云环境id
config.js中，设置对应数据

#### 五、填写小程序后台配置

 1.【设置】- -【基本设置】- -【服务类目】- - 教育信息服务
 
 2.【设置】- -【基本设置】--【基础库最低版本设置】- -2.7.0
 
 3.【设置】- -【关注公众号】--【公众号关注组件】- -设置相关公众号
 
 4.【开发】- -【开发设置】--配置request和downloadfile域名
 
 5.客服自动闲聊机器人配置[https://mp.weixin.qq.com/s/T2w42TwP0qL4KeUXRcmw6A](https://mp.weixin.qq.com/s/T2w42TwP0qL4KeUXRcmw6A "https://mp.weixin.qq.com/s/T2w42TwP0qL4KeUXRcmw6A")
 
#### 六、设置管理员
 
 首次设置需要打开云开发，然后去user表中将你的那一条记录的admin设置为true，如果user中没有记录，首先去前端中留言板那里点一下发布，然后确认登录，然后去数据库里面设置，设置完了删除掉小程序再打开，即清空了本地缓存，在个人中心即会出现后台管理

#### 七、创建了一个小程序开发交流圈，开发中遇到各种问题或者想学习开发小程序，可以加入我们：
 ![交流圈](https://graph.baidu.com/resource/112c4781c34b4a4839ffd01562744990.jpg "交流圈")
