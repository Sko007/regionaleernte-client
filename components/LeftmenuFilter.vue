<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-layout row>
      <v-flex xs12>
        <v-toolbar class="primary" dark>
          <v-btn icon @click.stop="showCategorymenu(false)">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Filters</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <!-- Filters -->
        <v-container>
          <div v-if="fl.brands.length>0">
            Brands:
            <v-chip outline color="green" v-for="b in fl.brands" :key="b._id">
              {{b.name}}
            </v-chip>
          </div>
          <v-chip outline color="red" v-if="fl.categories.length>0" v-for="c in fl.categories" :key="c._id">
            {{c.name}}
          </v-chip>
          <div v-for="(v,k) in fl.features" :key="k">
            <div v-if="v.length>0"> {{k}}:
              <v-chip outline color="orange" v-for="f in v" :key="f._id">
                {{f}}
              </v-chip>
            </div>
          </div>
        </v-container>
        <v-card>
          <v-card-text>
            <h4 class="headline mb-0">{{$t('Adjust Price')}}</h4>
            <vue-slider v-bind="priceSliderOptions" v-model="fl.price" @drag-end="change()" v-if="!loadingPrice"></vue-slider>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text>
            <h4 class="headline mb-0">{{$t('Filter Brands')}}</h4>
            <div class="brands">
              <v-checkbox v-model="fl.brands" @change="change()" v-for="(i,ix) in brands" :key="ix" :label="i.name" :value="i" hide-details></v-checkbox>
            </div>
          </v-card-text>
        </v-card>
        <v-card v-for="(k,ix) in features" :key="ix">
          <v-card-text>
            <h4 class="headline mb-0">{{k.key}}</h4>
            <v-checkbox v-model="fl.features[k.key]" @change="change()" v-for="(i,ixi) in k.v" :key="ixi" :label="i" :value="i" hide-details></v-checkbox>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
import { mapMutations } from "vuex";
import { currency } from "@/config";
import vueSlider from "vue-slider-component";

export default {
  data() {
    return {
      currency,
      meta: {
        skip: 0,
        sort: "-updatedAt",
        search: ""
      },
      priceSliderOptions: {
        value: [1000, 5000],
        width: 280,
        min: 1,
        max: 10000,
        tooltip: "always",
        formatter: currency.symbol + "{value}",
        interval: 1
      },
      fl: {
        brands: [],
        price: [],
        categories: [],
        features: { Type: [], Fit: [], Fabric: [], Neck: [], Color: [] }
      },
      brands: [],
      features: []
    };
  },
  async created() {
    this.loadingPrice = true;
    let priceRange = await this.$axios.$get("products/priceRange");
    if (priceRange) {
      this.fl.price = [priceRange.min, priceRange.max];
    }
    this.loadingPrice = false;

    // this.flush();
    this.searchParam = this.$route.query.q;
    this.searchParam
      ? this.searchProducts(this.searchParam)
      : this.checkCategory(); // Required on keyup for search
    let count = await this.$axios.$get("products/count", {
      params: { limit: 3, sort: "-brand" }
    });
    if (count) {
      this.meta.total = count[0].count;
    }

    this.loadingBrands = true;
    this.brands = await this.$axios.$get("brands");
    this.loadingBrands = false;

    this.loadingFeatures = true;
    this.features = await this.$axios.$get("features/group");
    this.loadingFeatures = false;
  },
  components: { vueSlider },
  computed: {
    drawer: {
      get: function() {
        return this.$store.state.login.showCategories;
      },
      set: function(value) {
        this.showCategorymenu(value);
      }
    }
  },
  props: ["showDrawer"],
  methods: {
    change() {
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", this.fl);
      // this.$router.push(to);
      this.$emit("change", this.fl);
    },

    checkCategory() {
      // if (this.categoryId) {
      //   this.categoryQueried = true;
      //   this.fl.categories = [{ _id: this.categoryId, slug: this.slug }];
      //   this.filter();
      // } else {
      //   this.categoryQueried = false;
      //   this.fl.search = undefined; // Required when browse all button at search page is clicked
      //   this.filter();
      // }
    },
    go(slug) {
      this.$router.push("/category/" + slug);
    },
    ...mapMutations({
      showCategorymenu: "login/showCategorymenu"
    })
  }
};
</script>
<style scoped>
.brands {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
