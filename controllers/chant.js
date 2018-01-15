const { message: { checkSignature }, mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get (ctx, next) {
    const { id } = ctx.query
    let res, error
    await mysql('chants').select('*').where('chant_id', id).then( e => res = e[0]).catch(err => error = err)
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getList (ctx, next) {
    const { type, page = 1, limit = 10 } = ctx.query
    let res, error
    if (!type)
        await mysql('chants').select('*').limit(limit).offset((page - 1) * limit).
        then( e => res = e).catch(err => error = err)
    else
        await mysql('chants').select('*').andWhere('type', type).limit(limit).offset((page - 1) * limit)
        .then( e => res = e ).catch(err => error = err)
    console.log(error)
    if (res.length)
        ctx.body = {chants: res}
    else
        ctx.body = {error: error}
}

async function post (ctx, post) {
    const body = ctx.request.body
    let error, res
    res = await mysql('chants').returning('chant_id')
        .insert(body).catch(err => error = err)
    if (res)
        ctx.body = {chant_id: res[0]}
    else
        ctx.body = {error: error}
}

async function put (ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('chants').where('chant_id', body.chant_id)
        .update(body).then(e => res = body.chant_id).catch(err => error = err)
    if (res)
        ctx.body = {chant_id: res}
    else
        ctx.body = {error: error}
}

async function del (ctx, post) {
    const { id } = ctx.query
    let error, res
    await mysql('chants').where('chant_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {chant_id: res}
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
