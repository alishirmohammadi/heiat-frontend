import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import "./utils/filters"
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-v4-rtl/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.css'
import './assets/Vazir/Farsi-Digits/css/style.css'
import 'font-awesome/css/font-awesome.css';
import './omid.css';
import PDatePicker from 'vue2-persian-datepicker'
import Vuelidate from 'vuelidate'
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import wysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";

Vue.use(wysiwyg, {});
Vue.use(VuejsDialog);
Vue.use(BootstrapVue);
Vue.component('pdatepicker', PDatePicker)
Vue.use(Vuelidate)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
