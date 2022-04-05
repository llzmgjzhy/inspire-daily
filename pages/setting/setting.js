// pages/setting/setting.js
import Toast from '@vant/weapp/toast/toast';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    gridlist: [{
        text: "每日设置",
        iconpath: "/images/icon/daily.png"
      },
      {
        text: "间隔查看",
        iconpath: "/images/icon/interval.png"
      },
      {
        text: "每日复盘",
        iconpath: "/images/icon/recover.png"
      },
      {
        text: "帮助",
        iconpath: "/images/icon/help.png"
      }
    ],
    userInfo: "",
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  tap0: function () {
    // Toast.fail('在快马加鞭的编写中');
    wx.navigateTo({
      url: '/pages/daily_setting/daily_setting',
    })
  },
  tap1: function () {
    wx.navigateTo({
      url: '/pages/interval_check/interval_check',
    })
  },
  tap2: function () {
    Toast.fail('自己找个文档去记录吧嘻嘻');
  },
  tap3: function () {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  login: function () {
    var app = getApp()
    //获取用户信息
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        if (res.userInfo.nickName == '') {
          res.userInfo.nickName = '🍊'
        }
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = this.data.userInfo
        wx.setStorageSync('userInfo', this.data.userInfo);
      }
    })
    //获取openid
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; //发送给服务器的code
        var userNick = that.data.userInfo.nickName; //用户昵称
        var avataUrl = that.data.userInfo.avatarUrl; //用户头像地址
        var gender = that.data.userInfo.gender; //用户性别
        if (code) {
          wx.request({
            url: 'https://xubeiyang.com.cn/inspire-daily/getOpenid.php',
            data: {
              code: code,
              nick: userNick,
              avaurl: avataUrl,
              sex: gender,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              // console.log('获取到的用户openid为：' + res.data.openid);
              //可以把openid保存到本地缓存，方便以后调用
              wx.setStorageSync('openid', res.data.openid);
              const openid = res.data.openid
              const app = getApp()
              // 初始化goals存入数据
              var standard_goals = app.globalData.goals
              var nowtime = new Date().getTime()
              for (var i = 0; i < standard_goals.length; i++) {
                standard_goals[i].time = parseInt(standard_goals[i].time) + nowtime
              }
              // 初始化interval存入数据
              var standard_interval = app.globalData.interval
              for (var i = 0; i < standard_interval.length; i++) {
                var formatdate = standard_interval[i].formatDate
                var resday = Date.parse(new Date(formatdate))
                if (resday > nowtime) {
                  standard_interval[i].time = parseInt(standard_interval[i].time) + nowtime
                } else {
                  standard_interval[i].time = nowtime - parseInt(standard_interval[i].time)
                }
              }
              wx.request({
                url: 'http://120.25.169.51/inspire-daily/server/inda.php',
                data: {
                  action: "user_save",
                  openid: res.data.openid,
                  nickname: that.data.userInfo.nickName,
                  photo_type: '0',
                  motto_type: '0',
                  goals: JSON.stringify(standard_goals),
                  today: JSON.stringify(app.globalData.today),
                  inter: JSON.stringify(standard_interval)
                },
                header: {
                  "Content-Type": "application/json"
                },
                success: function (res) {
                  wx.request({
                    url: 'http://120.25.169.51/inspire-daily/server/inda.php',
                    data: {
                      action: "get_info",
                      openid: openid,
                    },
                    header: {
                      "Content-Type": "application/json"
                    },
                    success: function (res) {
                      const app = getApp()
                      var nowtime = new Date().getTime()
                      var standard_goals = JSON.parse(res.data.data[0].goals)
                      for (var i = 0; i < standard_goals.length; i++) {
                        standard_goals[i].time = parseInt(standard_goals[i].time) - nowtime
                      }
                      app.globalData.photo_type = res.data.data[0].photo_type
                      app.globalData.motto_type = res.data.data[0].motto_type
                      app.globalData.goals = standard_goals
                      app.globalData.today = JSON.parse(res.data.data[0].today)
                    },
                  })
                },
              })
            }
          })
        } else {
          console.log("获取用户登录态失败！");
        }

      },
      fail: function (error) {
        console.log('login failed ' + error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (!!wx.getStorageSync('openid')) {
      this.setData({
        hasUserInfo: true,
        openid: wx.getStorageSync('openid'),
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    // console.log(this.data.userInfo)
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