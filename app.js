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
  },
  globalData: {
    userInfo: "",
    photo_type: "",
    motto_type: "",
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
    }]
  }
})