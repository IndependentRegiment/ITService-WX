// pages/create/create.js
var fetch = require('../../utils/fetch.js');
var util = require('../../utils/util.js');
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {
      'openId': '',
      'priority': '1',
      'problemType': '1',
      'userName': '',
      'deptId': '1',
      'phone': '',
      'description': '',
      'deal': '',
      'appointmentCreate': '',
      'appointmentEnd': ''
    },
    show: false,
    typeList: [],
    index: 0,
    deptList: [],
    errorType: '',
    deptIndex: 0,
    department: '',
    stars: [0, 1, 2],
    normalSrc: '/assets/icon/star.png',
    selectedSrc: '/assets/icon/star2.png',
    // halfSrc: '/assets/tabs/profile.png',
    key: 1, //评分
    time: '',
    multiArray: [],
    multiIndex: [0, 0],
    multiArray1: [],
    multiIndex1: [0, 0],
    role: '',
    showType: true,
    length: 0,
    nameList: [],
    nameIndex: 0,
    name: '',
    /////////
    time: '',
    timeEnd: '',
    showTime: false

  },

  bindNameChange: function (e) {
    var typeObj = this.data.nameList[e.detail.value];
    this.data.resData.deal = typeObj.openId
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
  count(e) {
    let length = e.detail.value.length
    this.data.resData.description = e.detail.value
    this.setData({
      length: length,
      resData: this.data.resData
    })
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
    if(this.data.multiArray[1][x].typeId === 1) {
      this.setData({
        showTime: false
      })
    }else {
      this.setData({
        showTime: true
      })
    }
    this.setData({
      multiArray: data.multiArray,
      multiIndex: data.multiIndex,
      resData: this.data.resData
    })
    console.log(this.data.resData)
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value,
      showType: false
    })
  },
  bindMultiPickerColumnChange1: function (e) {
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1
    };
    data.multiIndex1[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      //父菜单
      case 0:
        data.multiIndex1[1] = 0
        data.multiArray1[1] = this.data.multiArray1[0][e.detail.value].deptList;

        break;
        //子菜单
      case 1:
        this.data.resData.deptId = data.multiArray1[1][e.detail.value].deptName;
        break;
    }
    var x = this.data.multiIndex1[1]
    this.data.resData.deptId = this.data.multiArray1[1][x].deptId
    console.log(this.data.resData.deptId)
    this.setData({
      multiArray1: data.multiArray1,
      multiIndex1: data.multiIndex1,
      resData: this.data.resData
    })
  },
  bindMultiPickerChange1: function (e) {
    console.log(e.detail.value[1])
    console.log(
      this.data.multiArray1[0][e.detail.value[0]],
      this.data.multiArray1[1][e.detail.value[1]]
    );
    this.setData({
      multiIndex1: e.detail.value
    })
  },
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.data.resData.priority = key
    this.setData({
      resData: this.data.resData,
      key: key
    })
  },
  handleInput(e) {
    let val = e.currentTarget.dataset.name
    this.setData({
      [val]: e.detail.value
    })
  },
  getScore(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    switch (index) {
      case 0: // 创建
        this.data.resData.priority = '1'
        break;
      case 1:
        this.data.resData.priority = '2'
        break;
      case 2:
        this.data.resData.priority = '3'
        break;
        break;
    }
    this.setData({
      resData: this.data.resData,
      selectNum: index
    })
  },
  bindTypeChange: function (e) {
    var typeObj = this.data.typeList[e.detail.value];
    this.data.resData.problemType = typeObj.typeId
    this.data.errorType = typeObj.typeName
    this.setData({
      index: e.detail.value,
      resData: this.data.resData,
      errorType: typeObj.typeName
    })
    console.log(this.data.resData.problemType)
  },
  bindDeptChange: function (e) {
    var typeObj = this.data.deptList[e.detail.value];
    this.data.resData.deptId = typeObj.deptId
    this.data.department = typeObj.deptName
    this.setData({
      deptIndex: e.detail.value,
      resData: this.data.resData,
      department: typeObj.deptName
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value.slice(0,2), e.detail.value.slice(3,5))    
    this.data.resData.appointmentCreate = e.detail.value
    var h = e.detail.value.slice(0,2)
    var m = e.detail.value.slice(3,5)
    console.log(h,m)
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
  dingyue() {
    wx.requestSubscribeMessage({
      tmplIds: ['djUO_W_b_hm2yMT7-VHlt1hkQGmDdcOM0iOXUXN5SHY'
        , 'Veu_p4T8OH54zqjXWllvNrveWEnpIbHlz2HI9MePPfM',], //测试
      success(res) {
        console.log(res)
        // var openId = wx.getStorageSync('openid')
        // fetch.postReq('card/send', {
        //   openId: openId
        // }, (res) => {
        //   console.log(res)
        // })
      }
    })
  },
  auth() {
    wx.requestSubscribeMessage({
      tmplIds: [
        'djUO_W_b_hm2yMT7-VHltySXkzVvK-pWJHeuKUnevgc', 'Veu_p4T8OH54zqjXWllvNrveWEnpIbHlz2HI9MePPfM'], //测试
      success: (res) => {
        console.log(res)
        var openId = wx.getStorageSync('openid')
        fetch.postReq('card/send', {
          openId: openId
        }, (res) => {
          console.log(res)
        })
      }
    })
  },
  submit() {    
    let openId = wx.getStorageSync('openid')
    this.data.resData.openId = openId
    this.setData({
      resData: this.data.resData
    })
    console.log(this.data.resData)
    if (this.data.role === '普通用户') {
      if(this.data.resData.phone !== ''){
        this.auth()   
        fetch.postReq('card/create', this.data.resData, (res) => {
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
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        wx.showToast({
          title: '手机号不能为空！',
          icon: 'none',
          duration: 1000
        })
      }
      
    } else if (this.data.resData.userName !== '' && this.data.resData.phone !== '') {
      this.auth()   
      fetch.postReq('card/create', this.data.resData, (res) => {
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
            icon: 'none',
            duration: 1000
          })
        }
      })

    } else {
      wx.showToast({
        title: '请填写必填项！',
        duration: 1000
      })
    }


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
      hEnd = Number(h) + 1
      minuteIndexEnd = 0 + '0'
    } else if (m > 30 && m <= 40) {
      minuteIndex = 40;
      hEnd = Number(h) + 1
      minuteIndexEnd = minuteIndex + 30 - 60
    } else if (m > 40 && m <= 50) {
      minuteIndex = 50;
      minuteIndexEnd = minuteIndex + 30 - 60
      hEnd = Number(h) + 1
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var h = date.getHours()
    var m = date.getMinutes()
    var timeobj = this.loadTime(h, m)
    var time = timeobj.h + ':' + timeobj.minuteIndex
    var timeEnd = timeobj.hEnd + ':' + timeobj.minuteIndexEnd
    this.data.resData.appointmentCreate = time
    this.data.resData.appointmentEnd = timeEnd
    this.setData({
      time: time,
      timeEnd: timeEnd,
      resData: this.data.resData
    })
    //获取角色权限wx.getStorageSync('userRole') 
    let userRole = wx.getStorageSync('userRole')
    // let userRole = '普通用户'
    this.setData({
      role: userRole
    })

    // console.log(userRole)
    if (userRole === '普通用户') {
      this.setData({
        show: true
      })
    }
    //工程师列表
    let openId = wx.getStorageSync('openid')
    //   //获取协办人列表
    let ID = this.data.resData.problemType
    fetch.postReq('card/assist/list', {
      openId: openId,
      problemType: ID
    }, (res) => {
      console.log(res)
      this.setData({
        nameList: res.data
      })
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
    //获取部门列表
    fetch.postReq('dept/list', {
      openId: openId
    }, (res) => {
      console.log(res)
      this.data.multiArray1 = [
        [...res.data],
        [...res.data[0].deptList]
      ];
      this.setData({
        deptList: res.data,
        multiArray1: this.data.multiArray1
      })
    })
    //获取手机号
    fetch.postReq('user/phone', {
      openId: openId
    }, (res) => {
      console.log(res)
      this.data.resData.phone = res.data.mobilePhone
      this.setData({
        resData: this.data.resData
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