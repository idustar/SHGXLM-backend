const { message: { checkSignature }, mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */

async function getList (ctx, next) {
    const { page = 1, limit = 10 } = ctx.query
    let res = [], error
        await mysql('titles').select('*').
        limit(limit).offset((page - 1)*limit).then( e => res = e).catch(err => error = err)
    if (res && res[0])
        ctx.body = {titles: res}
    else
        ctx.body = {error: error}
}

async function post (ctx, post) {
    const body = ctx.request.body
    let error, res
    res = await mysql('titles').returning('title_id')
        .insert({title_content: body.title_content, title_icon: body.title_icon}).catch(err => error = err)
    console.log(res)
    if (res)
        ctx.body = {title_id: res[0]}
    else
        ctx.body = {error: error}
}

async function put (ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('titles').where('title_id', body.title_id)
        .update({title_content: body.title_content, title_icon: body.title_icon})
        .then(e => res = body.title_id).catch(err => error = err)
    if (res)
        ctx.body = {title_id: res}
    else
        ctx.body = {error: error}
}

async function del (ctx, post) {
    const { id } = ctx.query
    let error, res
    await mysql('member_title').where('title_id', id)
        .del().then().catch(err => error = err)
    await mysql('titles').where('title_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {title_id: res}
    else
        ctx.body = {error: error}
}

async function getUserTitle (ctx, next) {
    const { user } = ctx.query
    let res, error
    await mysql.from('titles').joinRaw('natural join member_title').where('member_id', parseInt(user))
        .select('title_id', 'title_content', 'title_icon').then( e => res = e).catch(err => error = err)
    if (res.length)
        ctx.body = {titles: res}
    else
        ctx.body = {error: error}
}

async function addUserTitle (ctx, post) {
    const body = ctx.request.body
    console.log(body)
    let error, res
    await mysql('member_title')
        .insert({member_id: body.member_id, title_id: body.title_id})
        .then(e => res = body).catch(err =>  error = err )
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function deleteUserTitle (ctx, post) {
    const { member_id, title_id } = ctx.query
    let error, res
    await mysql('member_title').where('member_id', member_id).andWhere('title_id', title_id)
        .del().then(e => res = ctx.query).catch(err => error = err)
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error, body: ctx.query}
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
    getList,
    getUserTitle,
    addUserTitle,
    deleteUserTitle,
    post,
    put,
    del
}
