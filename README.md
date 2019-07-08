# 欢迎使用wxapp-blog

**让写博客像发朋友圈一样简单**





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
