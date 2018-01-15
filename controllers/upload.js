const { uploader } = require('../qcloud')

module.exports = async ctx => {
    // 获取上传之后的结果
    // 具体可以查看：
    try{
    const data = await uploader(ctx.req)
    ctx.state.data = data
    } catch (e) {
      console.log(e)
      ctx.state.data = JSON.stringify(e)
    }
}
