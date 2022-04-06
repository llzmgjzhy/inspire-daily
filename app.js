// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 监听小程序退出
    wx.onAppHide((res) => {
      var that = this;
      // 根据photo_type获取图片imgurl
      var photo_url
      if (that.globalData.photo_type == 1) {
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
          that.globalData.imgurl=res.data.imgurl
        }
      })
      // 根据motto_type获取语录text_content
      if (parseInt(that.globalData.motto_type) < 4) {
        var motto_index
        switch (parseInt(that.globalData.motto_type)) {
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
            // that.setData({
            //   text_content: response
            // })
            that.globalData.text_content=response
          }
        })
      } else if (parseInt(that.globalData.motto_type) == 4) {
        wx.request({
          url: 'https://apis.juhe.cn/fapig/soup/query?key=a05a05c11edb1b817885ffa14b4911ca',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var response = JSON.stringify(res.data.result.text)
            response = response.split("<br>").join("")
            // console.log(response.text)

            that.globalData.text_content=response
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
            that.globalData.text_content=response
          }
        })
      }
    })
  },
  globalData: {
    userInfo: "",
    photo_type: "0",
    imgurl:"",
    text_content:"",
    motto_type: "0",
    goals: [{
      text: "送花",
      time: 354365145
    }, {
      text: "旅游",
      time: 452254145
    }, {
      text: "买东西",
      time: 523454565
    }, {
      text: "吃好吃的",
      time: 5465353154
    }],
    today: [{
      text: "记单词"
    }, {
      text: "数学一讲"
    }, {
      text: "写代码"
    }, {
      text: "冰淇淋"
    }],
    interval:[{
      text: "看星星",
      time: "170684546612",
      formatDate: "2016-11-7"
    }]
  }
})