import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import { ANALYTICS_TRACKING_ID } from "@/config";
Vue.use(VueAnalytics, {
  id: ANALYTICS_TRACKING_ID
})