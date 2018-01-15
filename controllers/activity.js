const {message: {checkSignature}, mysql} = require('../qcloud')
const {checktitles} = require('../utils/utils')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
    const {id, tt, pms = false, ctype = '0'} = ctx.query
    let type = parseInt(ctype)
    let res, error
    if (type === 1)
        await mysql('activities').where('activity_id', id).select('*').then(e => res = e[0]).catch(err => error = err)
    else if (type === 3)
        await mysql('activities').where('activity_id', id).select('activity_id', 'activity_name', 'content', 'for_titles', 'header').then(e => res = e[0]).catch(err => error = err)
    else
        await mysql('activities').join('members', 'owner_id', '=', 'member_id').select('*').where('activity_id', id).then(e => res = e[0]).catch(err => error = err)
    console.log(error)
    if (type === 2)
        res.content = undefined
    if (res && (pms || checktitles(res.for_titles, tt)))
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getList(ctx, next) {
    let {type, state, running, page = 1, limit = 10, pms = false, sort = "desc", tt} = ctx.query
    let res = [], error
    type = parseInt(type)
    state = parseInt(state)
    let ctype = type > -1 ? [type, type] : [0, 100]
    let cstate = state > -1 ? [state, state] : [0, 2]
    let crunning = running > -1 ? [running, running] : [0, 1]
    await mysql('activities')
    //.andWhere('type', 1).andWhere('draft', 0)
        .whereBetween('type', ctype).andWhereBetween('state', cstate).andWhereBetween('running', crunning)
        .orderBy('end_time', sort).limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
    // if (!type && !draft)
    //     await mysql('activities').select('*').where('time', '>', new Date()).
    //     orderBy('time').limit(limit).offset((page - 1)*limit).then( e => res = e).catch(err => error = err)
    // else
    //     await mysql('activities').select('*').where('time', '>', new Date()).
    //     andWhere('type', type).orderBy('time').
    //     limit(limit).offset((page - 1)*limit).then( e => res = e ).catch(err => error = err)
    let res1 = res.map(e => ({
        activity_id: e.activity_id, activity_name: e.activity_name, for_titles: e.for_titles, type: e.type,
        state: e.state, running: e.running, count: e.count
    }))
    
    if (res1)
        ctx.body = {activities: pms ? res1 : res1.filter(e => checktitles(e.for_titles, tt))}
    else
        ctx.body = {error: error}
}

async function post(ctx, post) {
    const body = ctx.request.body
    let error, res
    res = await mysql('activities').returning('activity_id')
        .insert({
            activity_name: body.activity_name, type: body.type, limit_count: body.limit_count,
            start_time: body.start_time,
            end_time: body.end_time, owner_id: body.owner_id, description: body.description,
            content: body.content, header: body.header, for_titles: body.for_titles,
            running: body.running, attach_title_id: body.attach_title_id,
            is_attached_title: body.is_attached_title
        }).catch(err => error = err)
    console.log(error)
    if (res)
        ctx.body = {activity_id: res[0]}
    else
        ctx.body = {error: error}
}

async function put(ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('activities').where('activity_id', body.activity_id)
        .update({
            activity_name: body.activity_name, type: body.type, limit_count: body.limit_count,
            start_time: body.start_time,
            end_time: body.end_time, owner_id: body.owner_id, description: body.description,
            content: body.content, header: body.header, for_titles: body.for_titles,
            running: body.running, attach_title_id: body.attach_title_id,
            is_attached_title: body.is_attached_title
        })
        .then(e => res = body.activity_id).catch(err => error = err)
    if (res)
        ctx.body = {activity_id: res}
    else
        ctx.body = {error: error}
}

async function del(ctx, post) {
    const {id} = ctx.query
    let error, res
    await mysql('activities').where('activity_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {activity_id: res}
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
