// pages/RegDetail/RegDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
          name: '姓名',
          content: '1'
      },
      {
        name: '访客身份证号码',
        content: ''
      },
      {
        name: '手机号',
        content: ''
      },
      {
        name: '您所在公司类型',
        content: ''
      },
      {
        name: '您所在公司名称',
        content: ''
      },
      {
        name: '您所在公司部门',
        content: ''
      },
      {
        name: '受访人姓名',
        content: ''
      },
      {
        name: '拜访事由',
        content: ''
      },
      {
        name: '进入时间',
        content: ''
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var resData = wx.getStorageSync('resData')
    this.data.list[0].content = resData.Visitor
    this.data.list[1].content = resData.IDCard
    this.data.list[2].content = resData.Tel
    this.data.list[3].content = resData.CompanyType
    this.data.list[4].content = resData.Company
    this.data.list[5].content = resData.DepartMent
    this.data.list[6].content = resData.Employee
    this.data.list[7].content = resData.Remark
    this.data.list[8].content = resData.BeginTime
    this.setData({
      list: this.data.list
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