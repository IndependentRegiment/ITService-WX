// pages/handwork/handwork.js
var fetch = require('../../utils/fetch');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTemp:'',
    datecur:'',
    datesel: '',
    count:null,
  },

  bindDateChange: function (e) {
    this.setData({
      datesel: e.detail.value
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      count: e.detail.value
    })
  },

  getStandardDate() {
    var _date = new Date();
    var year = _date.getFullYear();
    var month = _date.getMonth() + 1;
    var day = _date.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    const datecur =  year + '-' + month + '-' + day;
    this.setData({
      datecur,
      datesel:datecur
    })
  },

  BeforeWeek() {
    var _date = new Date(); //获取今天日期
    _date.setDate(_date.getDate() - 6);//日期回到6天前
    var year = _date.getFullYear();
    var month = _date.getMonth() + 1;
    var day = _date.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };

    var dateTemp = year + '-' + month + '-' + day;
    _date.setDate(_date.getDate() + 7);//日期重置
    this.setData({
      dateTemp
    })
  },

  // 保存
  submit(){
    const openId = wx.getStorageSync('openid');
    const fillTime = this.data.datesel;
    const cardCount = this.data.count;
    const data = {openId,fillTime,cardCount }
    console.log(data);
    fetch.postReq('/card/hand/create', data, (res) =>{
      // console.log(res);
      if(res.code === 200){
        wx.showToast({
          title: res.message,
          icon:'success',
          duration: 1000
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStandardDate();
    this.BeforeWeek();
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