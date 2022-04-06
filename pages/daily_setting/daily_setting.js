// pages/daily_setting/daily_setting.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  data: {
    openid: "",
    photo_type_show: false,
    motto_type_show: false,
    photo_type: "",
    motto_type: "",
    default_index_photo: 0,
    default_index_motto: 0,
    photo_columns: ["风景", "动漫"],
    motto_columns: ["理想", "志向", "爱情", "青春", "鸡汤语录", "网易云热评"],
    // time的格式是日期距今的毫秒数
    goals: [{
        text: "送花",
        time: 354365145
      }, {
        text: "旅游",
        time: 452254145
      }, {
        text: "买东西",
        time: 523454565
      },
      {
        text: "吃好吃的",
        time: 5465353154
      }
    ],
    today: [{
      text: "记单词"
    }, {
      text: "数学一讲"
    }, {
      text: "写代码"
    }, {
      text: "冰淇淋"
    }],
    goals_detail_show: false,
    today_detail_show: false,
    // 弹出框的文案
    popup_text: "",
    // 弹出框的日期显示
    popup_calender: "",
    // 弹出框的距今天数
    popup_count: "",
    // 弹出框的索引，用于修改已有Goal的内容
    popup_index: "",
    // 弹出框的默认选择日期，为选择日期的标准毫秒数
    popup_default_date: "",
    // 下面为today弹出框的内容
    today_popup_text: "",
    today_popup_index: "",
    calender_show: false,
    date: '',
    max_date: new Date(2024, 6, 7).getTime()
  },

  photo_showPopup() {
    this.setData({
      photo_type_show: true
    });
  },

  photo_type_onClose() {
    this.setData({
      photo_type_show: false
    });
  },
  photo_onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      photo_type: value,
      default_index_photo: index
    })
  },
  motto_showPopup() {
    this.setData({
      motto_type_show: true
    });
  },

  motto_type_onClose() {
    this.setData({
      motto_type_show: false
    });
  },
  motto_onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      motto_type: value,
      default_index_motto: index
    })
  },
  // 显示弹出框
  GoalsTap(event) {
    // console.log(event);
    var date = new Date().getTime();
    if (event.currentTarget.dataset.time == '0') {
      var nowtime = date;
      var calender = this.formatDate(nowtime)
    } else {
      var nowtime = event.currentTarget.dataset.time + date;
      var calender = this.formatDate(nowtime)
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
  TodayTap(event) {
    this.setData({
      today_detail_show: true,
      today_popup_text: event.currentTarget.dataset.text,
      today_popup_index: event.currentTarget.dataset.index
    })
  },
  // 关闭弹框
  goals_onClose() {
    this.setData({
      goals_detail_show: false,
    })
  },
  today_onClose() {
    this.setData({
      today_detail_show: false,
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
  // goal/today弹出框的保存/删除按钮
  goal_item_save() {
    var index = this.data.popup_index
    if (index < 0) {
      var array = this.data.goals
      var insertext = this.data.popup_text
      var inserttime = this.data.popup_count
      array.push({
        'text': insertext,
        'time': inserttime
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
      array[index].text = text
      array[index].time = inserttime
      array.sort(this.compare("time"))
      this.setData({
        goals: array,
        goals_detail_show: false
      })
    }
  },
  today_item_save() {
    var index = this.data.today_popup_index
    if (index < 0) {
      var array = this.data.today
      var insertext = this.data.today_popup_text
      array.push({
        'text': insertext
      })
      this.setData({
        today: array,
        today_detail_show: false
      })
      // console.log(this.data.goals)
    } else {
      // console.log(index)
      var text = this.data.today_popup_text
      let temptext = 'today[' + index + '].text'
      this.setData({
        [temptext]: text,
        today_detail_show: false
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
  today_item_delete() {
    var index = this.data.today_popup_index
    if (index < 0) {
      this.setData({
        today_detail_show: false
      })
    } else {
      // console.log(index)
      let temp = this.data.today
      temp.splice(index, 1)
      this.setData({
        today: temp,
        today_detail_show: false
      })
    }
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
  },
  calender_onConfirm(event) {
    var toady = new Date().getTime();
    var count = new Date(event.detail).getTime() - toady;
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
  // 左上角返回按钮
  onClickLeft() {
    wx.navigateBack({
      delta: 1 //小程序关闭当前页面返回上一页面
    })
  },
  // 最下方保存按钮函数
  setting_save() {
    if (!!this.data.openid) {
      app.globalData.photo_type = this.data.default_index_photo;
      app.globalData.motto_type = this.data.default_index_motto;
      app.globalData.goals = this.data.goals;
      app.globalData.today = this.data.today;
      // console.log(app.globalData)
      var nowtime = new Date().getTime()
      var standard_goals = this.data.goals
      for (var i = 0; i < standard_goals.length; i++) {
        standard_goals[i].time = parseInt(standard_goals[i].time) + nowtime
      }
      wx.request({
        url: 'https://xubeiyang.com.cn/inspire-daily/server/inda.php',
        data: {
          action: "save_setting",
          openid: this.data.openid,
          photo_type: this.data.default_index_photo,
          motto_type: this.data.default_index_motto,
          goals: JSON.stringify(standard_goals),
          today: JSON.stringify(this.data.today),
        },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // console.log(res.data);
          wx.navigateBack({
            delta: 1 //小程序关闭当前页面返回上一页面
          })
          Toast.success('保存成功');
        },
      })
    } else {
      Toast.fail('请登录再保存呀！');
    }
    // console.log(this.data.goals)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    // 获取用户的图片、语录类型，goals和today事件并在页面显示前进行赋值
    var that = this;
    // 获取存储信息
    if (!!wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
    }
    if (that.data.goals != app.globalData.goals && that.data.today != app.globalData.toady) {
      wx.request({
        url: 'https://xubeiyang.com.cn/inspire-daily/server/inda.php',
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
          wx.setStorageSync('goals', res.data.data[0].goals)
          wx.setStorageSync('today', res.data.data[0].today)
          var goals = standard_goals
          var today = JSON.parse(res.data.data[0].today)
          var photo_index = parseInt(res.data.data[0].photo_type)
          var motto_index = parseInt(res.data.data[0].motto_type)
          that.setData({
            default_index_photo: parseInt(photo_index),
            default_index_motto: parseInt(motto_index),
            photo_type: that.data.photo_columns[photo_index],
            motto_type: that.data.motto_columns[motto_index],
            goals: goals,
            today: today
          })
        },
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Toast.success('记得点击最下方按钮哟！');
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