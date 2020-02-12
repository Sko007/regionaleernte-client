<template>
  <div>
    <div v-infinite-scroll="loadMore" :infinite-scroll-distance="3" :infinite-scroll-immediate-check="true">
      <v-layout column justify-center align-center>
        <v-flex>
          <img v-if="initialSpin" src="/loading.svg" alt="loading ..." />
        </v-flex>
        <v-flex v-if="!products || products.length==0">
          <v-layout>
            <v-container>
              <v-layout align-center>
                <v-flex text-xs-center>
                  <h5 class="display-1">
                    <v-icon size="72">warning</v-icon>{{$route.params.q}} not in stock</h5>
                  <p>Request an email notification!</p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-layout>
        </v-flex>
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
import { recordsPerScroll } from "~/config";
import { isNull } from "lodash";
import productCardFashion from "@/components/product-card-fashion";

export default {
  async asyncData({ params, app }) {
    try {
      if (params.q === "null" || isNull(params.q)) params.q = "";
      let products = await app.$axios.$get("products", {
        params: { limit: recordsPerScroll, skip: 0, search: params.q }
      });
      return { products };
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
        search: ""
      },
      products: []
    };
  },
  components: {
    productCardFashion
  },
  watch: {
    "$route.params.q": {
      immediate: true,
      async handler(value) {
        // this.meta.search = value;
        // this.meta.skip = 0;
      }
    }
  },
  methods: {
    // autocompleteSearchTest(url) {
    //   let cancel;
    //   if (cancel) {
    //     cancel();
    //     this.message = "The request cancelled";
    //   }
    //   this.message = "Request is beign executed...";
    //   axios
    //     .get(url, {
    //       cancelToken: new axios.CancelToken(function executor(c) {
    //         // An executor function receives a cancel function as a parameter
    //         cancel = c;
    //       })
    //     })
    //     .then(
    //       response => (this.message = "The response from server is:" + response)
    //     );
    // },
    async getData(scrolled) {
      // this.autocompleteSearchTest("http://admin.hopyshopy.com/api/products");
      if (this.meta.busy || this.meta.end) return;
      if (scrolled) {
        this.loadmoreSpin = true;
        this.meta.skip = parseInt(this.meta.skip) + parseInt(this.meta.limit);
      }
      let params = {};
      params.limit = this.meta.limit || recordsPerScroll || 0;
      params.skip = this.meta.skip || 0;
      params.search = this.meta.search || "";
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
  }
  // async created() {
  // this.loadProducts();
  // }
};
</script>
