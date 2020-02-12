<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <v-container grid-list-lg fluid class="mb0">
      <v-layout row wrap>
        <v-flex>
          <summary-card
            :text1="$t('My Orders')"
            :value1="Totalorders.length"
            url="/my/orders"
            color="orange"
            icon="history"
            text2="Completed Orders"
            :value2="Totalorders.length"
          />
        </v-flex>
        <v-flex>
          <summary-card
            :text1="$t('My Reviews')"
            :value1="Totalreviews.length"
            url="/my/reviews"
            color="blue"
            icon="star"
          />
        </v-flex>
        <v-flex>
          <summary-card
            :text1="$t('Purchased Products')"
            :value1="PurchasedProducts.length"
            url="/my/products"
            color="pink"
            icon="shopping_cart"
          />
        </v-flex>
        <v-flex>
          <summary-card
            :text1="$t('My Address')"
            :value1="TotalAddresses.length"
            url="/my/address"
            color="green"
            icon="location_on"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import SummaryCard from "@/components/SummaryCard";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  layout: "checkout",
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  data: () => {
    return {
      Totalwish: [],
      Totalorders: [],
      TotalAddresses: [],
      Totalreviews: [],
      PurchasedProducts: [],
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", disabled: true }
      ]
    };
  },
  async created() {
    try {
      // this.Totalwish = await this.$axios.$get("wishlists/my", {
      //   params: { sort: "-createdAt" }
      // });
      this.TotalAddresses = await this.$axios.$get("addresses/my", {
        params: { sort: "-created_at" }
      });

      this.Totalorders = await this.$axios.$get("orders/my", {
        params: { sort: "-createdAt" }
      });

      // get purchased products from orders
      for (let i in this.Totalorders) {
        let order = this.Totalorders[i];
        // filter order with status(if this order is delivered and not canceled).
        // Right now check order if it's not canceled(temporary).
        if (order.status != "Cancellation Requested") {
          let items = order.items;
          // check if item product is already in 'this.products' variable
          for (let j in items) {
            let item = items[j];
            let isExisted = false;
            for (let k in this.PurchasedProducts) {
              let product = this.PurchasedProducts[k];
              if (product.productId == item.productId) {
                isExisted = true;
                break;
              }
            }
            if (!isExisted) {
              item.orderDate = order.createdAt;
              this.PurchasedProducts.push(item);
            }
          }
        }
      }

      this.Totalreviews = await this.$axios.$get("reviews/my", {
        params: { sort: "-createdAt" }
      });
    } catch (e) {
      this.$store.commit("setErr", e.response);
      // console.log("my, index.vue", e);
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    }
  },
  components: { Breadcrumb, SummaryCard },
  head() {
    return {
      title: "Dashboard",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "This dashboard page contains the list of pages that you have access to"
        }
      ]
    };
  }
};
</script>
