// pages/detail/detail.js
var fetch = require('../../utils/fetch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasDone: true,
    resData: {
      'openId': '',
      'problemType': '',
      'cardId': '',
      'reason': '',
      'solution': '',
      'assist': '',
      'appointmentCreate': '',
      'appointmentEnd': '',
      'wayId': '1'
    },
    description: '',
    info: {
      'applyName': '',
      'deptName': '',
      'phone': '',
      'problemType': '',
      'wayId': ''
    },
    show: true,
    telHelp: true,
    typeList: [],
    index: 0,
    nameList: [],
    nameIndex: 0,
    name: '',
    stars: [0, 1, 2],
    normalSrc: '/assets/icon/star.png',
    selectedSrc: '/assets/icon/star2.png',
    // halfSrc: '/assets/tabs/profile.png',
    key: 3, //评分
    store: 1,
    showStatus: true,
    showStore: true,
    status: '',
    show: true,
    comment: '',
    doneStore: true,
    allData: [],
    dealHidden: false,
    dealBtn: true,
    multiArray: [],
    multiIndex: [0, 0],
    canChange: true,
    problemType: '',
    processNode: '',
    showType: false,
    mobilPhone: '',
    deptName: '',
    //对话框
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    error: '',
    showerror: false,
    items: [{
        value: '2',
        name: '现场服务',
      },
      {
        value: '1',
        name: '远程服务',
        checked: 'true'
      },
    ],
    time: '',
    timeEnd: '',
    showTime: false
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value.slice(0, 2), e.detail.value.slice(3, 5))
    this.data.resData.appointmentCreate = e.detail.value
    var h = e.detail.value.slice(0, 2)
    var m = e.detail.value.slice(3, 5)
    var timeobj = this.loadTime(h, m)
    var timeEnd = timeobj.hEnd + ':' + timeobj.minuteIndexEnd
    console.log(timeEnd)
    this.data.resData.appointmentEnd = timeEnd
    this.setData({
      time: e.detail.value,
      timeEnd: timeEnd,
      resData: this.data.resData,
    })
  },
  bindTimeChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.resData.appointmentEnd = e.detail.value
    this.setData({
      timeEnd: e.detail.value,
      resData: this.data.resData
    })
  },
  loadTime(h, m) {
    var minuteIndex
    var minuteIndexEnd
    var hEnd
    console.log(m)
    if (m > 0 && m <= 10) {
      minuteIndex = 10;
      hEnd = h
      minuteIndexEnd = minuteIndex + 30
    } else if (m > 10 && m <= 20) {
      minuteIndex = 20;
      hEnd = h
      minuteIndexEnd = minuteIndex + 30
    } else if (m > 20 && m <= 30) {
      minuteIndex = 30;
      hEnd = h + 1
      minuteIndexEnd = 0 + '0'
    } else if (m > 30 && m <= 40) {
      minuteIndex = 40;
      hEnd = h + 1
      minuteIndexEnd = minuteIndex + 30 - 60
    } else if (m > 40 && m <= 50) {
      minuteIndex = 50;
      minuteIndexEnd = minuteIndex + 30 - 60
      hEnd = h + 1
    } else {
      minuteIndex = 0 + '0';
      h = Number(h) + 1
      hEnd = h
      minuteIndexEnd = 30
    }
    return {
      minuteIndex: minuteIndex,
      minuteIndexEnd: minuteIndexEnd,
      h: h,
      hEnd: hEnd
    }
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.data.resData.wayId = e.detail.value
    this.setData({
      items,
      resData: this.data.resData
    })
  },
  dial() {
    let phone = this.data.mobilPhone
    if (phone !== '') {
      // this.openConfirm()
      let phone = this.data.mobilPhone
      wx.makePhoneCall({
        phoneNumber: phone
      })
    } else {
      wx.showToast({
        title: '号码为空！',
        icon: 'none',
        duration: 1000
      })
    }

  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      //父菜单
      case 0:
        data.multiArray[1] = this.data.multiArray[0][e.detail.value].problemList;
        data.multiIndex[1] = 0
        break;
        //子菜单
      case 1:
        this.data.resData.problemType = data.multiArray[1][e.detail.value].typeName;
        break;
    }
    var x = this.data.multiIndex[1]
    console.log(this.data.multiArray[1][x].typeId)
    this.data.resData.problemType = this.data.multiArray[1][x].typeId
    this.setData({
      multiArray: data.multiArray,
      multiIndex: data.multiIndex,
      resData: this.data.resData,
      showType: true,
    })
    console.log(this.data.resData)
  },
  bindMultiPickerChange: function (e) {
    console.log(e)
    console.log(
      this.data.multiArray[0][e.detail.value[0]],
      this.data.multiArray[1][e.detail.value[1]]
    );
    console.log(this.data.showType)
    this.setData({

      multiIndex: e.detail.value
    })
    console.log(this.data.showType)

  },
  // selectRight: function (e) {
  //   var store = e.currentTarget.dataset.key
  //   console.log("紧急度" + store)
  //   this.data.resData.priority = store
  //   this.setData({
  //     resData: this.data.resData,
  //     store: store
  //   })
  // },
  // bindTypeChange: function (e) {
  //   var typeObj = this.data.typeList[e.detail.value];
  //   this.data.resData.problemType = typeObj.typeId
  //   this.data.info.problemType = typeObj.typeName
  //   this.setData({
  //     index: e.detail.value,
  //     resData: this.data.resData,

  //     info: this.data.info
  //   })
  //   console.log(this.data.resData.problemType)
  // },
  handleInput(e) {
    let val = e.currentTarget.dataset.name
    this.setData({
      [val]: e.detail.value
    })
  },
  bindNameChange: function (e) {
    var typeObj = this.data.nameList[e.detail.value];
    this.data.resData.assist = typeObj.openId
    this.data.name = typeObj.userName
    this.setData({
      nameIndex: e.detail.value,
      resData: this.data.resData,
      name: typeObj.userName
    })
    if (this.data.resData.assist !== '') {
      this.setData({
        dealBtn: false
      })
    }
    console.log(this.data.resData)
  },
  deal() {
    fetch.postReq('card/deal', this.data.resData, (res) => {
      console.log(res)
      if (res.code === 200) {
        wx.showToast({
          title: '提交成功！',
          duration: 1000
        })
        setTimeout(function () {
          wx.reLaunch({
            url: '../itPersonInfo/itPersonInfo',
          })
        }, 1000)

      } else {
        wx.showToast({
          title: '提交失败！',
          // icon: 'none',
          duration: 1000
        })
      }
    })
  },
  submit() {
    console.log(this.data.resData)
    if (this.data.resData.reason !== '' && this.data.resData.solution !== '' && this.data.resData.reason !== null && this.data.resData.solution !== null) {
      fetch.postReq('card/update', this.data.resData, (res) => {
        console.log(res)
        if (res.code === 200) {
          wx.showToast({
            title: res.message,
            duration: 1000
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../itPersonInfo/itPersonInfo',
            })
          }, 1000)

        } else {
          wx.showToast({
            title: res.message,
            // icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请填写必填项！',
        // icon: 'none',
        duration: 1000
      })
    }
  },
  getName(ID) {
    let openId = wx.getStorageSync('openid')
    //获取协办人列表
    fetch.postReq('card/assist/list', {
      openId: openId,
      problemType: ID
    }, (res) => {
      this.setData({
        nameList: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取状态
    let status = options.status
    // let status = '待评价'
    console.log(status)
    if (status === '已处理') {
      this.setData({
        hasDone: true,
        canChange: false

      })
      let userRole = wx.getStorageSync('userRole')
      switch (userRole) {
        case '普通用户': // 创建  
          this.setData({
            showStatus: false
          })
          break;
        case '话务员':
          this.setData({
            telHelp: false,
            showStatus: true
          })
          break;
        case '工程师':
          this.setData({
            show: false,
            doneStore: true,
            canChange: false
          })
          break;
          break;
      }
    } else if (status === '已创建') {
      let userRole = wx.getStorageSync('userRole')
      switch (userRole) {
        case '普通用户': // 创建  
          this.setData({
            showStatus: false
          })
          break;
        case '话务员': // 创建  
          this.setData({
            telHelp: false,
            canChange: false
          })
          break;
          break;
      }
    } else if (status === '已评价') {
      this.setData({
        hasDone: true,
        doneStore: false,
        showStore: false,
        canChange: false
      })
    } else if (status === '处理中') {
      console.log(this.data.resData)
      this.setData({
        hasDone: false,
        show: false,
        dealHidden: true,
        canChange: false
      })
    } else if (status === '协办中') {
      this.setData({
        hasDone: false,
        show: false,
        dealHidden: true,
        canChange: false
      })
    } else {
      this.setData({
        hasDone: false,
      })
      let userRole = wx.getStorageSync('userRole')
      // let userRole = '工程师'
      switch (userRole) {
        case '普通': // 创建  
          this.setData({
            showStatus: false,
            canChange: false
          })
          break;
        case '话务员':
          this.setData({
            telHelp: false,
            showStatus: true,
            canChange: false
          })
          break;
        case '工程师':
          this.setData({
            show: false,
            canChange: false
          })
          break;
          break;
      }
    }

    //获取工单id
    let id = options.id
    this.data.resData.cardId = id
    //获取详情信息
    let openId = wx.getStorageSync('openid')
    this.data.resData.openId = openId
    this.setData({
      resData: this.data.resData
    })
    console.log(this.data.resData)
    fetch.postReq('card/detail', {
      openId: openId,
      cardId: id
    }, (res) => {
      console.log(res)
      this.data.resData.problemType = res.data.problemId
      this.data.resData.reason = res.data.reason
      this.data.resData.solution = res.data.solution
      this.data.resData.assist = res.data.assistName
      this.data.info.applyName = res.data.applyName
      this.data.info.deptName = res.data.deptName
      this.data.info.phone = res.data.phone
      if (res.data.dealWay !== null) {
        this.data.info.wayId = res.data.dealWay
      } else {
        this.data.info.wayId = ''
      }

      this.data.info.problemType = res.data.problemType
      if (res.data.appointmentCreate !== null && res.data.appointmentEnd !== null) {
        this.data.resData.appointmentCreate = res.data.appointmentCreate.slice(0, 16)
        this.data.resData.appointmentEnd = res.data.appointmentEnd.slice(0, 16)
        this.data.time = res.data.appointmentCreate.slice(10, 16)
        this.data.timeEnd =  res.data.appointmentEnd.slice(10, 16)
      }

      this.setData({
        info: this.data.info,
        status: res.data.status,
        resData: this.data.resData,
        key: res.data.priority,
        store: res.data.satisfaction,
        comment: res.data.comment,
        allData: res.data,
        description: res.data.description,
        problemType: res.data.problemType,
        processNode: res.data.processNode,
        mobilPhone: res.data.mobliePhone,
        deptName: res.data.deptName,
        time: this.data.time,
        timeEnd: this.data.timeEnd
      })
      console.log(this.data.resData)
      this.getName(res.data.problemId)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let openId = wx.getStorageSync('openid')
    //获取故障类型
    fetch.postReq('card/problem/list', {
      openId: openId
    }, (res) => {
      console.log(res)
      this.data.multiArray = [
        [...res.data],
        [...res.data[0].problemList]
      ];
      this.setData({
        typeList: res.data,
        multiArray: this.data.multiArray
      })
    })

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