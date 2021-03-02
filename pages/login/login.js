// pages/login/login.js
var fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {
      "deptId": 0,
      "email": "",
      "openId": "",
      "phone": "",
      "userId": "",
      "userName": ""
    },
    company: [],
    companyIndex: 0,
    dept: [],
    deptIndex: 0,
    deptChild: [],
    deptChildIndex: 0,
    showChild: true
  },
  handleInput(e) {
    let val = e.currentTarget.dataset.name
    this.setData({
      [val]: e.detail.value
    })
  },
  bindCompanyChange(e) { //公司
    
    this.data.deptIndex = 0
    this.data.dept = this.data.company[e.detail.value].deptList
    console.log(this.data.dept)
    this.data.postData.deptId = this.data.dept[this.data.deptIndex].deptId
    this.setData({
      companyIndex: e.detail.value,
      dept: this.data.dept,
      postData: this.data.postData,
      deptIndex: this.data.deptIndex
    })
  },
  bindDeptChange(e) {//一级部门
    
    this.data.deptChild = this.data.dept[e.detail.value].deptList  
    this.data.postData.deptId = this.data.dept[e.detail.value].deptId  
    this.setData({
      deptIndex: e.detail.value,
      deptChild: this.data.deptChild,
      postData: this.data.postData
    })
    if(this.data.dept[e.detail.value].deptList.length > 0) {      
      this.data.deptChildIndex = 0
      this.data.postData.deptId = this.data.deptChild[this.data.deptChildIndex].deptId
      this.setData({        
        showChild: false,
        postData: this.data.postData,
        deptChildIndex: this.data.deptChildIndex
      })
    }
  },
  bindDeptChildChange(e) {//二级部门
    this.data.postData.deptId = this.data.deptChild[e.detail.value].deptId
    this.setData({
      deptChildIndex: e.detail.value,
      postData: this.data.postData
    })
  },
  submit() {
    console.log(this.data.postData)
    var data = this.data.postData
    if(data.userName !== '' && data.email !== '' && data.phone !== '' && data.deptId !== '' ) {
      fetch.postReq('user/register', data, (res) => {
        wx.showToast({
          title: res.message,
          duration: 1500
        }) 
        setTimeout(() => {
          wx.redirectTo({
            url: '../itPersonInfo/itPersonInfo',
          })
        }, 1000)  
      })
    }else {      
      wx.showToast({
        title: '请填写必填项！',
        icon: 'none',
        duration: 1500
      })   
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openId = wx.getStorageSync('openid')
    this.data.postData.openId = openId
    //获取部门列表
    fetch.postReq('dept/list', {
      openId: openId
    }, (res) => {
      console.log(res)
      this.data.postData.deptId = res.data[0].deptList[0].deptId
      this.setData({
        postData: this.data.postData,
        company: res.data,
        dept: res.data[0].deptList
      })
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