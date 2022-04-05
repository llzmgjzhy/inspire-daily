// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    openid: "",
    imgurl: "",
    text_content: "",
    photo_type: "",
    motto_type: "",
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
  // 获取goals和today及语录类型
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
          var nowtime = new Date().getTime()
          var standard_goals = JSON.parse(res.data.data[0].goals)
          for (var i = 0; i < standard_goals.length; i++) {
            standard_goals[i].time = parseInt(standard_goals[i].time) - nowtime
          }
          var goals = standard_goals
          var today = JSON.parse(res.data.data[0].today)
          app.globalData.goals = goals
          app.globalData.today = today
          app.globalData.photo_type = res.data.data[0].photo_type
          app.globalData.motto_type = res.data.data[0].motto_type
          that.setData({
            photo_type: res.data.data[0].photo_type,
            motto_type: res.data.data[0].motto_type,
            goals: goals,
            today: today
          })
          // 根据photo_type获取图片imgurl
          var photo_url
          if (parseInt(that.data.photo_type) == "1") {
            photo_url = 'api/api.php'
          } else {
            photo_url = 'gqapi/gqapi.php'
          }
          wx.request({
            url: 'https://api.ixiaowai.cn/' + photo_url + '?return=json',
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              that.setData({
                imgurl: res.data.imgurl
              })
            }
          })
          // 根据motto_type获取语录text_content
          if (parseInt(that.data.motto_type) < 4) {
            var motto_index
            switch (parseInt(that.data.motto_type)) {
              case 0:
                motto_index = 6
                break;
              case 1:
                motto_index = 7
                break;
              case 2:
                motto_index = 1
                break;
              default:
                motto_index = 3
                break;
            }
            wx.request({
              url: 'https://v2.alapi.cn/api/mingyan?typeid=' + motto_index + '&token=LwExDtUWhF3rH5ib',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var response = JSON.stringify(res.data.data.content)
                response = response.split("<br>").join("")
                // console.log(response.text)
                that.setData({
                  text_content: response
                })
              }
            })
          } else if (parseInt(that.data.motto_type) == 4) {
            wx.request({
              url: 'https://apis.juhe.cn/fapig/soup/query?key=a05a05c11edb1b817885ffa14b4911ca',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var response = JSON.stringify(res.data.result.text)
                response = response.split("<br>").join("")
                // console.log(response.text)
                that.setData({
                  text_content: response
                })
              }
            })
          } else {
            wx.request({
              url: 'https://api.oddfar.com/yl/q.php?c=1003&encode=json',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var response = JSON.stringify(res.data.text)
                response = response.split("<br>").join("")
                // console.log(response.text)
                that.setData({
                  text_content: response
                })
              }
            })
          }
        },
      })
    } else {
      var goals = app.globalData.goals
      var today = app.globalData.today
      that.setData({
        goals: goals,
        today: today
      })
      wx.request({
        url: 'https://api.ixiaowai.cn/gqapi/gqapi.php?return=json',
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          that.setData({
            imgurl: res.data.imgurl
          })
        }
      })
      wx.request({
        url: 'https://api.oddfar.com/yl/q.php?c=1003&encode=json',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var response = JSON.stringify(res.data.text)
          response = response.split("<br>").join("")
          // console.log(response.text)
          that.setData({
            text_content: response
          })
        }
      })
    }
  },
  // 第一次刷新图片和语录
  onReady() {

  },

  // 每次显示每日页面时，重新刷新goals和today及对应图片和语录的类型，主要是为了及时刷新距离天数
  onShow: function () {
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
          const nowapp = getApp()
          var nowtime = new Date().getTime()
          var standard_goals = JSON.parse(res.data.data[0].goals)
          for (var i = 0; i < standard_goals.length; i++) {
            standard_goals[i].time = parseInt(standard_goals[i].time) - nowtime
          }
          var goals = standard_goals
          var today = JSON.parse(res.data.data[0].today)
          if((that.data.motto_type!=res.data.data[0].motto_type)||(that.data.photo_type!=res.data.data[0].photo_type)){
            that.onLoad()
          }
          nowapp.globalData.goals = goals
          nowapp.globalData.today = today
          nowapp.globalData.photo_type = res.data.data[0].photo_type
          nowapp.globalData.motto_type = res.data.data[0].motto_type
          that.setData({
            goals: goals,
            today: today,
            photo_type: res.data.data[0].photo_type,
            motto_type: res.data.data[0].motto_type
          })
        },
      })
    }
  },

  // 当小程序进入后台，重新刷新图片和语录
  onHide: function () {
    wx.onAppHide((res) => {
      var that = this;
      // 根据photo_type获取图片imgurl
      var photo_url
      if (this.data.photo_type == 1) {
        photo_url = 'api/api.php'
      } else {
        photo_url = 'gqapi/gqapi.php'
      }
      wx.request({
        url: 'https://api.ixiaowai.cn/' + photo_url + '?return=json',
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          that.setData({
            imgurl: res.data.imgurl
          })
        }
      })
      // 根据motto_type获取语录text_content
      if (parseInt(this.data.motto_type) < 4) {
        var motto_index
        switch (parseInt(this.data.motto_type)) {
          case 0:
            motto_index = 6
            break;
          case 1:
            motto_index = 7
            break;
          case 2:
            motto_index = 1
            break;
          default:
            motto_index = 3
            break;
        }
        wx.request({
          url: 'https://v2.alapi.cn/api/mingyan?typeid=' + motto_index + '&token=LwExDtUWhF3rH5ib',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var response = JSON.stringify(res.data.data.content)
            response = response.split("<br>").join("")
            // console.log(response.text)
            that.setData({
              text_content: response
            })
          }
        })
      } else if (parseInt(this.data.motto_type) == 4) {
        wx.request({
          url: 'https://apis.juhe.cn/fapig/soup/query?key=a05a05c11edb1b817885ffa14b4911ca',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var response = JSON.stringify(res.data.result.text)
            response = response.split("<br>").join("")
            // console.log(response.text)
            that.setData({
              text_content: response
            })
          }
        })
      } else {
        wx.request({
          url: 'https://api.oddfar.com/yl/q.php?c=1003&encode=json',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var response = JSON.stringify(res.data.text)
            response = response.split("<br>").join("")
            // console.log(response.text)
            that.setData({
              text_content: response
            })
          }
        })
      }
    })
  },
})