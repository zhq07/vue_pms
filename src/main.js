import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入echarts
import Echarts from 'echarts'
// 引入highcharts
import Highcharts from '@/assets/js/highcharts-gantt'

Vue.use(ElementUI)

Vue.prototype.$echarts = Echarts
Vue.prototype.$highcharts = Highcharts

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8082/pms'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
