const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx29f5cfd1bb239523',

    // 微信小程序 App Secret
    appSecret: '72fa82091a1aaad75abfb41e2f9a2a00',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '172.16.152.1',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        //pass: 'root',
        pass: 'QCbWqNZT27817',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 区域
         * 华北：cn-north
         * 华东：cn-east
         * 华南：cn-south
         * 西南：cn-southwest
         * 新加坡：sg
         * @see https://www.qcloud.com/document/product/436/6224
         */
      region: 'ap-shanghai',
        // Bucket 名称
        fileBucket: 'shgxlm',
        // 文件夹
        uploadFolder: 'my'
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'





    // tencent cloud

    // serverHost: 'localhost',
    // tunnelServerUrl: '',
    // tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    // qcloudAppId: '1252533121',
    // qcloudSecretId: 'AKIDjg0nfcvJX2feUFkluTSG7agcijRDFlEn',
    // qcloudSecretKey: '6Ex1DW07OqH9BVoB7760nlhkAeDACSqa',
    // wxMessageToken: 'weixinmsgtoken',
    // networkTimeout: 30000

}

module.exports = CONF
