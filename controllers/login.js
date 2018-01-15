const { mysql } = require('../qcloud')

// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.data || {}
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        let isNew = true, res = {}, flag = false
        // ctx.body = {hello: 'my'}

        await mysql('members').where('openId', ctx.state.$wxInfo.userinfo.userinfo.openId).select('*')
            .then(e => { res = e[0]; if (e.length) flag = true })
        if (flag) {
            ctx.state.$wxInfo.userinfo.userinfo['name'] = res.name
          
            await mysql('members').where('openId', ctx.state.$wxInfo.userinfo.userinfo.openId)
                .update({nickName: ctx.state.$wxInfo.userinfo.userinfo.nickName,
                    avatar: ctx.state.$wxInfo.userinfo.userinfo.avatarUrl})
        }
        else {
            res = {}
            res['member_id'] = await mysql('members').returning('member_id')
                .insert({
                    openId: ctx.state.$wxInfo.userinfo.userinfo.openId,
                    nickName: ctx.state.$wxInfo.userinfo.userinfo.nickName,
                    avatar: ctx.state.$wxInfo.userinfo.userinfo.avatarUrl
                })
            ctx.state.$wxInfo.userinfo.userinfo['name'] = res.name
            flag = true
        }
        
        ctx.state.data = ctx.state.$wxInfo.userinfo
        //console.log(ctx.state.data)
    } else {
        ctx.state.code = -1
    }
}
