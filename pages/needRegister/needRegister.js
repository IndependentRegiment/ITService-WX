// pages/needRegister/needRegister.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: [" 1. 访客进入本公司必须提前与受访人预约，并请受访人在前台带领您方可进入。", " 2. 本公司有严格的保密制度，所有区域禁止拍照，访客在进入前必须将携带的手机存入手机保管柜。", " 3. 所有访客必须领取《访客卡》，佩戴于显眼位置，并在离开时归还至前台。"],
    items: [
      {name: 'true', value: '我已仔细阅读以上内容,并承诺如实登记。'},
    ],
    checkBoxButton:[],
    hidden: false,
    resData: {"openid":"","CreateTime":"","Visitor":"","IDCard":"","Tel":"","CompanyType":"","Company":"","DepartMent":"","Remark":"","Employee":"","BeginTime":"","EndTime":""},
    bodyHidden: false,
    checkCompanyType: [
      {name: '外部公司', value: '外部公司'},
      {name: '正泰内部公司', value: '正泰内部公司'}
    ],
    checkBoxCompanyType:[],
    disable: false,
    //几秒后可确认
    second: 5,
    disabled: true,
    showSec: false
  },
  //获取各个值
  getUserName: function (e) {
    this.data.resData.Visitor = e.detail.value
  }, 
  getUserCard: function (e) {
    this.data.resData.IDCard = e.detail.value
  },
  getPhone: function (e) {
    this.data.resData.Tel = e.detail.value
    // var phone = e.detail.value;
    // let that = this
    // if (!(/^1[34578]\d{9}$/.test(phone))) {
    //     wx.showToast({
    //       title: '手机号有误',
    //       icon: 'success',
    //       duration: 2000
    //     })
    // } else {
    //   this.setData({
    //     ajxtrue: true
    //   })
    //   console.log('验证成功', that.data.ajxtrue)
    // }
  },
  getCompany: function (e) {
    this.data.resData.Company = e.detail.value
  }, 
  getDepartment: function (e) {
    this.data.resData.DepartMent = e.detail.value
  }, 
  getProUserName: function (e) {
    this.data.resData.Employee = e.detail.value
  }, 
  getCause: function (e) {
    this.data.resData.Remark = e.detail.value
  },
  //判断选中注意事项
  checkboxChange: function(e) {
    this.checkBoxButton = e.detail.value
  },
  //公司类型
  getCheckCompanyType: function(e) {
    this.checkBoxCompanyType = e.detail.value
    this.data.resData.CompanyType = this.checkBoxCompanyType
  },
  yes: function () {
    this.setData({
      checkBoxButton: []
    })
    if(this.checkBoxButton == undefined ){
      wx.showToast({
        title: '请先阅读注意事项!',
      })
     }else if(this.checkBoxButton[0] != "true"  ){
      wx.showToast({
        title: '请先阅读注意事项!',
      })
     }else {
      wx.showLoading({
        title: '加载中',
      })
      var that = this
      setTimeout(function () {
        wx.hideLoading()
        that.setData({
          hidden: true,
          bodyHidden: true
        })
      }, 2000)
    }
  },
  no: function () {
    wx.showToast({
      title: '请点击同意！',
    })
  },
  submit: function () {
    this.data.resData.CreateTime = util.formatTime(new Date())
    this.data.resData.openid = wx.getStorageSync('openid')
    this.data.resData.BeginTime = util.formatTime(new Date())
    this.data.resData.EndTime = util.formatTime(new Date())
    console.log(this.data.resData)
    if ( this.data.resData.Visitor == "" || this.data.resData.IDCard == "" || this.data.resData.Tel == "" || this.data.resData.Company == "" || this.data.resData.DepartMent == "" || this.data.resData.Remark == "" ||  this.data.resData.CompanyType == ""){
      wx.showToast({
        title: '请填写必填项！',
      })
    }else{
      //检查身份证号
      /*if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.resData.IDCard))) {
        wx.showToast({
          title: '身份证号码有误',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }*/
      //检查手机号
      if (!(/^1\d{10}$/.test(this.data.resData.Tel))) {
          wx.showToast({
            title: '手机号须为18位！',
            icon: 'success',
            duration: 2000
          })
        return false;
      }
      wx.setStorageSync('resData', this.data.resData)
      var that = this
      wx.request({
        url: 'https://blog.shenjq.top/api/VisitorReg/Register',
        method: 'POST',
        data: that.data.resData,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if ( res.data == true) {
            wx.showToast({
              title: '提交成功！',
            })
            // that.setData({
            //   resData: {"openid":"","CreateTime":"","Visitor":"","IDCard":"","Tel":"","CompanyType":"","Company":"","DepartMent":"","Remark":"","Employee":"","BeginTime":"","EndTime":""},
            //   checkCompanyType: [
            //     {name: '外部公司', value: '外部公司'},
            //     {name: '正泰内部公司', value: '正泰内部公司'}
            //   ],
            // })
            wx.navigateTo({
              url: '../RegDetail/RegDetail',
            })
          }
        }
      })
    }
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid')
    var that = this 
    setInterval(() => {
      if( that.data.second<=0 ){
        that.setData({
          disabled: false,
          showSec: true
        })
      }else{
        var s = util.setTime(that.data.second)
        that.setData({
          second: s
        })
      }
    }, 1000);
    wx.request({
      url: 'https://blog.shenjq.top/api/VisitorReg/IsRegistered?id='+openid,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if ( res.data!=null ) {
          that.data.resData.Visitor = res.data.Visitor
          that.data.resData.openid = res.data.openid
          that.data.resData.IDCard = res.data.IDCard
          that.data.resData.Tel = res.data.Tel
          that.data.resData.DepartMent = res.data.DepartMent
          that.data.resData.Company = res.data.Company
          if ( res.data.CompanyType == "外部公司" ) {
            that.data.checkCompanyType = [
              {name: '外部公司', value: '外部公司', checked: 'true'},
              {name: '正泰内部公司', value: '正泰内部公司'}
            ]
            that.data.resData.CompanyType = "外部公司"
          }else {
            that.data.checkCompanyType = [
              {name: '外部公司', value: '外部公司'},
              {name: '正泰内部公司', value: '正泰内部公司', checked: 'true'}
            ]
            that.data.resData.CompanyType = "正泰内部公司"
          }
        }
        that.setData({
          resData: that.data.resData,
          checkCompanyType: that.data.checkCompanyType
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hidden: false,
      bodyHidden: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})