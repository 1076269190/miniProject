// app.js
App({
  onLaunch() {
      if(!wx.cloud) {
        console.error('请使用2.2.3或以上基础库以使用云能力');
      } else {
        wx.cloud.init({
        env: 'test-4gfl3autd3b5e805',
        });
        const db = wx.cloud.database();
        this.globalData = {
            db
        };
      }
      this.globalData = this.globalData || {};
  },
  globalData: {}
})
