// pages/personInfo/personInfo.js
var fetch = require('../../utils/fetch');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['离线', '在线'],
    index: 0,
    roleName:''
  },
  // 体温查看
  getCurrentIndex(){
    var openid=wx.getStorageSync('openid')
      wx.navigateTo({  //跳转查看
        url: '../result/result',
      })
  },
  // 修改状态
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    });
    const openId=wx.getStorageSync('openid');
    const statusId = e.detail.value;
    const data={
      openId,
      statusId
    }
    fetch.postReq('/user/update/status', data, (res) => {
      console.log(res);
      if(res.code !== 200){
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 初始化请求状态
  getStatus(){
    const openId=wx.getStorageSync('openid');
    const data = {openId}
    fetch.postReq('/card/hand/list', data, (res) => {
      console.log(res);
      this.setData({
        index:res.data.userStatus.statusId,
        roleName:res.data.userStatus.roleName
      })
    })
  },

  // 查看手工单
  lookDan(){
    wx.navigateTo({
      url: '../handworkList/handworkList',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStatus();
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