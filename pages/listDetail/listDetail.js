// pages/agentConstruct/agentConstruct.js
var fetch = require('../../utils/fetch');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideButtons: [],
    dataList: [],
    status: '',
    userRole: '',
    isVison: false,
    normalSrc: '/assets/icon/star.png',
    selectedSrc: '/assets/icon/star2.png',
    stars: [1, 2, 3, 4, 5],
    key: 1, //评分
    id: '',
    comment: '',
    hidden: true,
    loadingData: false,
    pageNo: 1,
    total: null,
    satisfaction: 20,
    basicsList: [{
      icon: 'roundclosefill',
      name: '不满意'
    }, {
      icon: 'favorfill',
      name: '一般'
    }, {
      icon: 'emojifill',
      name: '满意'
    }, {
      icon: 'emojiflashfill',
      name: '十分满意'
    },],
    basics: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const userRole = wx.getStorageSync("userRole");
    this.setData({
      status: option.status,
      userRole: userRole
    });
    wx.setNavigationBarTitle({
      title: option.status
    })
    this.getListCount(this.data.pageNo);
    this.setData({
      slideButtons: [{
        text: '普通',
        src: '/page/weui/cell/icon_love.svg', // icon的路径
      },
      {
        type: 'warn',
        text: '删除',
        extClass: 'test',
        src: '/page/weui/cell/icon_del.svg', // icon的路径
      }],
    });
  },
  // 评论
  numSteps(e) {
    const basics = e.currentTarget.dataset.id;
    console.log(basics);
    this.setData({
      basics
    })
  },
  // 获取评论内容
  getComment(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 滑块的值
  sliderchange(e) {
    this.setData({
      satisfaction: e.detail.value
    })
    console.log('滑块的值' + e.detail.value)
  },
  // 评价
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      key
    })
  },

  //获取工单详情
  getListCount(pageNo) {
    const userRole = wx.getStorageSync("userRole");
    const openId = wx.getStorageSync("openid");
    const cardType = this.data.status;
    fetch.postReq('card/list', {
      userRole, openId, cardType, pageNo
    }, (res) => {
      console.log(res);
      if (pageNo === 1) {
        this.setData({
          dataList: res.data.cardList,
          pageNo: pageNo,
          total: res.data.totalCount,
          hidden: true,
          loadingData: false
        });
      } else {
        const newList = this.data.dataList.concat(res.data.cardList);
        console.log(newList);
        this.setData({
          dataList: newList,
          pageNo: pageNo,
          hidden: true,
          loadingData: false
        });
        wx.stopPullDownRefresh();
      }
      wx.hideLoading();
    })
  },


  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  },
  // d点击列表进入详情
  detail(e) {
    const id = e.currentTarget.dataset.id;
    const userRole = wx.getStorageSync("userRole");
    if (userRole === '普通用户') {
      if (this.data.status === '已处理') {
        this.setData({
          isVison: true,
          id
        })
      } else {
        wx.navigateTo({
          url: `../detail/detail?id=${id}&status=${this.data.status}`,
        })
      }

    } else if (userRole === '话务员') {
      if (this.data.status === '已创建') {

      } else {
        wx.navigateTo({
          url: `../detail/detail?id=${id}&status=${this.data.status}`,
        })
      }
    } else {
      wx.navigateTo({
        url: `../detail/detail?id=${id}&status=${this.data.status}`,
      })
    }
  },
  // 提交评价
  submitPj() {
    const openId = wx.getStorageSync("openid");
    const cardId = this.data.id;
    // const satisfaction = this.data.key;
    const satisfaction =this.data.basics+2;
    // const satisfaction = this.data.satisfaction;
    const comment = this.data.comment;
    const data = {
      openId, cardId, satisfaction, comment
    }
    console.log(data);
    fetch.postReq('card/comment', data, (res) => {
      console.log(res);
      if (res.code === 200) {
        this.setData({
          basics: 2,
          isVison: false
        })
        wx.showToast({
          title: res.message,
          icon: 'succes',
          duration: 1000
        });
        wx.reLaunch({
          url: '../itPersonInfo/itPersonInfo',
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1000
        })
      }

    })
  },
  // 关闭评价弹窗
  colsePj() {
    this.setData({
      basics: 2,
      isVison: false,
      comment: ''
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
    this.getListCount(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var hidden = this.data.hidden,
      loadingData = this.data.loadingData,
      that = this;
    if (hidden) {
      this.setData({
        hidden: false
      });
      console.info(this.data.hidden);
    }
    if (loadingData) {
      return;
    }
    const total = this.data.total;
    const totalPage = Math.ceil(total / 10);
    let pageNo = this.data.pageNo;
    if (pageNo < totalPage) {
      this.getListCount(pageNo + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})