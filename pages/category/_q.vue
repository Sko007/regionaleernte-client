<template>
  <div>
    <div class="img-holder" v-if="category && category.children.length>0">
      <img v-if="category.children[0].img" :src="'/'+category.children[0].img" height="100px;" alt="" />
      <!-- <img v-else height="100px;" alt=""/> -->
      <center>
        <h1>{{category.children[0].name}}</h1>
      </center>
    </div>
    <div v-infinite-scroll="loadMore" :infinite-scroll-distance="3" :infinite-scroll-immediate-check="true">
      <v-layout column justify-center align-center>
        <v-flex>
          <img v-if="initialSpin" src="/loading.svg" alt="loading ..." />
        </v-flex>
        <v-layout v-if="!initialSpin && products && products.length==0">
          <v-container>
            <v-layout align-center>
              <v-flex text-xs-center>
                <h5 class="display-1">
                  <v-icon size="72">warning</v-icon>We are adding more products to {{$route.params.q}} category!</h5>
                <p>Please do come back again!</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-layout>
      </v-layout>
      <v-layout row wrap justify-center v-if="!initialSpin">
        <v-flex lg2 sm4 xs6 v-for="(p,ix) in products" :key="ix" style="padding:5px;overflow:hidden;">
          <product-card-fashion v-if="p" :product="p"></product-card-fashion>
        </v-flex>
      </v-layout>
      <img v-if="loadmoreSpin" src="/loading.svg" alt="loading ..." />
    </div>
  </div>
</template>

<script>
import productCardFashion from "@/components/product-card-fashion";
import { recordsPerScroll } from "~/config";
import { isNull } from "lodash";

export default {
  layout: 'wine',
  async asyncData({ params, app }) {
    try {
      if (params.q === "null" || isNull(params.q)) params.q = "";
      let category = await app.$axios.$get("categories/details", {
        params: {
          where: { slug: params.q }
        }
      });
      let products = await app.$axios.$get("products", {
        params: {
          limit: recordsPerScroll,
          skip: 0,
          where: { category: params.q }
        }
      });
      return { products, category };
    } catch (e) {}
  },
  data() {
    return {
      q: "",
      skip: recordsPerScroll,
      busy: false,
      initialSpin: false,
      loadmoreSpin: false,
      meta: {
        skip: 0,
        limit: recordsPerScroll,
        sort: "-updatedAt",
        search: "",
        category: ""
      },
      products: []
    };
  },
  components: {
    productCardFashion
  },

  methods: {
    async getData(scrolled) {
      if (this.meta.busy || this.meta.end) return;
      if (scrolled) {
        this.loadmoreSpin = true;
        this.meta.skip = parseInt(this.meta.skip) + parseInt(this.meta.limit);
      }
      let params = {};
      params.limit = this.meta.limit || recordsPerScroll || 0;
      params.skip = this.meta.skip || 0;
      params.search = this.meta.search || "";
      params.category = this.meta.category || "";
      params.sort = this.meta.sort || "name";
      params.type = this.meta.type || {};
      try {
        this.meta.busy = true;
        let data = await this.$axios.$get("products", { params });
        this.meta.busy = false;
        this.loadmoreSpin = false;
        if (data) {
          this.meta.filtered = parseInt(data.length) + parseInt(this.meta.skip);
          this.products = scrolled ? this.products.concat(data) : data;
          if (data.length >= params.limit) {
            // this.meta.skip = this.meta.filtered;
            this.meta.end = false;
          } else {
            this.meta.end = true;
          }
        }
      } catch (e) {}
    },
    loadMore() {
      this.getData(true);
    }
  },
  head() {
    return {
      title: "Product Categories",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "All product categories with fashion for Men, Women, Kids"
        }
      ]
    };
  }
  // async created() {
  // this.loadProducts();
  // }
};
</script>
<style scoped>
.img-holder {
  width: 100vw;
  position: relative;
  display: inline-block;
}
.img-holder img {
  width: 100vw;
  overflow: hidden;
  display: block;
  opacity: 0.7;
  filter: alpha(opacity=70); /* For IE8 and earlier */
}
.img-holder h2 {
  background: rgb(0, 0, 0); /* fallback color */
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translate(0, -50%);
  text-align: center;
  color: #fff;
  text-shadow: 0 0 1px;
  font: bold 24px/45px Helvetica, Sans-Serif;
  letter-spacing: -1px;
}
</style>
