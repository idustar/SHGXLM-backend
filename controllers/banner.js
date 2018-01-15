const { message: { checkSignature }, mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get (ctx, next) {
    const { id } = ctx.query
    let res, error
    await mysql('banners').select('*').where('banner_id', id).then( e => res = e[0]).catch(err => error = err)
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getList (ctx, next) {
    const { type } = ctx.query
    let res, error
    if (!type)
        await mysql('banners').select('*').
        then( e => res = e).catch(err => error = err)
    else
        await mysql('banners').select('*').
        andWhere('type', type)
        .then( e => res = e ).catch(err => error = err)
    console.log(error)
    if (res.length)
        ctx.body = {banners: res}
    else
        ctx.body = {error: error}
}

async function post (ctx, post) {
    const body = ctx.request.body
    let error, res
    res = await mysql('banners').returning('banner_id')
        .insert({image, goto} = body).catch(err => error = err)
    if (res)
        ctx.body = {banner_id: res[0]}
    else
        ctx.body = {error: error}
}

async function put (ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('banners').where('banner_id', body.banner_id)
        .update({image, goto} = body).then(e => res = body.banner_id).catch(err => error = err)
    if (res)
        ctx.body = {banner_id: res}
    else
        ctx.body = {error: error}
}

async function del (ctx, post) {
    const { id } = ctx.query
    let error, res
    await mysql('banners').where('banner_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {banner_id: res}
    else
        ctx.body = {error: error}
}

// async function post (ctx, next) {
//     // 检查签名，确认是微信发出的请求
//     const { signature, timestamp, nonce } = ctx.query
//     if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
//
//     /**
//      * 解析微信发送过来的请求体
//      * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
//      */
//     const body = ctx.request.body
//
//     ctx.body = 'success'
// }

module.exports = {
    get,
    getList,
    post,
    put,
    del
}
