// pages/interval_check/interval_check.js
import Toast from '@vant/weapp/toast/toast';
Page({

  data: {
    goals: [{
      text: "看星星",
      time: "170684546612",
      formatDate: "2016-11-7"
    }],
    openid: "",
    goals_detail_show: false,
    popup_text: "",
    popup_calender: "",
    calender_show: false,
    min_date: new Date(2019, 6, 7).getTime(),
    max_date: new Date(2024, 6, 7).getTime(),
    popup_default_date: "",
    popup_count: "",
    popup_index: "",
    // 是否为过去时间的判断，1为是，0为否
    popup_past: ""
  },
  GoalsTap(event) {
    // console.log(event);
    var date = new Date().getTime();

    if (event.currentTarget.dataset.time == '0') {
      var nowtime = date;
      var calender = this.formatDate(nowtime)
    } else {
      var formatdate = event.currentTarget.dataset.formatdate
      var res = Date.parse(new Date(formatdate))
      if (res > date) {
        var nowtime = event.currentTarget.dataset.time + date;
        var calender = this.formatDate(nowtime)
      } else {
        var nowtime = date - event.currentTarget.dataset.time;
        var calender = this.formatDate(nowtime)
      }
    }
    this.setData({
      goals_detail_show: true,
      popup_text: event.currentTarget.dataset.text,
      popup_count: event.currentTarget.dataset.time,
      popup_calender: calender,
      popup_index: event.currentTarget.dataset.index,
      popup_default_date: nowtime
    })
  },
  goals_onClose() {
    this.setData({
      goals_detail_show: false,
    })
  },
  // 日历显示/关闭
  calender_onDisplay() {
    this.setData({
      calender_show: true,
    })
  },
  calender_onClose() {
    this.setData({
      calender_show: false
    })
  },
  goal_item_save() {
    var index = this.data.popup_index
    var nowtime = new Date().getTime()
    if (index < 0) {
      var array = this.data.goals
      var insertext = this.data.popup_text
      var inserttime = this.data.popup_count
      var calender = this.data.popup_calender

      array.push({
        'text': insertext,
        'time': inserttime,
        'formatDate': calender
      })
      array.sort(this.compare("time"))
      this.setData({
        goals: array,
        goals_detail_show: false
      })
      // console.log(this.data.goals)
    } else {
      // console.log(index)
      var text = this.data.popup_text
      var inserttime = this.data.popup_count
      var array = this.data.goals
      var calender = this.data.popup_calender
      array[index].text = text
      array[index].time = inserttime
      array[index].formatDate = calender
      array.sort(this.compare("time"))
      this.setData({
        goals: array,
        goals_detail_show: false
      })
    }
  },
  goal_item_delete() {
    var index = this.data.popup_index
    if (index < 0) {
      this.setData({
        goals_detail_show: false
      })
    } else {
      // console.log(index)
      let temp = this.data.goals
      temp.splice(index, 1)
      this.setData({
        goals: temp,
        goals_detail_show: false
      })
    }
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  },
  calender_onConfirm(event) {
    var today = new Date().getTime();
    var count = new Date(event.detail).getTime() - today;
    if (count < 0) {
      var count = today - new Date(event.detail).getTime()
    }
    this.setData({
      calender_show: false,
      popup_calender: this.formatDate(event.detail),
      popup_count: count
    });
  },
  // 数组对象按时间大小排序
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1 //小程序关闭当前页面返回上一页面
    })
  },
  // 最下方保存按钮函数
  setting_save() {
    if (!!wx.getStorageSync('openid')) {
      var nowtime = new Date().getTime()
      var standard_goals = this.data.goals
      for (var i = 0; i < standard_goals.length; i++) {
        var formatdate = standard_goals[i].formatDate
        var res = Date.parse(new Date(formatdate))
        if (res > nowtime) {
          standard_goals[i].time = parseInt(standard_goals[i].time) + nowtime
        } else {
          standard_goals[i].time = nowtime - parseInt(standard_goals[i].time)
        }
      }
      wx.request({
        url: 'http://120.25.169.51/inspire-daily/server/inda.php',
        data: {
          action: "save_interval",
          openid: this.data.openid,
          interval: JSON.stringify(standard_goals),
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // console.log(res.data);
          Toast.success('保存成功');
        },
      })
    } else {
      Toast.fail('请登录再保存呀！');
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!!wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
    }
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
    Toast.success('记得点击最下方按钮哟！');
    var that = this;
    // 获取存储信息
    if (!!wx.getStorageSync('openid')) {
      that.setData({
        openid: wx.getStorageSync('openid')
      })
      wx.request({
        url: 'http://120.25.169.51/inspire-daily/server/inda.php',
        data: {
          action: "get_interval",
          openid: that.data.openid,
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res)
          var nowtime = new Date().getTime()
          var standard_goals = JSON.parse(res.data.data[0].goals)
          for (var i = 0; i < standard_goals.length; i++) {
            var formatdate = standard_goals[i].formatDate
            var res = Date.parse(new Date(formatdate))
            if (res > nowtime) {
              standard_goals[i].time = parseInt(standard_goals[i].time) - nowtime
            } else {
              standard_goals[i].time = nowtime - parseInt(standard_goals[i].time)
            }
          }
          var goals = standard_goals
          that.setData({
            goals: goals,
          })
        },
      })
    }
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