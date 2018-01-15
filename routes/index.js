/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

// matches
router.get('/match', controllers.match.get)
router.get('/matches', controllers.match.getList)
router.post('/match', controllers.match.post)
router.put('/match', controllers.match.put)
router.delete('/match', controllers.match.del)
// members
router.get('/member', validationMiddleware, controllers.member.getOtherInfo)
router.get('/members', controllers.member.getList)
// titles
router.get('/titles', controllers.title.getList)
router.post('/title', controllers.title.post)
router.put('/title', controllers.title.put)
router.delete('/title', controllers.title.del)

router.get('/member/title', controllers.title.getUserTitle)
router.post('/member/title', controllers.title.addUserTitle)
router.delete('/member/title', controllers.title.deleteUserTitle)

// article
router.get('/article', controllers.article.get)
router.get('/articles', controllers.article.getList)
router.post('/article', controllers.article.post)
router.put('/article', controllers.article.put)
router.delete('/article', controllers.article.del)

// activity
router.get('/activity', controllers.activity.get)
router.get('/activities', controllers.activity.getList)
router.post('/activity', controllers.activity.post)
router.put('/activity', controllers.activity.put)
router.delete('/activity', controllers.activity.del)

// submit
router.get('/submit/member', controllers.submit.getState)
router.get('/submit', controllers.submit.get)
router.get('/submits', controllers.submit.getList)
router.post('/submit', controllers.submit.post)
router.put('/submit', controllers.submit.put)
router.put('/submit/admin', controllers.submit.putAdmin)
router.delete('/submit', controllers.submit.del)

// banner
router.get('/banner', controllers.banner.get)
router.get('/banners', controllers.banner.getList)
router.post('/banner', controllers.banner.post)
router.put('/banner', controllers.banner.put)
router.delete('/banner', controllers.banner.del)

router.get('/chant', controllers.chant.get)
router.get('/chants', controllers.chant.getList)
router.post('/chant', controllers.chant.post)
router.put('/chant', controllers.chant.put)
router.delete('/chant', controllers.chant.del)

router.get('/formid', controllers.formid.getList)
router.post('/formid', controllers.formid.post)
router.delete('/formid', controllers.formid.del)

module.exports = router
