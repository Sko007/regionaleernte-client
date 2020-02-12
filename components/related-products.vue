<template>
  <div v-if="products.length>0">
    <v-container fluid>
      <h3>Related Products</h3>
      <v-layout row wrap justify-center v-if="!initialSpin">
        <v-flex
          lg3
          sm6
          xs12
          v-for="(p,ix) in products"
          :key="ix"
          style="padding:5px;overflow:hidden;"
        >
          <product-card-fashion v-if="p" :product="p"></product-card-fashion>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import productCard2 from "~/components/product-card2";
import productCardFashion from "~/components/product-card-fashion";

export default {
  async asyncData({ params, app }) {
    try {
      let products = await app.$axios.$get("products", {
        params: { limit: 20, skip: 20, where: { sale: true } }
      });
      return { products };
    } catch (e) {}
  },
  data() {
    return {
      initialSpin: false,
      products: []
    };
  },
  methods: {
    async loadProducts() {
      try {
        this.products = await this.$axios.$get("products", {
          params: { limit: 20, skip: 20 }
        });
        // this.value = this.products;
      } catch (e) {
        // console.log(e.response);
      }
    }
  },
  created() {
    this.loadProducts();
  },
  components: { productCard2, productCardFashion }
};
</script>
<style>
</style>

