<template>
  <div style="margin: 0px;" class="grey lighten-3">
    <!-- style="height:300px" -->
    <v-card class="product-card" v-if="selectedVariant">
      <lazy-component @show="afterImageLoaded" v-if="selectedVariant.img">
        <v-img
          v-if="!selectedVariant.img[0]"
          :src="'/product-placeholder.svg'"
          height="140px"
          contain
        ></v-img>
        <v-img
          v-else
          :src="'/groceries/'+ product.category +'/' + selectedVariant.img[0]"
          height="140px"
          contain
        ></v-img>
      </lazy-component>
      <!-- <v-container fluid grid-list-sm> -->
      <v-layout column style="text-align:center">
        <div>
          <span>
            <strong>{{selectedVariant.price | currency}}</strong>
          </span>
          <span
            v-if="selectedVariant.price < +selectedVariant.mrp"
            style="margin-left:5px;text-align: center;"
          >
            (
            <span style="text-decoration: line-through;">{{selectedVariant.mrp | currency}}</span>)
          </span>
        </div>
        <div class="name">{{product.name | truncate(60)}}</div>
        <div v-if="product.excerpt">
          <span v-html="$options.filters.truncate(product.excerpt,25)"></span>
        </div>
        <span
          class="bestseller-badge white--text flex"
          v-if="(selectedVariant.mrp - selectedVariant.price) >0"
        >
          <div>
            <v-icon style="font-size:14px;" dark>local_offer</v-icon>
          </div>
          <div>{{Math.round((((selectedVariant.mrp- selectedVariant.price)/selectedVariant.mrp)*100),2)}}% Off</div>
        </span>
      </v-layout>
      <v-layout row align-center>
        <v-flex class="text-xs-center">
          <v-btn
            v-if="!checkCart({_id:product._id, vid:selectedVariant._id})"
            @click="addToCart({product, variant:selectedVariant,qty:1});"
            aria-label="Add to Cart"
            icon
            color="primary"
          >
            <v-icon>add</v-icon>
          </v-btn>

          <div v-else>
            <v-btn icon @click="addToCart({product, variant:selectedVariant,qty:-1});">
              <v-icon>remove</v-icon>
            </v-btn>
            {{getQty({_id:product._id,vid:selectedVariant._id})}}
            <v-btn icon @click="addToCart({product, variant:selectedVariant,qty:1});">
              <v-icon>add</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
      <div v-if="product.variants && product.variants[1]" class="text-xs-center">
        <div style="font-size:12px;">See other {{product.variants.length}} variants</div>
        <div class="variants">
          <span v-for="v in product.variants" :key="v._id">
            <v-chip
              class="variant-chip"
              text-color="white"
              :class="{'blue darken-3': v._id===selectedVariant._id}"
              @click="select(v)"
            >{{v.size}}</v-chip>
          </span>
        </div>
        <br>
      </div>
      <div v-else>
        <br>
      </div>
      <!-- </v-container> -->
    </v-card>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      selectcart: false,
      selectedVariant: {}
    };
  },
  methods: {
    ...mapActions({
      addToCart: "cart/addToCart"
    }),
    select(s, ind) {
      this.selectedVariant = s;
    },
    afterImageLoaded(component) {}
  },
  props: ["product"],
  computed: {
    ...mapState({
      shipping: state => state.shipping || {},
      totalAmount: state => state.cart.totalAmount || 0,
      cartItems: state => state.cart.items || []
    }),
    ...mapGetters({
      cartProducts: "cartProducts",
      itemsQty: "itemsQty",
      total: "total",
      checkCart: "cart/checkCart",
      getQty: "cart/getQty"
    })
  },
  created() {
    if (this.product && this.product.variants)
      this.selectedVariant = this.product.variants[0];
  }
};
</script>
<style scoped>
.name {
  /* font-size: 12px; */
}
.bestseller-badge {
  position: absolute;
  top: 0px;
  border-radius: 10px;
  background-color: #e936ef;
  color: #fff;
  font-size: 0.7em;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80px;
  text-transform: titlecase;
  font-weight: 600;
  letter-spacing: 0.1em;
  overflow: hidden;
  height: 15px;
  -webkit-transition: all 0.35s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition: all 0.35s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  -webkit-box-shadow: 0 2px 7px rgba(0, 0, 0, 0.48);
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.48);
}
.flex {
  display: flex;
  justify-content: center;
  text-align: center;
  /* font-size: 10px; */
}
.variants {
  display: none;
  /* position: absolute;
  bottom: -20px;
  z-index: 10000; */
}
.product-card:hover .variants {
  display: inline !important;
}
.variants:hover {
  display: inline !important;
}
.variant-chip {
  height: 30px;
  cursor: pointer;
}
</style>


