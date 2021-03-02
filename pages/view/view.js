import * as echarts from '../../lib/ec-canvas/echarts';
function initChart(canvas, width, height, data) {//这里多加一个参数
  var bcolor=[];
  bcolor.push(data[0].color)
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart);
  var option = {
    tooltip: {
      show: false,
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color: bcolor,
    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['']
    },
    series: [
      {
        name: data[0].name,
        type: 'pie',
        radius: ['75%', '85%'],
        avoidLabelOverlap: false,
        hoveranination: false,
        silent: true,
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function (argument) {
              var html;
              html = data[0].name + '\r\n\r\n' + data[0].value+ '人';
              return html;
            },
            textStyle: {
              fontSize: 13,
              color: data[0].color
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:data
      }
    ]
  }
  chart.setOption(option);
  return chart;
}
function isCompanyID(res, resList) {
  for (var i = 0; i < resList.length; i++) {
    if (resList[i] == res) {
      return true;
    }
  }
  return false;
}
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    contentListData: { content: [], index: 0 },
    contentList: [],
    listData: [
      { "code": "<37.2", "count": 0 },
      { "code": ">=37.2", "count": 0 }
    ],
    aListData: [
      { "code": ">=37.2", "count": 0 }
    ],
    workTypeData: [
      { "code": "居家办公", "count": 105 },
      { "code": "在岗办公", "count": 120 }
    ],
    normalCount: 0,
    abnormalCount: 0,
    totalCount: 0,
    departListData: { "company": "", "content": [] },
    departListCount: { "depart": "", "count": 0 },
    companyListData:[],
    companyListData1: [
      { "company": "研究院", "content": [{ "depart": "IT", "count": 23 }, { "depart": "IT1", "count": 220 }, { "depart": "IT2", "count": 45 }]},
      { "company": "诺雅克", "content": [{ "depart": "IT5", "count": 223 }, { "depart": "IT16", "count": 2250 }, { "depart": "IT25", "count": 455 }] }
    ]
  },
  // 图标点击事件
  getCurrentIndex: function (e) {
    //得到点击的项目
    this.getCurrent = e.currentTarget.dataset.z  //获取点击事件的信息
    //console.log(this.getCurrent)
  },
  //温度正常点击更多
  normalClick: function (e) {
    console.log(e.currentTarget.dataset.z )
    wx.setStorageSync("company", e.currentTarget.dataset.z)
    wx.navigateTo({
      url: '../normal/normal',
    })
  },
  //温度异常点击更多
  abnormalClick: function () {
    wx.navigateTo({
      url: '../abnormal/abnormal',
    })
  },
  //办公情况点击更多
  workTypeClick: function () {
    wx.navigateTo({
      url: '../work/work',
    })
  },
  onLoad: function () {
    var newDate = util.formatTimeDate(new Date()) 
    var that = this
    //温度段 0-36.8
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetTotalOnPost?Date=' + newDate +'&&TBegin=0&&TEnd=36.8',
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res)
        
        that.data.normalCount = res.data
        that.setData({
          normalCount: that.data.normalCount
        })
      }
    })
    //获取温度区间
    var openid = wx.getStorageSync('openid')
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetDeptTotalPeople?openid=' + openid ,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.data.listData[1].count = res.data[0].abnormal
        that.data.listData[0].count = res.data[0].Normal
        that.setData({
          listData: that.data.listData
        })
      }
    })
    //温度段 >37.2
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetTotalOnPost?Date=' + newDate + '&&TBegin=37.2&&TEnd=999',
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.data.aListData[0].count = res.data
        that.setData({
          aListData: that.data.aListData
        })
        that.data.abnormalCount = that.data.aListData[0].count
        that.setData({
          abnormalCount: that.data.abnormalCount
        })
      }
    })
    this.data.totalCount = this.data.normalCount + this.data.abnormalCount
   
    var arr = []
    arr.push(this.data.totalCount)
    arr.push(this.data.normalCount)
    arr.push(this.data.abnormalCount)
    for (var i = 0; i < this.data.contentList.length; i++ ){
      this.data.contentList[i].content[0].value = arr[i]
    }
    this.setData({
      contentList: this.data.contentList
    })
    this.setData({
      listData: this.data.listData
    })
    this.setData({
      aListData: this.data.aListData
    })

    var openid = wx.getStorageSync('openid')
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetDeptTotalPeople?openid=' + openid + '&&Date=' + newDate + '&&TBegin=1&&TEnd=999',
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var resData = res.data
        //得到所有公司
        var companyListBefore = []
        for (var i = 0; i < resData.length;i++) {
          if (isCompanyID(resData[i].公司, companyListBefore) == false) {
            companyListBefore.push(resData[i].公司)
          }
        }
        //console.log(companyListBefore)
        for (var i = 0; i < companyListBefore.length;i++){
          var departListData_company={ "company": "", "content": [] }
          departListData_company.company = companyListBefore[i]
          for (var j = 0; j < resData.length; j++) {
            var departCount = { depart: "", count: 0}
            if ( resData[j].公司 == companyListBefore[i] ) {
              departCount.depart = resData[j].部门
              departCount.count = resData[j].到岗人数
              departListData_company.content.push(departCount)
            }
          }
          that.data.companyListData.push(departListData_company)
        }

        //console.log(that.data.companyListData)
        that.setData({
          companyListData: that.data.companyListData
        })
      }
    })
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetTotalOnPost',
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var brr = [
          { content: [{ value: 0,name: '办公人数', color: '#00c0ef', isTop: "0" }],index:0},
          { content: [{ value: 0, name: '体温正常', color: 'green', isTop: "0" }],index: 1},
          { content: [{ value: 0, name: '体温异常', color: 'red', isTop: "0" }],index: 2 }
        ]
      
        brr[0].content[0].value = res.data[0].CountPeople
        brr[1].content[0].value = res.data[0].Normal
        brr[2].content[0].value = res.data[0].abnormal
        that.data.contentList = brr
        console.log(that.data.contentList)
        that.setData({
          contentList: that.data.contentList
        })
      }
    })
  }
})