import * as echarts from '../../lib/ec-canvas/echarts';
function initChart(canvas, width, height, data) {//这里多加一个参数
 
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart);
  var option = {
    title: {
      text: '报告',
      subtext: '报告',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'center',
      data: []
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        center: ['50%', '40%'],          // 默认全局居中
        radius: [0, '75%'],
        clockWise: false,             // 默认逆时针
        startAngle: 90,
        minAngle: 0,                 // 最小角度改为0
        selectedOffset: 10,   
        data: data,      // 选中是扇区偏移量
        itemStyle: {
          normal: {
            // color: 各异,
            borderColor: '#fff',
            borderWidth: 1,
            label: {
              show: true,
              position: 'inner',
              formatter: function (p) {   //指示线对应文字
                var data = p.data.name+' : '+p.data.value;
                return data;
              }
              // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
            },
            labelLine: {
              show: true,
              length: 20,
              lineStyle: {
                // color: 各异,
                width: 1,
                type: 'solid'
              }
            }
          },
          emphasis: {
            // color: 各异,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            label: {
              show: true,
              position: 'outer',
              formatter: function (p) {   //指示线对应文字
                var data = p.data.name;
                return data;
              }
              //textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
            },
            labelLine: {
              show: true,
              length: 20,
              lineStyle: {
                // color: 各异,
                width: 1,
                type: 'solid'
              }
            }
          }
        }
      }
    ]
  }
  chart.setOption(option);
  return chart;
}
var dataList = [];
// pages/normal/normal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    content: [],
    listData: [],
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid')
    var company = wx.getStorageSync('company')
    this.setData({
      title: company+'体温报告'
    })
    var that = this
    
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetOnPostDetail',
      method: 'GET',
      data: { "openid": openid},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var resData = res.data;
        var arr = [];
        var tem1 = 0;
        var tem2 = 0;
        for (var i = 0; i < resData.length;i++) {
          if (resData[i].Morning < 37.2 || resData[i].Afternoon < 37.2 ) {
            if (resData[i].Morning==null ){
              resData[i].Morning = "无"
            }
            if (resData[i].Afternoon == null) {
              resData[i].Afternoon = "无"
            }
            if (company == resData[i].Company ){
              arr.push(resData[i])
            }
          }
        }
        //console.log(arr)
        that.data.listData = arr
        that.setData({
          listData: that.data.listData
        })
      }
    })

    
    this.echartsComponnet = this.selectComponent('#mychartbar');
    this.getData(); //获取数据
  },
  getData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    var openid = wx.getStorageSync('openid')
    var that = this
    wx.request({
      url: 'https://shenjq.top/api/DataAnalysis/GetDeptTotalPeople?openid=' + openid,
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var brr = [
          { value: 0, name: '<37.2' },
          { value: 0, name: '>=37.2' }
        ]
        brr[1].value = res.data[0].abnormal
        brr[0].value = res.data[0].Normal
        //that.data.content = brr
        
        that.init_echarts(brr);//初始化图表
      }
    })
  },
  //初始化图表
  init_echarts: function (dataList) {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(this.getOption(dataList));

      //此处为折线图的点击事件（可忽略）
      Chart.on('click', function (handler, context) {
        console.dir(handler.value);
        xwx.toast("" + handler.value + "").icon("none").show();
      });

      ////此处为折线图的点击事件

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  //自动配置自己要的数据 参照ECharts 微信小程序例子 复制后 修改
  getOption: function (dataList) {
    var that = this
    var option = {
      title: {
        text: '报告',
        subtext: '报告',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'center',
        data: []
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          center: ['50%', '40%'],          // 默认全局居中
          radius: [0, '75%'],
          clockWise: false,             // 默认逆时针
          startAngle: 90,
          minAngle: 0,                 // 最小角度改为0
          selectedOffset: 10,
          data: dataList,      // 选中是扇区偏移量
          itemStyle: {
            normal: {
              // color: 各异,
              borderColor: '#fff',
              borderWidth: 1,
              label: {
                show: true,
                position: 'inner',
                formatter: function (p) {   //指示线对应文字
                  var data = p.data.name + ' : ' + p.data.value;
                  return data;
                }
                // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
              },
              labelLine: {
                show: true,
                length: 20,
                lineStyle: {
                  // color: 各异,
                  width: 1,
                  type: 'solid'
                }
              }
            },
            emphasis: {
              // color: 各异,
              borderColor: 'rgba(0,0,0,0)',
              borderWidth: 1,
              label: {
                show: true,
                position: 'outer',
                formatter: function (p) {   //指示线对应文字
                  var data = p.data.name;
                  return data;
                }
                //textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
              },
              labelLine: {
                show: true,
                length: 20,
                lineStyle: {
                  // color: 各异,
                  width: 1,
                  type: 'solid'
                }
              }
            }
          }
        }
      ]
    }
    return option;
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