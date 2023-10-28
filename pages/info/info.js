// pages/info/info.js
import drawQrcode from '../../utils/weapp.qrcode.esm.js'

drawQrcode({
    width: 200,
    height: 200,
    canvasId: 'myQrcode',
    // ctx: wx.createCanvasContext('myQrcode'),
    text: '1',
})
Page({
    data: {
        latitude: '23.1066805',
        longitude: '113.3245904',
        marker: [{
            label: {
                content: '123',
                borderWidth: 1,
                bgColor: 'white'
            },
            title:'你在哪了',//标注点名
            width: 20, //宽
            height: 30, //高
            id: 1,
            latitude: 23.1066805,
            longitude: 113.3245904,
            name: '广州塔',
            address: '广州市海珠区阅江西路222号',
        }]
    },
    onLoad() {
        this.getViewHeight()
    },
    getViewHeight: function () {
        wx.getSystemInfo().then(res => {
            this.setData({viewHeight: res.windowHeight})
        })
    },
})