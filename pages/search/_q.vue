<template>
  <div>
    <leftmenu-filter @change="filterChanged" />
    <v-layout class="elevation-3 py-2 px-1" align-center justify-space-between row wrap justify-xs-center>
      <v-flex class="text-xs-center text-md-left" v-if="loading"><img src="/loading.svg" alt="loading ..." /></v-flex>
      <v-flex class="text-xs-center text-md-left" v-else>Showing {{meta.filtered}} of {{meta.total}} products</v-flex>
      <v-flex class="text-xs-center text-md-right">Sort:
        <v-btn-toggle v-model="meta.sort" @change="sortNow()" mandatory>
          <v-btn flat :value="'name'">
            <span>A-Z</span>
            <v-icon>arrow_downward</v-icon>
          </v-btn>
          <v-btn flat :value="'-name'">
            <span>Z-A</span>
            <v-icon>arrow_upward</v-icon>
          </v-btn>
          <v-btn flat :value="'variants.price'">
            <span>{{currency.symbol}}</span>
            <v-icon>arrow_downward</v-icon>
          </v-btn>
          <v-btn flat :value="'-variants.price'">
            <span>{{currency.symbol}}</span>
            <v-icon>arrow_upward</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>
    <div v-infinite-scroll="loadMore" :infinite-scroll-distance="3" :infinite-scroll-immediate-check="true">
      <v-layout column justify-center align-center>
        <v-flex>
          <img v-if="initialSpin" src="/loading.svg" alt="loading ..." />
        </v-flex>
        <v-flex v-if="products.length===0 && !loading">
          <v-layout>
            <v-container>
              <v-layout align-center>
                <v-flex text-xs-center>
                  <h5 class="display-1">
                    <v-icon size="72">warning</v-icon>{{$route.params.q}} Product not found</h5>
                  <p>Request the product?</p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center v-if="!initialSpin">
        <v-flex xl2 lg3 sm6 xs12 v-for="(p,ix) in products" :key="ix" style="padding:5px;overflow:hidden;">
          <product-card-fashion v-if="p" :product="p"></product-card-fashion>
        </v-flex>
      </v-layout>
      <img v-if="loadmoreSpin" src="/loading.svg" alt="loading ..." />
    </div>
  </div>
</template>

<script>
import { recordsPerScroll, currency } from "~/config";
import { mapGetters } from "vuex";
import isNull from "lodash/isNull";
import each from "lodash/each";
import productCardFashion from "@/components/product-card-fashion";
import LeftmenuFilter from "@/components/LeftmenuFilter";

export default {
  async asyncData({ params, app }) {
    try {
      let products = [],
        err = null;
      if (params.q === "null" || isNull(params.q)) params.q = "";
      products = await app.$axios.$get("products", {
        params: { limit: recordsPerScroll, skip: 0, search: params.q }
      });
      return { products, err: null };
    } catch (e) {
      return { products: [], err };
    }
  },
  data() {
    return {
      fl: {},
      currency,
      q: "",
      skip: recordsPerScroll,
      busy: false,
      loading: false,
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
  computed: {
    // ...mapGetters({ loading: "loading" })
  },
  components: {
    productCardFashion,
    LeftmenuFilter
  },
  // watch: {
  //   "$route.params.q": {
  //     immediate: true,
  //     async handler(value) {
  //       // this.meta.search = value;
  //       // this.meta.skip = 0;
  //     }
  //   }
  // },
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
    async getData({ q, scrolled }) {
      // this.autocompleteSearchTest("http://admin.hopyshopy.com/api/products");
      if (this.meta.busy || this.meta.end) return;
      if (scrolled) {
        this.loadmoreSpin = true;
        this.meta.skip = parseInt(this.meta.skip) + parseInt(this.meta.limit);
      }
      q = q || {};
      q.limit = this.meta.limit || recordsPerScroll || 0;
      q.skip = this.meta.skip || 0;
      q.search = this.$route.params.q || "";
      q.sort = this.meta.sort || "name";
      q.type = this.meta.type || {};
      try {
        this.meta.busy = true;
        this.loading = true;
        let data = await this.$axios.$get("products", { params: q });
        this.meta.busy = false;
        this.loadmoreSpin = false;
        if (data) {
          this.meta.filtered = parseInt(data.length) + parseInt(this.meta.skip);
          this.products = scrolled ? this.products.concat(data) : data;
          if (data.length >= q.limit) {
            this.meta.skip = this.meta.filtered;
            this.meta.end = false;
          } else {
            this.meta.end = true;
          }
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    loadMore() {
      this.getData({ scrolled: true });
    },
    sortNow() {
      this.flush(); // To allow http get request
      // this.getData();
      this.filter();
    },
    filterChanged(fl) {
      this.fl = fl;
      // this.getData();
      this.flush();
      this.filter();
    },
    flush() {
      this.meta.end = false;
      this.meta.skip = 0;
      this.meta.limit = recordsPerScroll;
      this.products = []; // Reset query parameters
    },
    filter(q = {}, scrolled) {
      let f = [];
      if (this.fl.features) {
        each(this.fl.features, function(val, key) {
          if (val.length > 0) {
            f.push({ "features.key": key, "features.val": { $in: val } });
          }
        });
      }
      if (this.fl.brands) {
        if (this.fl.brands.length > 0) {
          let brandIds = [];
          each(this.fl.brands, function(brand) {
            brandIds.push(brand._id);
          });
          f.push({ brand: { $in: brandIds } });
        }
      }
      if (this.fl.categories) {
        this.categories = this.fl.categories;
        if (this.fl.categories.length > 0) {
          let categoryIds = [];
          each(this.fl.categories, function(category) {
            categoryIds.push(category._id);
          });
          f.push({ category: { $in: categoryIds } });
        }
      }
      if (this.fl.price && this.fl.price.length > 0) {
        f.push({
          "variants.price": { $gt: this.fl.price[0], $lt: this.fl.price[1] }
        }); // For price slider
      }
      if (this.fl.search) {
        q.search = this.fl.search; // For price slider
      }
      if (this.$store.state.settings.enableZips)
        f.push({ zips: this.$store.state.user.zipcode }); // Zip filter

      if (f.length > 0) {
        q.where = { $and: f };
      } else {
        q.where = {};
      }
      this.getData({ q, scrolled });
    }
  },
  async created() {
    try {
      this.loading = true;
      let data = await this.$axios.$get("products/count");
      if (data) {
        this.meta.total = data[0].count;
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  },
  head() {
    return {
      title: "Product search result for " + this.$route.params.q,
      meta: [
        {
          hid: "og:title",
          name: "og:title",
          property: "og:title",
          content: "Product search result for " + this.$route.params.q
        },
        {
          hid: "description",
          name: "description",
          property: "description",
          content: "Search result for " + this.$route.params.q
        },
        {
          hid: "og:description",
          name: "og:description",
          property: "og:description",
          content: "Search result for " + this.$route.params.q
        },
        {
          hid: "keyword",
          name: "keyword",
          property: "keyword",
          content: this.$route.params.q
        },
        {
          hid: "og:keyword",
          name: "og:keyword",
          property: "og:keyword",
          content: this.$route.params.q
        }
      ]
    };
  },
  layout: "filters"
};
</script>
