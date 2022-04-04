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
    Toast.fail('在快马加鞭的编写中');
  },
  tap2: function () {
    Toast.fail('在快马加鞭的编写中');
  },
  tap3: function () {
    Toast.fail('在快马加鞭的编写中');
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
              wx.request({
                url: 'http://120.25.169.51/inspire-daily/server/inda.php',
                data: {
                  action: "user_save",
                  openid: res.data.openid,
                  nickname: that.data.userInfo.nickName
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
                      app.globalData.goals = JSON.parse(res.data.data[0].goals)
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
    console.log(this.data.userInfo)
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