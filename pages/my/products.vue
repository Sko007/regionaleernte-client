<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <v-container>
      <purchased-products api="orders/my"/>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import PurchasedProducts from "@/components/PurchasedProducts";

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
        { text: "My Purchased Products", disabled: true }
      ]
    };
  },
  methods: {},
  components: {
    Breadcrumb,
    PurchasedProducts
  },
  layout: "checkout",
  head() {
    return {
      title: "View/Review purhcased products",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Here at orders purchased products page you will be able to track and give reviews to your products."
        }
      ]
    };
  }
};
</script>
