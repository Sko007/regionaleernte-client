<template>
  <div class="product_page">
    <WineTopBanner/>
    <WineVendor/>

    <v-container class="white">
      <v-layout row wrap justify-space-around="12px">
        <v-flex md4 class="padding-top" v-if="selectedVariant">
          <div>
            <img
              v-if="selectedVariant.img[selectedImg]"
              :src="'/'+selectedVariant.img[selectedImg]"
              class="main-image"
              alt
            >
          </div>
          <br>
          <div class="flex">
            <!-- Thumbnails -->
            <v-flex
              v-for="(g,ix) in selectedVariant.img"
              :key="ix"
              @click="selectImg(ix)"
              v-if="ix!=selectedImg"
            >
              <img
                :src="'/'+g"
                height="50px"
                v-lazy="{src:'/'+g, loading: '/'+g, error: '/450x250-err.svg'}"
                alt
              >
            </v-flex>
          </div>
        </v-flex>
        <v-flex md8>
          <v-layout row wrap>
            <v-container>
              <div>
                <h2>{{product.name}} - {{selectedVariant.size}}</h2>
                <div class="flex">
                  <div class="flex">
                    <div>{{selectedVariant.price | currency}}</div>
                    <div class="padding">
                      <strike>{{selectedVariant.mrp | currency}}</strike>
                    </div>
                    <div
                      class="green padding padding-bottom"
                      v-if="selectedVariant.mrp - selectedVariant.price>0"
                    >
                      <h5>{{Math.round((((selectedVariant.mrp- selectedVariant.price)/selectedVariant.mrp)*100),2)}}% off</h5>
                    </div>
                    <div
                      class="redd"
                      v-if="selectedVariant.trackInventory && selectedVariant.stock<5"
                    >Only {{selectedVariant.stock}} remaining</div>
                    <div class="flex" v-if="rating && rating.avg>0">
                      <v-chip small>
                        {{rating.avg}}
                        <v-icon>star</v-icon>
                      </v-chip>
                      ({{rating.count}} Ratings {{reviewCount}} reviews)
                    </div>
                    <div class="flex mute" v-else>
                      <v-icon class="mute">star</v-icon>No reviews yet
                    </div>
                  </div>
                </div>
                <v-layout row wrap class="text-md-left">
                  <div v-if="!checkCart({_id:product._id, vid:selectedVariant._id})">
                    <v-btn
                      v-if="isServiceable"
                      @click="addToCart({product, variant:selectedVariant,qty:1});"
                      color="red"
                      light
                    >
                      <v-icon>shopping_cart</v-icon>Add to cart
                    </v-btn>
                    <v-btn v-else>Not available in your location</v-btn>
                  </div>
                  <div v-else class="flex">
                    <v-btn icon @click="addToCart({product, variant:selectedVariant,qty:-1});">
                      <v-icon>remove</v-icon>
                    </v-btn>
                    {{getQty({_id:product._id,vid:selectedVariant._id})}} in cart
                    <v-btn icon @click="addToCart({product, variant:selectedVariant,qty:1});">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </div>
                  <v-flex>
                    <wish-button :variant="selectedVariant" :product="product"></wish-button>
                  </v-flex>
                </v-layout>
              </div>

              <div class="flex">
                <div v-for="v in product.variants" :key="v._id" @click="selectVariant(v)">
                  <v-chip color="primary" text-color="white" v-if="selectedVariant._id==v._id">
                    <b>{{v.size}}</b>
                  </v-chip>
                  <v-chip v-else>{{v.size}}</v-chip>
                </div>
              </div>
              <br>
              <div class="flex" v-if="product.keyFeatures.length>0">
                <v-flex md2>Highlights</v-flex>
                <v-flex md4>
                  <ul>
                    <li v-for="(k,ix) in product.keyFeatures" :key="ix">{{k.key}}: {{k.val}}</li>
                  </ul>
                </v-flex>
              </div>
              <v-flex md12 v-if="product.description">
                <div class="flex" v-if="product.vendorName">
                  Seller -
                  <div class="blue">{{product.vendorName}}</div>
                </div>
                <br>
                <h2>Description</h2>
                <p v-html="product.description"></p>
              </v-flex>
              <v-card v-if="product.features.length>0">
                <v-card-title>
                  <h2>Specification</h2>
                </v-card-title>
                <v-card-text>
                  <table>
                    <tr v-for="f in product.features" :key="f._id">
                      <td class="padding">{{f.key}}</td>
                      <td>{{f.val}}</td>
                    </tr>
                  </table>
                </v-card-text>
              </v-card>
              <reviews :product="product" :selectedVariant="selectedVariant" @err="err"></reviews>
            </v-container>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import WineTopBanner from "~/components/WineTopBanner.vue";
import WineVendor from "~/components/WineVendor.vue";

import includes from "lodash/includes";
import deals from "@/components/deals";
import sale from "@/components/sale";
import WishButton from "@/components/ProductDetail/WishButton";
import NameWeight from "@/components/ProductDetail/NameWeight";
import PriceDiscount from "@/components/ProductDetail/PriceDiscount";
import OtherAvailable from "@/components/ProductDetail/OtherAvailable";
import reviews from "@/components/reviews";
import RelatedProducts from "@/components/related-products";

