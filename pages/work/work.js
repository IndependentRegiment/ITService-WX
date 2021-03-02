import * as echarts from '../../lib/ec-canvas/echarts';
function initChart(canvas, width, height, data) {//这里多加一个参数
  var bcolor = [];
  bcolor.push(data[0].color)
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart);
  var option = {
    title: {
      text: '体温正常报告',
      subtext: '体温正常报告',
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
  chart.setOption(option);
  return chart;
}
// pages/work/work.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    workList: [
      { value: 335, name: '居家办公' },
      { value: 80, name: '在岗办公' }
    ],
    listData: [
      { "province": "河南", "count": "122" },
      { "province": "湖北", "count": "36" },
      { "province": "上海", "count": "36" },
      { "province": "湖南", "count": "38" },
      { "province": "辽宁", "count": "54" },
      { "province": "云南", "count": "95" },
      { "province": "河北", "count": "52" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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