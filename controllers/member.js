const { message: { checkSignature }, mysql } = require('../qcloud')

async function getList (ctx, next) {
    const { title, page = 1, limit = 10 } = ctx.query
    let res, error
    if (!title)
        await mysql('members').select('*')
            .limit(limit).offset((page - 1)*limit).then( e => res = e).catch(err => error = err)
    else
        await mysql.select('*').from('members').joinRaw('natural join member_title').where('title_id', parseInt(title))
            .limit(limit).offset((page - 1)*limit).
        then(
            e => res = e
    ).catch(err => error = err)
    if (res)
        ctx.body = {members: res}
    else
        ctx.body = {error: error}
}

async function getOtherInfo (ctx, next) {
    // const {user} = ctx.query
    console.log(ctx.state.$wxInfo)
    let user = ctx.state.$wxInfo.userinfo.openId
    await mysql('members').where('openId', user).select('*')
        .then(e => {
            res = e[0];
            if (e.length) flag = true
        })

    // console.log(res)

    await mysql('member_title').where('member_id', res.member_id)
        .join('titles', 'member_title.title_id', '=', 'titles.title_id')
        .select('titles.title_id', 'title_content', 'title_icon').then(e => res['titles'] = e)
    res['titlestr'] = res['titles'].map(e => e.title_id).join(',')
    // ctx.state.$wxInfo.userinfo.forEach(e => res.push(e))
    ctx.body = Object.assign(res, ctx.state.$wxInfo.userinfo)
}

module.exports = {
    getList,
    getOtherInfo
}
