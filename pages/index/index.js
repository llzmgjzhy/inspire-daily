// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    openid: "",
    imgurl: "",
    text_content: "",
    time: 231351650,
    goals: [],
    today: [],
  },
  // 事件处理函数
  bindViewTap() {

  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  onLoad: function (options) {
    // 获取用户的图片、语录类型，goals和today事件并在页面显示前进行赋值
    var that = this;
    // 获取存储信息
    if (!!wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
      wx.request({
        url: 'http://120.25.169.51/inspire-daily/server/inda.php',
        data: {
          action: "get_info",
          openid: that.data.openid,
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          var goals = JSON.parse(res.data.data[0].goals)
          var today = JSON.parse(res.data.data[0].today)
          app.globalData.goals = goals
          app.globalData.today = today
          that.setData({
            goals: goals,
            today: today
          })
        },
      })
    }
  },

  onReady() {
    var that = this;
    wx.request({
        url: 'https://api.ixiaowai.cn/gqapi/gqapi.php?return=json',
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          // console.log('获取到的图片url：' + res.data.imgurl);
          that.setData({
            imgurl: res.data.imgurl
          })
        }
      }),
      wx.request({
        url: 'https://api.oddfar.com/yl/q.php?c=1003&encode=json',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var response = JSON.stringify(res.data.text)
          response = response.split("<br>").join("")
          console.log(response.text)
          that.setData({
            text_content: response
          })
        }
      })
  },
  onShow: function () {
    var nowapp=getApp()
    this.setData({
      today: nowapp.globalData.today,
      goals: nowapp.globalData.goals
    })
  },
})