<template>
  <v-navigation-drawer temporary fixed :right="true" v-model="showCart2">
    <v-app class="height">
      <v-toolbar class="white">
        <v-toolbar-title>{{$t('Your Shopping Cart')}} ({{ getTotalCount }})</v-toolbar-title>
      </v-toolbar>
      <div class="cart-content">
        <v-list two-line>
          <template v-for="(item, ix) in cartItems">
            <v-list-tile avatar :key="item.ix">
              <v-list-tile-avatar>
                <img
                  v-if="item.img"
                  :src="'/' + item.img"
                  @click="go('/store/'+item.vendorId+'/'+item.productId)"
                  style="cursor:pointer"
                >
              </v-list-tile-avatar>
              <v-list-tile-content>
                <router-link :to="'/store/'+item.vendorId+'/'+item.productId">
                  <v-list-tile-title class="product-name">{{item.name}}</v-list-tile-title>
                </router-link>
                <v-list-tile-sub-title>
                  <b class="price">{{item.hot ? item.sellingPrice : item.originalPrice | currency}}</b>
                  x {{item.qty}}
                  <v-btn
                    color="primary"
                    icon
                    small
                    dark
                    @click="addMoreToCart({product:item, variant:{_id:item.vid},qty:-1});"
                  >
                    <v-icon>remove</v-icon>
                  </v-btn>
                  <v-btn
                    color="green"
                    icon
                    small
                    dark
                    @click="addMoreToCart({product:item, variant:{_id:item.vid},qty:1});"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :inset="true" :key="ix"></v-divider>
          </template>
        </v-list>
        <br>
        <br>
        <v-layout column class="pl-2">
          <!-- <v-flex v-if="getSubtotal>0">
            <p>Available Delivery Services</p>
            <v-radio-group :value="selectedService" @change="updateSelectedService">
              <v-radio
                v-for="(service, key) in selectedVendor.deliveryServices"
                :key="key"
                :label="service"
                :value="service"
              ></v-radio>
            </v-radio-group>
          </v-flex>-->
          <v-flex>
            <!-- <div>
              Sub-total:
              <span class="pull-right">{{ getSubtotal | currency }}</span>
            </div>
            <div>
              Delivery costs:
              <span class="pull-right">{{ getShippingCost | currency }}</span>
            </div>
            <div v-if="getSubtotal>0">
              <span class="total">Total:</span>
              <span class="total pull-right">{{ getTotalCost | currency }}</span>
            </div>-->
            <div v-if="getSubtotal>0" class="total">
              <span>{{$t('Total Cost')}}: {{ getSubtotal | currency }}</span>
            </div>
          </v-flex>
          <v-flex class="btn_checkout">
            <v-btn v-if="getSubtotal>0" @click="go('/checkout')" color="primary" class="btn_cart">
              <v-icon>shopping_cart</v-icon>
              {{$t('Checkout')}}
            </v-btn>
            <v-btn @click="go('/wine');showCart2 = false" color="primary" class="btn_cart">
              <v-icon>add</v-icon>
              {{$t('Add more items')}}
            </v-btn>
            <br>
            <!-- <v-btn v-if="getSubtotal>0" color="error" @click="clearCart" class="btn_cart">
              <v-icon>replay</v-icon>
              {{$t('Clear Cart')}}
            </v-btn>-->
          </v-flex>
        </v-layout>
      </div>
    </v-app>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      // selectedService: null,
    };
  },
  computed: {
    showCart2: {
      get: function() {
        return this.showCart;
      },
      set: function(newValue) {
        this.$store.commit("cart/toggleCart", newValue);
      }
    },
    getShippingCost() {
      // reset shipping cost
      let shippingCost = 0;

      // If current product has specific shipping cost, set it as a shipping cost. If not, set vendor shipping cost as a shipping cost
      if (this.getShippingAmount > 0) {
        shippingCost = this.getShippingAmount;
      } else {
        shippingCost = this.selectedVendor.shippingCost;
      }

      // if selectedService is null or 'click and collect', set shipping cost to 0
      if (
        this.selectedService == "Selbstabholung" ||
        this.selectedService == null ||
        this.selectedService == ""
      ) {
        shippingCost = 0;
      }

      // if totalcost is greater than free amount limit, set is as 0
      if (
        this.selectedService == "Versand" &&
        this.getSubtotal >= this.selectedVendor.freeAmountForShipping
      ) {
        shippingCost = 0;
      }

      this.$store.commit("cart/saveShippingAmount", shippingCost);
      return shippingCost;
    },
    getTotalCost() {
      return this.getSubtotal + this.getShippingCost;
    },
    ...mapGetters({
      showCart: "cart/showCart",
      cartItems: "cart/getItems",
      getQty: "cart/getQty",
      getSubtotal: "cart/getSubtotal",
      getTaxes: "cart/getTaxes",
      getShippingAmount: "cart/getShippingAmount",
      getTotal: "cart/getTotal",
      checkCart: "cart/checkCart",
      getTotalCount: "cart/getTotalCount",
      getDeliveryServices: "cart/getDeliveryServices"
    }),
    ...mapState({
      selectedVendor: state => state.selectedVendor || "",
      selectedService: state => state.cart.deliveryServices
    })
  },
  methods: {
    ...mapMutations({
      toggleCart: "cart/toggleCart",
      saveShippingAmount: "cart/saveShippingAmount",
      saveDeliveryServices: "cart/saveDeliveryServices",
      clearCart: "cart/clearCart"
    }),
    ...mapActions({
      addMoreToCart: "cart/addMoreToCart"
    }),
    updateSelectedService(val) {
      this.$store.commit("cart/saveDeliveryServices", val);
    },
    go(url) {
      this.$router.push(url);
    }
  },
  watch: {
    selectedService(val) {
      this.$store.commit("cart/saveDeliveryServices", val);
    }
  },
  created() {
    // this.selectedService = this.getDeliveryServices;
  }
};
</script>
<style scoped>
aside.v-navigation-drawer {
  z-index: 1010 !important;
}

.total {
  font-weight: bold;
  text-align: center;
}
.orange {
  background: #fc4a1a; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #f7b733,
    #fc4a1a
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #f7b733,
    #fc4a1a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.height {
  height: 90%;
}
.center {
  align-items: center;
  justify-content: center;
}
.name {
  font-size: 11px;
}
.cart-content {
  height: 80vh;
  overflow: auto;
}

.pull-right {
  float: right;
  margin-left: auto;
}

.btn_checkout {
  margin: 10px auto;
}
.product-name {
  cursor: pointer;
}
.btn_cart {
  width: 90%;
}
</style>