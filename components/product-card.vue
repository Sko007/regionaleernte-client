<template>
  <div style="margin: auto;" class="grey lighten-3">
    <v-card>
      <v-container fluid grid-list-sm>
        <v-layout row>
          <v-flex xs4 v-if="selectedVariant">
            <lazy-component @show="afterImageLoaded">
              <v-img :data-src="'/groceries/'+ product.category +'/' + selectedVariant.img[0]" class="lazyload" height="140px" contain>
              </v-img>
            </lazy-component>
          </v-flex>
          <v-flex xs6 v-if="product.variants">
            <div style="text-overflow: ellipsis;   white-space: nowrap ">
              <span>
                <strong>{{selectedVariant.price | currency}}</strong>
              </span>
              <span v-if="selectedVariant.price < +selectedVariant.mrp" style="margin-left:5px;text-align: center;">(
                <span style="text-decoration: line-through;">{{selectedVariant.mrp | currency}}</span>)</span>

            </div>
            <v-layout row wrap flex v-if="product.variants">
              <v-flex xs12>
                <span>{{product.name}} {{selectedVariant.size}}</span>
              </v-flex>
              <v-flex xs12 sm6>

              </v-flex>
              <v-flex xs12 sm6>
                <span style="margin-left:10px;">
                  <span class="group" v-if="(selectedVariant.mrp - selectedVariant.price) >0">
                    <v-icon dark color="error">local_offer</v-icon>
                    <span>{{Math.round((((selectedVariant.mrp- selectedVariant.price)/selectedVariant.mrp)*100),2)}}% Off</span>
                  </span>
                </span>
              </v-flex>
            </v-layout>
            <div v-if="product.variants[1]">
              <div style="font-size:12px;">See other variants</div>
              <span v-for="v in product.variants" :key="v._id">
                <v-chip style="height:30px;" text-color="white" :class="{'blue darken-3': v._id===selectedVariant._id}" @click="select(v)">
                  {{v.size}}
                </v-chip>
              </span>
            </div>
          </v-flex>
          <v-flex d-flex xs2>
            <v-layout row align-center>
              <v-flex class="text-xs-center">
                <v-btn v-if="!checkCart({_id:product._id, vid:selectedVariant._id})" @click="addToCart({product:product, variant:selectedVariant,qty:1});" aria-label="Add to Cart" flat icon color="orange">
                  <v-icon>add_shopping_cart</v-icon>
                </v-btn>

                <div v-else>
                  <v-btn icon @click="addToCart({product:product, variant:selectedVariant,qty:1});">
                    <v-icon>add</v-icon>
                  </v-btn>
                  {{getQty({_id:product._id, vid:selectedVariant._id})}}
                  <v-btn icon @click="addToCart({product:product, variant:selectedVariant,qty:-1});">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
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
      itemsQuantity: "itemsQuantity",
      total: "total",
      checkCart: "cart/checkCart",
      getQty: "cart/getQty"
    })
  },
  async created() {
    if (this.product && this.product.variants)
      this.selectedVariant = this.product.variants[0];
  }
};
</script>

