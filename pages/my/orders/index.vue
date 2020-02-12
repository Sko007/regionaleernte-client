<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <v-container>
      <order-a api="orders/my"/>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import OrderA from "@/components/OrderA";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  async asyncData({ params, app }) {
    try {
      let orders = await app.$axios.$get("orders/my");
      return { orders };
    } catch (e) {
      // console.log(e.response);
    }
  },
  data() {
    return {
      cancelDialog: false,
      returnDialog: false,
      orders: [],
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "My Orders", disabled: true }
      ]
    };
  },
  methods: {},
  components: {
    Breadcrumb,
    OrderA
  },
  layout: "checkout",
  head() {
    return {
      title: "View/Manage past orders",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Here at orders page you will be able to track, cancel and check all order details"
        }
      ]
    };
  }
};
</script>
