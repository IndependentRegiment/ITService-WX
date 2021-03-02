var util = require('../../utils/util.js');
// pages/cert/cert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: [" 1. 因工号和部门是一对一绑定，如不确定自己的工号请联系IT获取.","  感谢你的支持！"],
    endContent: { "UserId": "", "UserName": "", "Department": "", "CountDate": "", "OpenId": "" },
    isShowContent: { "UserId": "", "Department": "" },
    select: false,
    depart: '技术平台部',
    selectList: ["技术平台部","财务部","核心工艺部"] 
  },
  //获取各个值
  getUserName: function (e) {
    this.data.endContent.UserName = e.detail.value
  },
  submit: function () {
    this.setData({
      endContent: this.data.endContent
    })
    var openid = wx.getStorageSync('openid');
    if (this.data.endContent.UserName == "" ) {
      wx.showToast({
        title: '姓名不能为空！'
      })
    } else {
      wx.request({
        url: 'https://shenjq.top/api/Org/BindOrg?openid=' + openid + '&&LeaderName=' + this.data.endContent.UserName,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          if (res.data == true){
            wx.showToast({
              title: '认证成功！',
            })
            wx.redirectTo({
              url: '../view/view',
            })
          }else {
            wx.showToast({
              title: '认证失败！',
            })
          }
        }
      })
     
    }
    console.log(this.data.endContent)
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  getDepartment(e) {
    var name = e.currentTarget.dataset.name
    this.data.endContent.Department = name
    this.setData({
      depart: name,
      select: false
    })
  },
  onLoad: function (options) {
    this.data.endContent.OpenId = wx.getStorageSync('openid')
    this.data.endContent.CountDate = util.formatTimeDate(new Date())
    this.data.endContent.Department = this.data.depart
    this.setData({
      endContent: this.data.endContent
    })
    var openIdList = wx.getStorageSync("openIdList1")
    console.log(openIdList)
    console.log(this.data.endContent.OpenId)
    for (var i = 0; i < openIdList.length; i++) {
      console.log(this.data.endContent.OpenId == openIdList[i].OpenId)
      if (openIdList[i].OpenId == this.data.endContent.OpenId) {
        console.log(openIdList[i])
        this.data.isShowContent.UserName = openIdList[i].Username
        this.data.isShowContent.UserId = openIdList[i].UserId
        this.data.isShowContent.Department = openIdList[i].Department
        this.setData({
          isShowContent: this.data.isShowContent
        })
        console.log(this.data.isShowContent)
      }
    }
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