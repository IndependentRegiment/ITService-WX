// pages/health/health.js
const baseUrl = 'https://wxapplet.chint-eletech.com:8081';
// const baseUrl = 'https://blog.shenjq.top';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面提示信息
    isHidden: false,
    commitData: {
      OpenID: '',
      Name: '',
      EmpNum: '',
      Tel: '',
      Company: '总经办',
      Department: '总经办',
      IsLeave: true,
      LeaveDate: '2021-01-14',
      ReturnDate: '2021-01-14',
      AcidTestDate: '2021-02-17',
      Address: '',
      AddressReserved: '',
      Section: '',
      Transportation: '',
      LeaveReason: '',
      DeptLeader: '',
      NeedacidTest: true,
    },
    companyList: [],
    partList: [],
    multiArray: [],
    multiIndex: [0, 0],
    // 省市
    region1: ['', '', ''],
    region2: ['', '', ''],
    region3: ['', '', ''],
    customItem: '全部',
    // 交通工具
    trans: [],
    transArr: [],
    // 检测报告
    jcbgUrl: [],
    xcmUrl: [],
    // 健康状况
    health: [],
    healthArr: [],
    // 出沪事由
    reason: [],
    reasonStr: [],
    // 后续每天填写

    // 是否是第一次创建
    isCreate: true,
    // 是否是2月5号后填写
    isEdit: false,
    isdayCreate: true,
    // 居家填写信息
    dayList: {
      OpenId: '',
      Address: '',
      HealthCondition: '',
      PlanComeBack: '2021-02-05',
      TouchHighRisk: false,
      TouchAcid: false,
    },
  },
  // 多选
  bindMultiPickerChange: function (e) {
    const arrIndex = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const commitData = this.data.commitData;
    commitData.Company = this.data.companyList[arrIndex[0]].DeptName;
    commitData.Department = this.data.partList[arrIndex[0]][arrIndex[1]].DeptName;
    // console.log(commitData);
    this.setData({
      multiIndex: e.detail.value,
      commitData
    })

  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log(data.multiArray)
    switch (e.detail.column) {
      //父菜单
      case 0:
        data.multiArray[1] = this.data.partList[e.detail.value];
        data.multiIndex[1] = 0
        break;
      //子菜单
      case 1:
        data.multiArray[1][data.multiIndex[1]].DeptName = data.multiArray[1][e.detail.value].DeptName;
        break;
    }
    this.setData(data);
  },
  // 单选
  radioChange(e) {
    const commitData = this.data.commitData;
    const name = e.target.dataset.name;
    let value = e.detail.value;
    console.log(name, value);
    if (value === 'true') {
      commitData[name] = true;
    } else {
      commitData[name] = false;
    }
    this.setData({
      commitData
    });
    // console.log(this.data.commitData)
  },
  // 居家隔离单选
  dayRadio(e) {
    const dayList = this.data.dayList;
    const name = e.target.dataset.name;
    let value = e.detail.value;
    console.log(name, value);
    if (value === 'true') {
      dayList[name] = true;
    } else {
      dayList[name] = false;
    }
    this.setData({
      dayList
    });
    console.log(dayList);
  },
  // 省市选择
  bindRegionChange: function (e) {
    const name = e.target.dataset.name;
    const value = e.detail.value;
    console.log(e)
    if (name === 'region1') {
      this.setData({
        region1: value
      })
    } else if (name === 'region2') {
      this.setData({
        region2: value
      })
    } else {
      this.setData({
        region3: value
      })
    }

  },
  // 多选框
  changeCheck(e) {
    const name = e.target.dataset.name;
    const value = e.detail.value.toString();
    if (name === 'reasonStr') {
      this.setData({
        reasonStr: value
      });
    } else {
      const commitData = this.data.commitData;
      commitData[name] = value;
      this.setData({
        commitData
      });
    }
  },
  // 居家隔离多选框
  dayCheck(e) {
    const name = e.target.dataset.name;
    const value = e.detail.value.toString();
    const dayList = this.data.dayList;
    dayList[name] = value;
    this.setData({
      dayList
    });
  },

  // 日期选择
  bindDateChange: function (e) {
    // console.log(e)
    const name = e.target.dataset.name;
    const value = e.detail.value;
    const commitData = this.data.commitData;
    commitData[name] = value;
    this.setData({
      commitData
    })
  },
  // 居家隔离-日期选择
  dayDateChange: function (e) {
    // console.log(e)
    const name = e.target.dataset.name;
    const value = e.detail.value;
    const dayList = this.data.dayList;
    dayList[name] = value;
    this.setData({
      dayList
    })
  },
  // 输入框
  bindReplaceInput(e) {
    const value = e.detail.value;
    const name = e.target.dataset.name;
    const commitData = this.data.commitData;
    commitData[name] = value;
    this.setData({
      commitData
    });
    // console.log(this.data.commitData);
  },
  // 居家隔离输入框
  dayInput(e) {
    const value = e.detail.value;
    const name = e.target.dataset.name;
    const dayList = this.data.dayList;
    dayList[name] = value;
    this.setData({
      dayList
    });
  },
  // 上传图片
  uploadImg(e) {
    // console.log(e);
    const OpenId = wx.getStorageSync('openid');
    const tag = e.currentTarget.dataset.tag;
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const imgUrl = res.tempFilePaths;
        if (tag == '0') {
          // 上传核酸检测报告
          if (res.tempFiles[0].size < 6144 * 1024) {
            this.uploadCon(imgUrl[0], {
              type: 0,
              OpenId
            });
            this.setData({
              jcbgUrl: imgUrl
            })
          } else {
            wx.showToast({
              title: '图片大小不得超过6M！请重新上传',
              icon: 'none'
            })
          }

        } else {
          // 上传行程码
          if (res.tempFiles[0].size < 6144 * 1024) {
            this.uploadCon(imgUrl[0], {
              type: 1,
              OpenId
            });
            this.setData({
              xcmUrl: imgUrl,
            })
          } else {
            wx.showToast({
              title: '图片大小不得超过6M！请重新上传',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  // 上传图片到服务器
  uploadCon(file, data) {
    wx.uploadFile({
      url: baseUrl + '/api/Upload',
      filePath: file,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: data,
      success: res => {
        //do something
        const commitData = this.data.commitData;
        let imgUrl = res.data;
        imgUrl = imgUrl.replace(/"/g, '');
        if (data.type === 0) {//检测报告
          commitData.AcidTestResult = imgUrl;
        } else {//行程码
          commitData.QRCodePath = imgUrl;
        }
        console.log(res.data, typeof res.data);
        console.log(commitData);
        this.setData({
          commitData
        })
        console.log(data, res);
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  // 初始化请求公司
  getCompanyList() {
    wx.request({
      url: 'https://wxapplet.chint-eletech.com:8081/api/Org/GetOrgList?Parentid=99',
      method: 'get',
      success: (res) => {
        // console.log(res);
        this.setData({
          companyList: res.data
        })
        const companyList = res.data;
        let partList = [];
        new Promise((resolve, reject) => {
          for (let i = 0; i < companyList.length; i++) {
            // 请求部门
            wx.request({
              url: 'https://wxapplet.chint-eletech.com:8081/api/Org/GetOrgList?Parentid=' + companyList[i].DeptID,
              method: 'get',
              success: (res) => {
                // console.log(res.data);
                partList[i] = res.data;
                this.setData({
                  partList
                })
                const multiArray = [];
                multiArray[0] = companyList;
                multiArray[1] = partList[0]
                this.setData({
                  multiArray
                })
                // console.log(multiArray);

              }
            })
          }
        });
        // 获取填写的个人信息并赋值
        this.getMessageInfo();
      }
    })
  },
  // 初始化请求交通工具、安全状况
  getTransHelth() {
    wx.request({
      url: baseUrl + '/api/Migrants/GetConfigList?tsparentId=3',//出行方式
      method: 'get',
      success: (res) => {
        // console.log(res.data)
        let trans = [];
        for (let i = 0; i < res.data.length; i++) {
          trans.push({ name: res.data[i].Description, value: res.data[i].Value })
        }
        this.setData({
          trans
        })
      }
    });
    wx.request({
      url: baseUrl + '/api/Migrants/GetConfigList?tsparentId=5',//健康状况
      method: 'get',
      success: (res) => {
        // console.log(res.data)
        let health = [];
        for (let i = 0; i < res.data.length; i++) {
          health.push({ name: res.data[i].Description, value: res.data[i].Value })
        }
        this.setData({
          health
        })
      }
    })
    wx.request({
      url: baseUrl + '/api/Migrants/GetConfigList?tsparentId=4',//出沪事由
      method: 'get',
      success: (res) => {
        // console.log(res.data)
        let reason = [];
        for (let i = 0; i < res.data.length; i++) {
          reason.push({ name: res.data[i].Description, value: res.data[i].Value })
        }
        this.setData({
          reason
        })
      }
    })
  },
  // 提交
  submitAll() {
    // 判断数据是否为空
    if (this.data.commitData.Name === '' || this.data.commitData.EmpNum === '' || this.data.commitData.Tel === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
    } else {
      const OpenId = wx.getStorageSync('openid');
      // console.log(OpenId);
      // 前往城市以及出沪事由赋值-----开始
      const commitData = this.data.commitData;
      let region1 = [];
      region1 = this.data.region1;
      region1.push(this.data.commitData.Address);
      const newre1 = region1.toString();
      commitData.Address = newre1;
      let region2 = [];
      region2 = this.data.region2;
      region2.push(this.data.commitData.AddressReserved);
      const newre2 = region2.toString();
      commitData.AddressReserved = newre2;
      let region3 = [];
      region3 = this.data.region3;
      region3.push(this.data.commitData.Section);
      const newre4 = region3.toString();
      commitData.Section = newre4;
      let reasonArr = [];
      reasonArr[1] = this.data.reasonStr;
      reasonArr[2] = this.data.commitData.LeaveReason;
      let newArr3 = reasonArr.toString();
      commitData.LeaveReason = newArr3;
      // 前往城市以及出沪事由赋值-----结束
      console.log(commitData);
      let url = '';
      if (this.data.isCreate) {
        url = baseUrl + '/api/Migrants/MigrantsCreate';
      } else {
        url = baseUrl + '/api/Migrants/MigrantsEdit';
      }
      // console.log(url);
      wx.request({
        url: url,
        method: 'post',
        data: commitData,
        success: (res) => {
          console.log(res);
          if (res.data === true) {
            wx.showToast({
              title: '提交成功！',
            })
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index',
              })
            }, 2000)
          } else {
            wx.showToast({
              title: "信息提交失败，请联系管理员！",
              icon: 'none'
            })
          }
        }
      });

      const isEdit = this.data.isEdit;
      if (isEdit) {// 2月5号之后居家隔离填写//居家隔离

        // 每天健康登记
        let dayUrl = "";
        if (this.data.isdayCreate) {
          dayUrl = baseUrl + '/api/MigrantsDayList/Create'//新建
        } else {
          dayUrl = baseUrl + '/api/MigrantsDayList/Edit'//修改
        }
        console.log(dayUrl);
        const postData = this.data.dayList;
        postData.OpenId = OpenId;
        wx.request({
          url: dayUrl,
          method: 'post',
          data: postData,
          success: (res) => {
            console.log(res);
            if (res.data === true) {
              wx.showToast({
                title: '提交成功！',
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            } else {
              wx.showToast({
                title: "信息提交失败，请联系管理员！",
                icon: 'none'
              })
            }
          },
        })
      }
    }

  },
  // 初始化获取用户信息
  getMessageInfo() {
    const OpenId = wx.getStorageSync('openid');
    wx.request({
      url: baseUrl + '/api/Migrants/QueryMigrantsInfo?openid=' + OpenId,
      method: 'post',
      success: (res) => {
        console.log(res);
        const data = res.data;
        if (data === '') {
          this.setData({
            isCreate: true
          })
        } else {
          const commitData = res.data;
          let AddressReservedArr = [];
          if (res.data.AddressReserved === null) {
            AddressReservedArr = ['', '', '', '']
          } else {
            AddressReservedArr = res.data.AddressReserved.split(',');
          }
          const region2 = AddressReservedArr.slice(0, 3);
          commitData.AddressReserved = AddressReservedArr[3];
          let AddressArr = [];
          if (res.data.Address === null) {
            AddressArr = ['', '', '', '']
          } else {
            AddressArr = res.data.Address.split(',');
          }
          commitData.Address = AddressArr[3];
          const region1 = AddressArr.slice(0, 3);
          let SectionArr = [];
          if (res.data.Address === null) {
            SectionArr = ['', '', '', '']
          } else {
            SectionArr = res.data.Section.split(',');
          }
          commitData.Section = SectionArr[3];
          const region3 = SectionArr.slice(0, 3);
          // 出沪事由赋值
          const LeaveReasonArr = res.data.LeaveReason.split(',');
          const end = LeaveReasonArr.pop();
          commitData.LeaveReason = end;
          let reasonStr = LeaveReasonArr.toString().replace(/,/g, '');
          if (res.data.QRCodePath !== null) {
            let xcmUrl = [];
            const imgPath = baseUrl + res.data.QRCodePath;
            xcmUrl.push(imgPath);
            this.setData({
              xcmUrl
            })
          }
          if (res.data.AcidTestResult != null) {
            let jcbgUrl = [];
            const imgPath = baseUrl + res.data.AcidTestResult;
            jcbgUrl.push(imgPath);
            this.setData({
              jcbgUrl
            })
          }
          // 给部门赋值
          let multiIndex = this.data.multiIndex;
          let multiArray = this.data.multiArray;
          const Company = commitData.Company;
          const Department = commitData.Department;
          const compantList = this.data.companyList;
          const partList = this.data.partList;
          multiArray[0] = compantList;
          for (let i = 0; i < compantList.length; i++) {
            if (compantList[i].DeptName === Company) {
              multiArray[1] = partList[i]
              multiIndex[0] = i;
              const partArr = partList[i];
              for (let j = 0; j < partArr.length; j++) {
                if (partArr[j].DeptName === Department) {
                  multiIndex[1] = j;
                }
              }
            }
          }
          this.setData({
            isCreate: false,
            commitData,
            region1,
            region2,
            region3,
            multiIndex,
            multiArray,
            reasonStr
          })
        }
        // console.log(res);
      }
    });
    // 2月5号之后居家隔离获取信息
    const isEdit = this.data.isEdit;
    if (isEdit) {
      wx.request({
        url: baseUrl + '/api/MigrantsDayList/Query?openid=' + OpenId,//获取当天隔离信息
        method: 'post',
        success: (res) => {
          console.log(res);
          if (res.data === '') {//当天新建
            this.setData({
              isdayCreate: true
            })
          } else {
            this.setData({
              isdayCreate: false,
              dayList: res.data,
            })
          }
        },
      })
    }
  },
  // 判断第一部分是否可以修改
  part1Edit() {
    const isEditTime = 20210205;
    const date = new Date();
    const year = date.getFullYear().toString();
    let month = Number(date.getMonth() + 1);
    if (month < 10) {
      month = '0' + month
    }
    let curDate = Number(date.getDate());
    if (curDate < 10) {
      curDate = '0' + curDate
    }
    const curTime = Number(year + month + curDate);
    // console.log(curTime);
    if (curTime > isEditTime) {
      this.setData({
        isEdit: true
      })
    } else {
      this.setData({
        isEdit: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    const commitData = this.data.commitData;
    commitData.OpenID = wx.getStorageSync('openid');
    this.setData({
      commitData
    })
    // 获取多选框数据
    this.getCompanyList();
    this.getTransHelth();

    // 获取当前日期
    this.part1Edit();
     // 初始化显示提示信息
     wx.showModal({
      title: '前言',
      content: '各位同事，春节临近，人员流动加剧，各地相继出现了新冠肺炎散发病例，根据上海市疫情管控要求，为进一步做好疫情防控工作，及时关注员工出行安全和健康状况，请各位员工认真填写相关信息。',
      showCancel: false,
      confirmText: '我知道了',
      success: res => {
        this.setData({
          isHidden: true,
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