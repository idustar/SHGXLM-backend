const { message: { checkSignature }, mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
  const { id } = ctx.query
  let res, error
  await mysql('matches').select('*').where('match_id', id).then(e => res = e[0]).catch(err => error = err)
  if (res)
    ctx.body = res
  else
    ctx.body = { error: error }
}

async function getList(ctx, next) {
  let { type = 7, page = 1, limit = 15 } = ctx.query
  type = parseInt(type)
  if (type === 0)
    type = null
  let res, error
  if (type === 7)
    await mysql('matches').select('*').
      limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
  else if (type === 6)
    await mysql('matches').select('*').where('time', '<', new Date()).
      orderBy('time', 'desc').limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
  else if (!type)
    await mysql('matches').select('*').where('time', '>', new Date()).andWhereBetween('type', [1, 4]).
      orderBy('time').limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
  else
    await mysql('matches').select('*').where('time', '>', new Date()).
      andWhere('type', type).orderBy('time').
      limit(limit).offset((page - 1) * limit).then(e => res = e).catch(err => error = err)
  if (res.length)
    ctx.body = { matches: res }
  else
    ctx.body = { error: error }
}

async function post(ctx, post) {
  const body = ctx.request.body
  let error, res
  console.log(body)
  res = await mysql('matches').returning('match_id')
    .insert({ home, team, time, round, result, type, stadium } = body).catch(err => error = err)
  console.log(error)
  if (res)
    ctx.body = { match_id: res[0] }
  else
    ctx.body = { error: error }
}

async function put(ctx, post) {
  const body = ctx.request.body
  let error, res
  await mysql('matches').where('match_id', body.match_id)
    .update({ home, team, time, round, result, type, stadium } = body).then(e => res = body.match_id).catch(err => error = err)
  if (res)
    ctx.body = { match_id: res }
  else
    ctx.body = { error: error }
}

async function del(ctx, post) {
  const { id } = ctx.query
  let error, res
  await mysql('matches').where('match_id', id)
    .del().then(e => res = id).catch(err => error = err)
  if (res)
    ctx.body = { match_id: res }
  else
    ctx.body = { error: error }
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

