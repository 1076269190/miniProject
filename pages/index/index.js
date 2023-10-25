// index.js

// 获取应用实例
const app = getApp()

Page({
    data: {
        userId: 'wx1234',
        text: '预约',
    },
    onLoad() {
        wx.cloud.init({
            env: 'test-4gfl3autd3b5e805',
        })
    },
    goToBooking: async function() {
        const db = wx.cloud.database()
        const booking = await db.collection('booking').get()
        const bookingList = booking.data
        if(bookingList.find(item => item.userId === this.data.userId)) {
            return
        }
        let isNoBookingCount = 0;
        bookingList.forEach(item => {if(item.isBooking === false) {
            isNoBookingCount++
        }})
        if(isNoBookingCount > 0) {
            const bookingItem = bookingList.find(item => item.isBooking === false)
            const bookingItemId = bookingItem._id
            wx.showLoading({
                title: '加载中',
            })
            await db.collection('booking').doc(bookingItemId).update({data: {isBooking: true, userId: this.data.userId}}).then(res => {
                wx.hideLoading()
                if(isNoBookingCount === 1) {
                    this.setData({
                        text: '已预约完',
                    })
                }
            })
        }
    },
    setText: function () {
        wx.getUserProfile({
            desc: '用于测试',
            success: (res) => {
                console.log(res)
            }
        });
        this.setData({
            text: "success"
        })
    }
})