// import NetworkRequest from '../../../../template/network.js';
import NetworkRequest from '../../../../template/GardenNetwork.js'
import Toast from '../../../../dist/toast/toast';
import Notify from '../../../../dist/notify/notify';
import applyType from '../../../../template/template.js';
import copyText from '../../../../template/copyText.js';
import setTime from '../../../../template/setTime.js';
Page({

  data: {
    icon_Url: getApp().globalData.icon_Url,
    url: getApp().globalData.dm_Url,
    id: 0,
    arry: [],
    applyType: applyType.applyType,
    click_type: '',
    height: getApp().globalData.menu.height + getApp().globalData.menu.top,
    status: 1,
  },
  //退款
  onRefund(e) {
    var list = this.data.arry.orderList;
    var order_id = list.order_id;
    var refund_type = list.pay_type;
    wx.navigateTo({
      url: '/pages/user/shop/refund/refund?order_id=' + order_id + '&refund_type=' + refund_type,
    })
  },

  //预览
  onLook(e) {
    var url = e.currentTarget.dataset.url;
    this.toast();
    wx.downloadFile({
      url: this.data.url + url,
      success: (res => {
        copyText(this.data.url + url);
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: (res => {
            Toast.clear();
          }),
          fail: (err => {
            wx.downloadFile({
              url: getApp().globalData.icon_Url + url,
              success: (res => {
                copyText(getApp().globalData.icon_Url + url);
                const filePath = res.tempFilePath
                wx.openDocument({
                  filePath: filePath,
                  success: (res => {
                    Toast.clear();
                  }),
                  fail: (res => {
                    wx.previewImage({
                      current: getApp().globalData.icon_Url + url,
                      urls: [getApp().globalData.icon_Url + url],
                      success: (res => {
                        Toast.clear();
                        copyText(getApp().globalData.icon_Url + url);
                      }),
                      fail: (res => {
                        Toast.clear();
                        this.notify('打开失败')
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  },

  toast() {
    Toast.loading({
      message: '加载中...',
      duration: 0,
    });
  },
  notify(e) {
    Notify({
      text: e,
      duration: 5000,
      selector: '#custom-selector',
      backgroundColor: '#f44',
      color: '#fff',
    });
  },
  getDt(e) {
    this.toast();
    var token = wx.getStorageSync('token');
    var userid = wx.getStorageSync('userid');
    NetworkRequest({
      url: '/order/orderDetail',
      data: {
        token: token,
        user_id: userid,
        order_id: e,
      },
      method: 'POST',
    }).then(res => {
      var list = res.data.data;
      var code = res.data.code;
      if (code == 1) {
        if (JSON.parse(list.orderList.price) && !list.orderList.price == '0.00') {
          list.orderList.price = JSON.parse(list.orderList.price).toFixed(2);
        } else {
          list.orderList.price = list.orderList.price.toFixed(2);
        };
        if (JSON.parse(list.orderList.coupon) && !list.orderList.coupon == '0.00') {
          list.orderList.coupon = JSON.parse(list.orderList.coupon).toFixed(2);
        } else {
          list.orderList.coupon = list.orderList.coupon.toFixed(2);
        };
        if (JSON.parse(list.orderList.total_price) && !list.orderList.total_price == '0.00') {
          list.orderList.total_price = JSON.parse(list.orderList.total_price).toFixed(2);
        } else {
          list.orderList.total_price = list.orderList.total_price.toFixed(2);
        };
        for (var i = 0; i < list.recommend.length; i++) {
          list.recommend[i].total = JSON.parse(list.recommend[i].price).toFixed(2)
        }
        this.setData({
          arry: list,
        })
      }
      if (code == 2) {
        this.notify(res.data.msg);
        setTime().then(res => {
          wx.navigateTo({
            url: '/pages/user/log_on/log_on',
          })
        })
      }
      wx.stopPullDownRefresh();
      Toast.clear();
    }).catch(err => {
      Toast.clear();
      
      wx.stopPullDownRefresh();
    })
  },
  onType(e) {
    var brand_upload = this.data.arry.brand_upload;
    if (brand_upload) {
      if (brand_upload.three_brand) {
        wx.setStorageSync('arry', brand_upload.three_brand);
        wx.navigateTo({
          url: '/pages/user/my_order/order_progress/order_progress?type=' + 0,
        })
      }
    } else {
      Toast('暂无商品类别')
    }
  },
  onGuanlian(e) {
    var relevanceOrder = this.data.arry.relevanceOrder;
    if (relevanceOrder.length == 0 || !relevanceOrder) {
      Toast('暂无关联订单')
    } else {
      wx.setStorageSync('arry', this.data.arry.relevanceOrder);
      wx.navigateTo({
        url: '/pages/user/my_order/order_progress/order_progress?type=' + 1,
      })
    }
  },
  onProgress(e) {
    wx.setStorageSync('arry', this.data.arry.orderStatus);
    wx.navigateTo({
      url: '/pages/user/my_order/order_progress/order_progress?type=' + 2,
    })
  },
  onDt(e) {
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: "/package/component/pages/services/dt/dt?id=" + id + '&open=' + false + '&key=' + title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      click_type: options.click_type
    })
    if (options.id) {
      this.getDt(options.id);
      this.data.id = options.id;
    } else {
      this.getDt(this.data.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.status == 2) {
      this.notify('文件链接已复制，您可以粘贴发送至微信或使用浏览器进行下载');
    }
    setTime(500).then(res => {
      this.data.status = 1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getDt(this.data.id);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})