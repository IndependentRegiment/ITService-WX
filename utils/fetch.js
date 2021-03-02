var baseURL = 'https://itservice.chintpower.com:8085/api1.0/';
var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': null,
}
function getReq(url, cb) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: baseURL + url,
    method: 'get',
    header: header,
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)  // 返回调用cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}

function postReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
    // console.log(data),
    wx.request({
      url: baseURL + url,
      header: header,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false,
          duration: 4000
        })
        return typeof cb == "function" && cb(false)
      }
    })
 
}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,

}  