const { message: { checkSignature }, mysql } = require('../qcloud')

async function getList(ctx, next) {
  let { member } = ctx.query

  await mysql('member_formid').where('member_id', member).select('*')
    .then(e => { res = e; ctx.body = { formid: res[0] } })
    .catch(err => { console.log(err); ctx.body = { error: err } })
}

async function post(ctx, post) {
  const body = ctx.request.body
  let error, res
  res = await mysql('member_formid').returning('formid')
    .insert({ member_id: body.member_id, formid: body.formid, openId: body.openId }).catch(err => error = err)
  console.log(error)
  if (res)
    ctx.body = { formid: res }
  else
    ctx.body = { error: error }
}

async function del(ctx, post) {
  const { id } = ctx.query
  let error, res
  await mysql('member_formid').where('formid', id)
    .del().then(e => res = id).catch(err => error = err)
  if (res)
    ctx.body = { formid: res }
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
  getList,
  post,
  del
}

