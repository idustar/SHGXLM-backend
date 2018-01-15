const {message: {checkSignature}, mysql} = require('../qcloud')
const {checktitles} = require('../utils/utils')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
    const {id, tt, pms = false} = ctx.query
    let res, error

    await mysql('articles').where('article_id', id).join('members', 'member_id', '=', 'owner').select('*').then(e => res = e[0]).catch(err => error = err)
    if (res && (pms || checktitles(res.for_titles, tt)))
        ctx.body = res
    else
        ctx.body = {error: error}
}

async function getList(ctx, next) {
    let {type, draft, page = 1, limit = 10, pms = false, tt} = ctx.query
    let res, error
    type = parseInt(type)
    draft = parseInt(draft)
    let ctype = type > -1 ? [type, type] : [0, 100]
    let cdraft = draft > -1 ? [draft, draft] : [0, 1]
    
    await mysql('articles').join('members', 'member_id', '=', 'owner')
    //.andWhere('type', 1).andWhere('draft', 0)
        .whereBetween('type', ctype).andWhereBetween('draft', cdraft)
        .orderBy('article_id', 'desc').limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
    // if (!type && !draft)
    //     await mysql('articles').select('*').where('time', '>', new Date()).
    //     orderBy('time').limit(limit).offset((page - 1)*limit).then( e => res = e).catch(err => error = err)
    // else
    //     await mysql('articles').select('*').where('time', '>', new Date()).
    //     andWhere('type', type).orderBy('time').
    //     limit(limit).offset((page - 1)*limit).then( e => res = e ).catch(err => error = err)
    let res1 = res.map(e => ({
        title: e.title, for_titles: e.for_titles, owner: e.owner, type: e.type, draft: e.draft, header: e.header,
        avatar: e.avatar, name: e.name, article_id: e.article_id, created_at: e.create_at
    }))
    if (res.length)
        ctx.body = {articles: pms ? res1 : res1.filter(e => checktitles(e.for_titles, tt))}
    else
        ctx.body = {error: error}
}

async function post(ctx, post) {
    const body = ctx.request.body
    let error, res
    res = await mysql('articles').returning('article_id')
        .insert({
            title: body.title, content: body.content,
            for_titles: body.for_titles, owner: parseInt(body.owner),
            type: body.type, draft: body.draft, header: body.header
        }).catch(err => error = err)
    console.log(error)
    if (res)
        ctx.body = {article_id: res[0]}
    else
        ctx.body = {error: error}
}

async function put(ctx, post) {
    const body = ctx.request.body
    let error, res
    await mysql('articles').where('article_id', body.article_id)
        .update({
            title: body.title, content: body.content,
            for_titles: body.for_titles, owner: parseInt(body.owner),
            type: body.type, draft: body.draft, header: body.header
        })
        .then(e => res = body.article_id).catch(err => error = err)
    if (res)
        ctx.body = {article_id: res}
    else
        ctx.body = {error: error}
}

async function del(ctx, post) {
    const {id} = ctx.query
    let error, res
    await mysql('articles').where('article_id', id)
        .del().then(e => res = id).catch(err => error = err)
    if (res)
        ctx.body = {article_id: res}
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
