// 云函数入口文件
var cloud = require('wx-server-sdk');
var TcbRouter = require('tcb-router');
var parser = require('parser-wxapp');

cloud.init();
const db = cloud.database();

exports.main = (event, context) => {
  const app = new TcbRouter({ event });

  //【后台】人员管理--审核
  app.router('admin/people/verify', async (ctx) => {
    try {
      return await db.collection('user').doc(event.user._id).update({
        data: {
          used: event.set
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】管理员设置
  app.router('admin/people/admin', async (ctx) => {
    try {
      return await db.collection('user').doc(event.user._id).update({
        data: {
          admin: event.set
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】留言管理--审核
  app.router('admin/message/verify', async (ctx) => {
    try {
      return await db.collection('message').doc(event.mess._id).update({
        data: {
          openView: event.set
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】留言管理--回复留言
  app.router('admin/message/reply', async (ctx) => {
    try {
      return await db.collection('message').doc(event.mess._id).update({
        data: {
         reply:{
           code: 1,
           admin: event.Administrator,
           content: event.replyContent,
         }
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】留言管理--删除回复
  app.router('admin/message/delete', async (ctx) => {
    try {
      return await db.collection('message').doc(event.mess._id).update({
        data: {
          reply: {
            code:0
          }
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】评论管理--审核
  app.router('admin/comments/verify', async (ctx) => {
    try {
      return await db.collection('comments').doc(event.mess._id).update({
        data: {
          openView: event.set
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】评论管理--回复评论
  app.router('admin/comments/reply', async (ctx) => {
    try {
      return await db.collection('comments').doc(event.mess._id).update({
        data: {
          reply: {
            code: 1,
            admin: event.Administrator,
            content: event.replyContent,
          }
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】评论管理--删除回复
  app.router('admin/comments/delete', async (ctx) => {
    try {
      return await db.collection('comments').doc(event.mess._id).update({
        data: {
          reply: {
            code: 0
          }
        }
      })
    } catch (e) {
      console.error(e)
    }
  });
  //登录验证openid
  app.router('login', async (ctx) => {
    const wxContext = cloud.getWXContext();
    ctx.body={
      openid: wxContext.OPENID
    }
  });
  //【后台】分类管理--删除
  app.router('admin/kind/delete', async (ctx) => {
    try {
      return await db.collection('kind').doc(event.kind._id).remove()
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】通知管理--删除
  app.router('admin/notice/delete', async (ctx) => {
    try {
      return await db.collection('notice').doc(event.notice._id).remove()
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】关联公众号--删除
  app.router('admin/gzh/delete', async (ctx) => {
    try {
      return await db.collection('gzh').doc(event.gzh._id).remove()
    } catch (e) {
      console.error(e)
    }
  });
  //【后台】内容管理--删除
  app.router('admin/contents/delete', async (ctx) => {
    try {
      return await db.collection('published').doc(event.details._id).remove()
    } catch (e) {
      console.error(e)
    }
  });
  return app.serve();

}