export default {
  async asyncData({ params, app }) {
    try {
      const product = await app.$axios.$get("products/" + params.id);

      // console.log("detailed product");
      // console.log(product);

      return { product };
    } catch (e) {}
  },
  data() {
    return {
      selectedVariant: {},
      selectedVendor: {},
      selectedImg: 0,
      rating: null,
      vendors: this.$store.getters.vendors
    };
  },
  methods: {
    ...mapMutations(["setError"]),
    ...mapActions({ addToCart: "cart/addToCart" }),
    async loadProducts() {
      try {
        // load vendors from api
        let vendors = await this.$axios.$get("products/vendorProducts");

        // load vendor's product reviews
        try {
          for (let i = 0; i < vendors.length; i++) {
            if (vendors[i].vendor_products.length > 0) {
              let reviewSum = 0;
              let reviewCount = 0;
              for (let j = 0; j < vendors[i].vendor_products.length; j++) {
                let r = await this.$axios.$get(
                  "reviews/product/" + vendors[i].vendor_products[j]._id
                );
                if (r.length > 0) {
                  for (let k = 0; k < r.length; k++) {
                    reviewSum += r[k].rating;
                    reviewCount++;
                  }
                }
              }
              // console.log("vendor rating: ", reviewSum, reviewCount);
              if (reviewCount > 0) {
                // if there are some reviews
                vendors[i].rating = Math.round(reviewSum / reviewCount);
              } else {
                vendors[i].rating = 0;
              }
            }
          }
        } catch (err) {
          // console.log("wine.vue, load reviews: ", err);
        }

        this.vendors = vendors;

        // save vendors data to vuex store
        this.$store.commit("vendors", vendors);
      } catch (e) {}
    },
    async getReviews() {
      if (!this.product._id) return;
      try {
        let r = await this.$axios.$get("reviews/product/" + this.product._id);
        this.publishRatings(r);
        this.reviews = r;
      } catch (err) {
        this.err(err);
      }
    },
    publishRatings(r) {
      let vm = this;
      let reviewCount = 0;
      let rating = {
        r5: 0,
        r4: 0,
        r3: 0,
        r2: 0,
        r1: 0,
        count: 0,
        total: 0,
        avg: 0
      };
      r.forEach(function(i) {
        if (i.message) reviewCount++;
        if (i.rating) rating.count++;
        if (i.rating) rating.total = rating.total + i.rating;
        if (i.rating == 5) rating.r5++;
        if (i.rating == 4) rating.r4++;
        if (i.rating == 3) rating.r3++;
        if (i.rating == 2) rating.r2++;
        if (i.rating == 1) rating.r1++;
      }, this);
      this.reviewCount = reviewCount;
      if (rating.count === 0) rating.avg = 0;
      else rating.avg = Math.round((rating.total / rating.count) * 10) / 10;
      this.rating = rating;
    },
    selectVariant(s) {
      this.selectedVariant = s;
      this.selectedImg = 0;
    },
    selectImg(ix) {
      this.selectedImg = ix;
    },
    afterImageLoaded(component) {},
    err(err) {
      this.setError(err.err);
    }
  },
  computed: {
    ...mapState({
      shipping: state => state.shipping || {},
      totalAmount: state => state.cart.totalAmount || 0,
      cartItems: state => state.cart.items || [],
      zipcode: state => state.auth.zipcode
    }),
    ...mapGetters({
      cartProducts: "cartProducts",
      itemsQty: "itemsQty",
      total: "total",
      checkCart: "cart/checkCart",
      getQty: "cart/getQty",
      loading: "loading"
    }),
    isServiceable: function() {
      if (!this.product.enableZips || !this.$store.state.settings.enableZips)
        return true;
      else return includes(this.product.zips, this.zipcode);
    }
  },
  async created() {
    if (this.product && this.product.variants) {
      this.selectedVariant = this.product.variants[0];
    }

    await this.getReviews();

    if (this.vendors.length === 0) {
      await this.loadProducts();
    }

    // console.log("before", this.selectedVendor);
    if (this.vendors.length > 0) {
      for (let i = 0; i < this.vendors.length; i++) {
        if (this.vendors[i]._id == this.product.vendorId._id) {
          this.selectedVendor = this.vendors[i];
        }
      }
    }

    this.$store.commit("selectedVendor", this.selectedVendor);
  },
  components: {
    deals,
    sale,
    RelatedProducts,
    NameWeight,
    PriceDiscount,
    OtherAvailable,
    reviews,
    WishButton,
    WineTopBanner,
    WineVendor
  },
  head() {
    return {
      title: this.product.name
    };
  },
  layout: "wine"
};
</script>

<style scoped>
.btn_add_card {
  background: red;
}

.product_page {
  background: #242424;
  padding-bottom: 60px;
}

.redd {
  color: red;
}

.mute {
  color: #ccc;
}
img {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: 0;
}
.padding-left {
  padding-left: 20px;
}

.padding-top {
  padding-top: 28px;
  padding-left: 20px;
}
.main-image {
  max-width: 100%;
}
.green {
  color: rgb(80, 199, 80);
}
.blue {
  color: dodgerblue;
}

.padding-bottom {
  padding-bottom: 10px;
}
.padding {
  padding: 9px 9px 7px 9px;
}
.space-right {
  padding-right: 10rem;
}
.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: baseline;
}
.space-between {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
}
.space-around {
  justify-content: space-around;
}
.column {
  display: flex;
  flex-direction: column;
}
.padding-left {
  padding-left: 32px;
}
</style>