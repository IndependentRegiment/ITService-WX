var fetch = require('../../utils/fetch');
//index.js
function isOpenID(res, resList) {
  for (var i = 0; i < resList.length; i++) {
    if (resList[i] == res) {
      return true;
    }
  }
  return false;
}
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getContent: "",
    getCurrent: "",
    phoneNumber: '8080888',
    roleName: '',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getAddressDetail: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',// 参考系
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        // console.log("纬度=" + latitude + " 经度=" + longitude);

        // 构建请求地址
        // var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
        //   longitude + "&key=" + 'XVLBZ-BSU66-ULJSQ-MFGXD-TM7GZ-55F2M' + "&get_poi=1";

        // that.sendRequest(qqMapApi);
      }
    })
  },

  /**
   * 发送请求获取地图接口的返回值
   */
  sendRequest: function (qqMapApi) {
    let that = this;
    // 调用请求
    wx.request({
      url: qqMapApi,
      data: {},
      method: 'GET',
      success: (res) => {
        // console.log(res)
        if (res.statusCode == 200 && res.data.status == 0) {
          // 从返回值中提取需要的业务地理信息数据
          wx.setStorageSync('province', res.data.result.address_component.province)
          wx.setStorageSync('city', res.data.result.address_component.city)
        }
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    var prvince = wx.getStorageSync("province");
    var city = wx.getStorageSync("city");
    if (prvince == "") {
      wx.setStorageSync('province', e.detail.userInfo.province)
    }
    if (city == "") {
      wx.setStorageSync('city', e.detail.userInfo.city)
    }
  },
  // 图标点击事件
  getCurrentIndex: function (e) {
    //console.log(e)
    //得到点击的项目
    this.getCurrent = e.currentTarget.dataset.z  //获取点击事件的信息
    console.log(this.getCurrent)
    if (this.getCurrent == 0) {
      wx.navigateTo({  //跳转登记
        url: '../register/register',
      })
    } else if (this.getCurrent == 2) {
      const openId = wx.getStorageSync('openid');
      const data = { 'openId': openId }
      fetch.postReq('user/count', data, (res) => {
        console.log(res);
        if (res.data === '新用户') {
          wx.showToast({
            title: '您为新用户，必须进行身份验证！',  // 标题
            icon: 'none',   // 图标类型，默认success
            duration: 2000,   // 提示窗停留时间，默认1500ms
          })
          setTimeout(() => {
            wx.navigateTo({  //跳转身份登记
              url: '../login/login',
            })
          }, 2000)
        } else {
          wx.navigateTo({  //跳转查看
            url: '../itPersonInfo/itPersonInfo',
          })
        }
      })
    } else if (this.getCurrent == 3) {
      // 手工登记
      wx.navigateTo({  //跳转查看
        url: '../handwork/handwork',
      })
    }else if (this.getCurrent == 4) {
      // 健康登记
      wx.navigateTo({  //健康登记
        url: '../health/health',
      })
    }
  },

  onLoad: function () {
    this.getAddressDetail();
    this.getContent = wx.getStorageSync("Content");
    app.getOpenid().then(res => {
      if (res.code == 200) {
        const openId = res.data.openId;
        const data = { 'openId': openId }
        console.log(data);
        fetch.postReq('user/count', data, (res) => {
          console.log(res);
          if (res.code === 200) {
            this.setData({
              roleName: res.data.roleName
            })
          }
        });
      } else {
        console.log(res.data);
      }
    });
    this.setData({
      getContent: this.getContent
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
