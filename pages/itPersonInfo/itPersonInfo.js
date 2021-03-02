// pages/personInfo/personInfo.js
var fetch = require('../../utils/fetch');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '866902',
    personInfo: [],
    userRole:'',
    icon:{
      add:'https://itservice.chintpower.com:8085/static/icon/add.png',
      complete:'https://itservice.chintpower.com:8085/static/icon/complete.png',
      evaluate:'https://itservice.chintpower.com:8085/static/icon/evaluate.png',
      handle:'https://itservice.chintpower.com:8085/static/icon/handle.png',
      pending:'https://itservice.chintpower.com:8085/static/icon/pending.png',
      together:'https://itservice.chintpower.com:8085/static/icon/together.png'
    }
  },
  // 拨打电话事件
  call: function () {
    // wx.makePhoneCall({
    //   phoneNumber: '8008888'
    // })
  },
  // 获取页面信息
  getListItem() {
    const openId = wx.getStorageSync('openid');
    const data = { 'openId': openId }
    fetch.postReq('user/count', data, (res) => {
      console.log(res);
      this.setData({
        personInfo:res.data.roleList,
        userRole: res.data.roleName
      });
      wx.stopPullDownRefresh()
      wx.setStorageSync("userRole", res.data.roleName);
      wx.setStorageSync("userName", res.data.userName);
    })
  },
  // 点击列表事件
  getList: function (e) {
    const status = e.currentTarget.dataset.title;
    const count = e.currentTarget.dataset.count;
    if(count !== 0){
      wx.navigateTo({
        url: `../listDetail/listDetail?status=${status}`,
      })
    }else{
      wx.showToast({
        title: '没有可查看信息',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
    })
    }
  },
  // 悬浮窗事件
  createTask() {
    wx.navigateTo({
      url: '../create/create',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListItem();
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
    this.getListItem();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getListItem();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
