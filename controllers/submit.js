const { message: { checkSignature }, mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get (ctx, next) {
    const { id } = ctx.query
    let res, error
    await mysql('submits').join('members', 'member_id', '=', 'owner').
    select('*').where('submit_id', id).then( e => res = e[0]).catch(err => error = err)
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getState (ctx, next) {
    const { ac, mb } = ctx.query
    let res, error
    await mysql('submits').where('activity_id', ac).andWhere('owner', mb)
        .select('submit_id', 'state', 'state_json', 'create_at').then( e => res = e[0]).catch(err => error = err)
    if (res)
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getList (ctx, next) {
    const { activity, page = 1, limit = 10 } = ctx.query
    let res, error

        await mysql('submits').join('members', 'owner', '=', 'member_id').select('*')
            .where('activity_id', activity).
        limit(limit).offset((page - 1)*limit).then( e => {res = e; ctx.body = {submits: res}})
            .catch(err => ctx.body = {error: err})

}

async function post (ctx, post) {
    const body = ctx.request.body
    let error, res
    console.log(body)
    res = await mysql('submits').returning('submit_id')
      .insert({ owner: body.owner, activity_id: body.activity_id, content: body.content }).then(res => ctx.body = { submit_id: res[0] }).catch(err => ctx.body = { error: err })
}

async function put (ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('submits').where('submit_id', body.submit_id)
        .update({content: body.content})
        .then(e => res = body.submit_id).catch(err => error = err)
    if (res)
        ctx.body = {submit_id: res}
    else
        ctx.body = {error: error}
}

async function putAdmin (ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('submits').where('submit_id', body.submit_id)
        .update({state: body.state, state_json: body.state_json, is_notified: body.notified}).then(e => res = body.submit_id).catch(err => error = err)
    console.log(error)
    if (res)
        ctx.body = {submit_id: res}
    else
        ctx.body = {error: error}
}

async function del (ctx, post) {
    const { id } = ctx.query
    let error, res
    await mysql('submits').where('submit_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {submit_id: res}
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
    getState,
    getList,
    post,
    put,
    putAdmin,
    del
}
