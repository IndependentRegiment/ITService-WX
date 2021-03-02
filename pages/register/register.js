var util = require('../../utils/util.js');
// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endContent: { "UserName": "", "UserId": "", "CompanyID": "低压智能电器研究院", "Department": "", "Temperature": "", "Remark": "", "WorkType": "居家办公", "Province":"","City":"", "CountDate": "", "OpenId": ""},
    isShowContent: { "UserName": "", "UserId": "", "Department": "", "CompanyID": "低压智能电器研究院","WorkType": "居家办公"},
    select: false,
    selectCompany: false,
    selectWorkType: false,
    depart: '',
    selectList: ["技术平台部", "财务部", "核心工艺部", "人事行政部"],
    company: '低压智能电器研究院',
    companyID: 2,
    companyList: ['低压智能电器研究院', '诺雅克', '股份', '中国区销售','总经办','其他'],
    workType: '在岗办公',
    workTypeList: ['居家办公', '在岗办公'],
    disabled: '',
    disable: '',
  },
  //下拉
  bindPickerChange: function (e) {
    this.setData({
      company:  this.data.companyList[Number(e.detail.value)]
    })
    this.getCompanyID(this.data.companyList[Number(e.detail.value)]);
  },
  bindPickerChange2: function (e) {
    this.setData({
      depart:  this.data.selectList[Number(e.detail.value)]
    })
  },
  //获取各个值
  getUserName: function (e) {
    this.data.endContent.UserName = e.detail.value
  }, 
  getUserId: function (e) {
    this.data.endContent.UserId = e.detail.value
  },
  getTemperature: function (e) {
    this.data.endContent.Temperature = e.detail.value
    wx.setStorageSync('temperature', e.detail.value)
  },
  getRemark: function (e) {
    this.data.endContent.Remark = e.detail.value
  },
  submit: function () {
    this.setData({
      endContent: this.data.endContent
    })
    if (this.data.endContent.UserName == "" || this.data.endContent.Department == "" || this.data.endContent.Temperature == "" || this.data.endContent.WorkType == "" ){
      if (this.data.endContent.UserName == "") {
        wx.showToast({
          title: '姓名不能为空！'
        })
      } else if (this.data.endContent.Department == "") {
        wx.showToast({
          title: '部门不能为空！'
        })
      } else if (this.data.endContent.Temperature == '') {
        wx.showToast({
          title: '体温不能为空！'
        })
      }else{
        wx.showToast({
          title: '办公方式不能为空！'
        })
      }
    }else{
      this.setData({
        disable: 'disabled'
      })

      var that = this
      wx.request({
        url: 'https://wxapplet.chint-eletech.com:8081/api/WxBind/ReBind',
        method: 'POST',
        data: { "openid": that.data.endContent.OpenId, "UserName": that.data.endContent.UserName, "Authentication": that.data.endContent.CountDate, "Department": that.data.endContent.Department, "Remark": that.data.endContent.Remark, "Company": that.data.endContent.CompanyID, "UserId": that.data.endContent.UserId },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if ( res.data ==true ){
            console.log(res.data)
          }
        }
      })
      console.log(this.data.endContent.OpenId)
      wx.request({
        url: 'https://wxapplet.chint-eletech.com:8081/api/WxBind/IsBindWx/' + this.data.endContent.OpenId,
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data == '请绑定微信') {
            wx.request({
              url: 'https://wxapplet.chint-eletech.com:8081/api/WxBind/Bind',
              method: 'POST',
              data: {
                "openid": that.data.endContent.OpenId, "UserName": that.data.endContent.UserName, "Authentication": that.data.endContent.CountDate, "Department": that.data.endContent.Department, "Remark": that.data.endContent.Remark, "Company": that.data.endContent.CompanyID, "UserId": that.data.endContent.UserId, "infos": [{ "openid": that.data.endContent.OpenId, "CountDate": that.data.endContent.CountDate, "UserName": that.data.endContent.UserName, "Temperature": that.data.endContent.Temperature, "Province": that.data.endContent.Province, "City": that.data.endContent.City, "Remark": that.data.endContent.Remark }]
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                // console.log(2)
                if (res.data == true) {
                  wx.showToast({
                    title: '提交成功！',
                  })
                  wx.redirectTo({
                    url: '../result/result',
                  })
                } 
              }
            })
          }else {
            wx.request({
              url: 'https://wxapplet.chint-eletech.com:8081/api/RecordInfo/Record',
              method: 'POST',
              data: { "openid": that.data.endContent.OpenId, "UserName": that.data.endContent.UserName, "CountDate": that.data.endContent.CountDate, "Temperature": that.data.endContent.Temperature, "Remark": that.data.endContent.Remark, "Province": that.data.endContent.Province, "City": that.data.endContent.City },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                //console.log(res)
                if (res.data == true) {
                  wx.showToast({
                    title: '提交成功！',
                  })
                  wx.redirectTo({
                    url: '../result/result',
                  })
                } else { 
                  wx.showToast({
                    title: '上下午各两次！',
                  })
                }
              }
            })
          }
        }
      })
    }
    console.log(this.data.endContent)
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select,
      disabled: 'true'
    })
  },
  bindShowWorkType() {
    this.setData({
      selectWorkType: !this.data.selectWorkType,
      disabled: 'true'
    })
  },
  getWorkType(e) {
    var name = e.currentTarget.dataset.name
    this.data.endContent.WorkType = name
    this.setData({
      workType: name,
      selectWorkType: false,
      disabled: ''
    })
  },
  getCompanyID(value) {
    var name = value
    this.data.endContent.CompanyID = name
    this.setData({
      company: name,
      selectCompany: false,
      disabled: ''
    })
    if ( name == '低压智能电器研究院') {
      this.data.companyID = 2
      this.data.company = '低压智能电器研究院'
      this.setData({
        company: this.data.company
      })
    } else if (name == '股份') {
      this.data.companyID = 46
      this.data.company = '股份'
      this.setData({
        company: this.data.company
      })
    } else if (name == '中国区销售') {
      this.data.companyID = 4
      this.data.company = '中国区销售'
      this.setData({
        company: this.data.company
      })
    } else if (name == '其他') {
        this.data.companyID = 5
      this.data.company = '其他'
        this.setData({
          company: this.data.company
        })
    } else if (name == '总经办') {
      this.data.companyID = 0
      this.data.company = '总经办'
      this.setData({
        company: this.data.company
      })
    } else {
      this.data.companyID = 1
      this.data.company = '诺雅克'
      this.setData({
        company: this.data.company
      })
    }
    var that = this
    wx.request({
      url: 'https://wxapplet.chint-eletech.com:8081/api/Org/GetOrgList?Parentid=' + this.data.companyID,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        var resData = res.data
        var departList = []
        for (var i = 0; i < resData.length; i++) {
          departList.push(resData[i].DeptName)
        }
        that.data.selectList = departList
        that.data.depart = departList[0]
        that.setData({
          selectList: that.data.selectList,
          depart: that.data.depart
        })
        that.data.endContent.Department = that.data.depart
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.endContent.OpenId = wx.getStorageSync('openid')
    this.data.endContent.CountDate = util.formatTime(new Date())
    this.setData({
      endContent: this.data.endContent
    })
    var that = this
    var openIdList = wx.getStorageSync("openIdList")
    
    var province = wx.getStorageSync("province")
    var city = wx.getStorageSync("city")
    this.data.endContent.Province = province
    this.data.endContent.City = city
    console.log(openIdList)
    console.log(this.data.endContent.OpenId)
    wx.request({
      url: 'https://wxapplet.chint-eletech.com:8081/api/WxBind/IsBindWx/' + this.data.endContent.OpenId,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data != '请绑定微信') {
          console.log(res.data)
          console.log(that.data.endContent.CountDate)
          that.data.isShowContent.UserName = res.data.UserName
          that.data.isShowContent.UserId = res.data.UserId
          that.data.isShowContent.Department = res.data.Department
          that.data.isShowContent.CompanyID = res.data.Company
          console.log(res.data.Company)
          if (res.data.Company == '低压智能电器研究院' ){
            console.log(res.data.Company)
            that.data.companyID = 2
            that.data.company = '低压智能电器研究院'
          } else if (res.data.Company == '电子组件板制造部'){
            that.data.companyID = 3
            that.data.company = '电子组件板制造部'
          } else if (res.data.Company == '中国区销售') {
            that.data.companyID = 4
            that.data.company = '中国区销售'
          } else if (res.data.Company == '其他') {
            that.data.companyID = 5
            that.data.company = '其他'
          }else if (res.data.Company == '总经办') {
            that.data.companyID = 0
            that.data.company = '总经办'
          } else{
            that.data.companyID = 1
            that.data.company = '诺雅克'
          }
          that.setData({
            company: that.data.company
          })
          that.data.endContent.UserName = res.data.UserName
          that.data.endContent.CompanyID = res.data.Company
          that.data.endContent.CountDate = that.data.endContent.CountDate
          that.data.endContent.UserId = res.data.UserId
          that.data.endContent.Department = res.data.Department
          that.data.depart = res.data.Department
          that.setData({
            depart: that.data.depart
          })
          that.setData({
            isShowContent: that.data.isShowContent
          })
          that.setData({
            endContent: that.data.endContent
          })
        } 
      }
    })
    
    // for (var i = 0; i < openIdList.length;i++ ){
    //   console.log(this.data.endContent.OpenId == openIdList[i].OpenId)
    //   if (openIdList[i].OpenId == this.data.endContent.OpenId) {
    //     console.log(openIdList[i])
    //     this.data.isShowContent.UserName = openIdList[i].Username
    //     this.data.isShowContent.UserId = openIdList[i].UserId
    //     this.data.isShowContent.Department = openIdList[i].Department
    //     this.data.endContent.UserName = openIdList[i].Username
    //     this.data.endContent.UserId = openIdList[i].UserId
    //     this.data.endContent.Department = openIdList[i].Department
    //     this.data.depart = openIdList[i].Department
    //     this.setData({
    //       depart: this.data.depart
    //     })
        
    //     console.log(this.data.isShowContent)
    //   }
    // } 
    wx.request({
      url: 'https://wxapplet.chint-eletech.com:8081/api/Org/GetOrgList?Parentid=' + this.data.companyID,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var resData=res.data
        var departList = []
        for (var i = 0; i < resData.length;i++) {
          departList.push(resData[i].DeptName)
        }
        that.data.selectList=departList
        that.setData({
          selectList: that.data.selectList
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

