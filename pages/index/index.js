// index.js

// 获取应用实例
const app = getApp()

Page({
    data: {
        bookingDataPicker: {
            bookingArray: [
                ['12月1日', '12月2日', '12月3日'],
                ['9:00-10:00', '10:00-11:00'],
            ],
            bookingIndex: [0, 0],
            bookingRealArray: ['9:00-10:00', '10:00-11:00'],
        },
        phoneNumber: '1234',
        bookingBtn: {
            text: '预约',
            disable: false,
        },
    },
    onLoad() {
        this.getViewHeight();
        this.checkBooking();
        this.initBookingNumberCount(this.data.bookingDataPicker.bookingArray[0][0]);
    },
    getViewHeight: function () {
        wx.getSystemInfo().then(res => {
            this.setData({viewHeight: res.windowHeight})
        })
    },
    checkBooking: function () {
        const {
            db
        } = getApp().globalData;
        let bookingList = [];
        db.collection('booking').get().then(res => {
            bookingList = res.data
        }).then(res => {
            if (bookingList?.length && bookingList.find(item => item.phoneNumber === this.data.phoneNumber)) {
                this.setData({
                    bookingBtn: {
                        text: '已预约',
                        disable: true
                    }
                })
            }
        })
    },
    goToBooking: async function () {
        const {
            db
        } = getApp().globalData;

        await db.collection('booking').add({
            data: {
                phoneNumber: this.data.phoneNumber,
                date: new Date(),
                bookingDate: this.data.bookingDataPicker.bookingArray[0][this.data.bookingDataPicker.bookingIndex[0]],
                bookingTime: this.data.bookingDataPicker.bookingRealArray[this.data.bookingDataPicker.bookingIndex[1]],
            }
        }).then(res => {
            wx.hideLoading()
            this.setData({
                bookingBtn: {
                    text: '已预约',
                    disable: true
                },
            })
        })
    },
    getPhoneNumber(e) {
        console.log(e.detail.code) // 动态令牌
        console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
        console.log(e.detail.errno) // 错误码（失败时返回）
        if (this.data.phoneNumber) {
            this.goToBooking()
        }
    },
    changeBookingNumberCount: async function (date) {
        let bookingDataPicker = this.data.bookingDataPicker;
        let countList = [];
        for (let i = 0; i < bookingDataPicker.bookingRealArray.length; i++) {
            countList.push(await this.getBookingNumberCount(date, bookingDataPicker.bookingRealArray[i]))
        }
        let newBookingArray = [...this.data.bookingDataPicker.bookingRealArray]
        for (let i = 0; i < countList.length; i++) {
            newBookingArray[i] = newBookingArray[i] + '已预约' + countList[i] + '人'
        }
        return newBookingArray;
    },
    initBookingNumberCount: async function (date) {
        const newBookingArray = await this.changeBookingNumberCount(date)
        this.setData({
            bookingDataPicker: {
                bookingRealArray: this.data.bookingDataPicker.bookingRealArray,
                bookingIndex: this.data.bookingDataPicker.bookingIndex,
                bookingArray: [this.data.bookingDataPicker.bookingArray[0], newBookingArray]
            }
        })
    },
    bindMultiPickerChange: async function (e) {
        // this.data.bookingDataPicker.bookingIndex = e.detail.value
        this.setData({
            bookingDataPicker: {
                bookingRealArray: this.data.bookingDataPicker.bookingRealArray,
                bookingIndex: e.detail.value,
                bookingArray: this.data.bookingDataPicker.bookingArray
            }
        })
        console.log('picker发送选择改变，携带值为', e.detail.value)
    },
    getBookingNumberCount: async function (date, time) {
        const {
            db
        } = getApp().globalData;
        const count = await db.collection('booking').where({
            bookingDate: date,
            bookingTime: time
        }).count()
        return count?.total ?? 0
    },
    bindMultiPickerColumnChange: async function (e) {
        if (e.detail.column === 1) {
            return
        }
        // this.initBookingNumberCount(e.detail.value)
        const newBookingArray = await this.changeBookingNumberCount(this.data.bookingDataPicker.bookingArray[0][e.detail.value])
        this.setData({
            bookingDataPicker: {
                bookingRealArray: this.data.bookingDataPicker.bookingRealArray,
                bookingIndex: [e.detail.value, this.data.bookingDataPicker.bookingIndex[1]],
                bookingArray: [this.data.bookingDataPicker.bookingArray[0], newBookingArray]
            }
        })
    }
})