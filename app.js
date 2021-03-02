//app.js
var fetch = require('./utils/fetch');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync("Content", [
      { "src": "../img/icon-register.png", "name": "体温登记", index: "0" },
      { "src": "../img/icon-look.png", "name": "查看", index: "1" },
      { "src": "../img/icon-serve.png", "name": "IT服务中心", index: "2" },
    ])
    wx.setStorageSync("Content1", [
      { "src": "../img/chakan1.gif", "name": "登记结果", index: "2" }
    ])
    wx.setStorageSync("openIdList", [
      { "OpenId": "oAh3O4ucF8bIKN5IJAUUGc8k0nwo", "Username": "索鹏亮", "UserId": "4069", "Department": "技术平台部" }
    ])
    wx.setStorageSync("OpenIdList1", [{ "OpenId": "dadasd", "Username": "索鹏亮1", "UserId": "40691", "Department": "技术平台部1" }])
    // 登录
    this.getOpenid();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 请求接口，存储个人信息
        const openid = wx.getStorageSync('openid')
        wx.request({
          url: 'url',
          data: { openid },
          success: (res) => {
            const resData = JSON.parse(res.data);
            wx.setStorageSync("userRole", resData.userRole);
          }
        })
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  // 获取openid的方法
  getOpenid: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          //code 获取用户信息的凭证
          if (res.code) {
            //请求获取用户openid
            var code = res.code
            console.log("获取用户的code"+code)
            wx.setStorageSync('code', code)
            var getCode = wx.getStorageSync('code')  // 获得code
            const data = {
              'code': getCode
            };
            // 设置openid
            fetch.postReq('user/login', data, (res) => {  // 等待后端返回一个openID
              wx.setStorageSync("openid", res.data.openId);
              resolve(res);
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject('error');
          }
        }
      })
    });
  },
})
