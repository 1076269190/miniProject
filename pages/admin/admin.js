// pages/admin/admin.js
Page({
    data: {

    },
    onLoad(option) {
        this.getViewHeight()
        console.log(option.phoneNumber)
    },
    saoyisao: function () {
        wx.scanCode({
            success: res => {
                console.log(res);
            }
        })
    },
    getViewHeight: function () {
        wx.getSystemInfo().then(res => {
            this.setData({
                viewHeight: res.windowHeight
            })
        })
    },
})