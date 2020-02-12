<template>
<div v-if="products.length>0">
  <h3>Hot Offers</h3>
<div class="owl-carousel owl-theme owl-loaded">
    <div class="owl-stage-outer">
        <div class="owl-stage">
            <div class="owl-item" v-for="(p,ix) in products" :key="ix">
              <product-card-fashion v-if="p" :product="p"></product-card-fashion>
            </div>
        </div>
    </div>
</div>

    <!-- <div v-if="products.length>0">
      <h3>Hot Offers</h3>
      <v-layout row wrap justify-center v-if="!initialSpin" class="owl-carousel2 owl-theme"> -->
        <!-- <v-flex lg2 sm4 xs6 v-for="(p,ix) in products" :key="ix"  style="padding:5px;overflow:hidden;"> -->
        <!-- <v-flex lg3 sm6 xs12 class="item" v-for="(p,ix) in products" :key="ix"  style="padding:5px;overflow:hidden;">
          <product-card-fashion v-if="p" :product="p"></product-card-fashion>
        </v-flex>
      </v-layout>
    </div> -->
</div>
</template>
<script>
import productCard2 from "~/components/product-card2";
import productCardFashion from "~/components/product-card-fashion";
// import carousel from "v-owl-carousel";
export default {
  // async asyncData({ params, app }) {

  // },
  data() {
    return {
      initialSpin: false,
      products: []
    };
  },
  methods: {
    async loadProducts() {
      try {
        let q = { limit: 20, skip: 0, where: { sale: true } };
        if (this.$store.state.settings.enableZips)
          q.where.zips = this.$store.state.user.zipcode; // Zip filter
        let products = await this.$axios.$get("products", {
          params: q
        });
        this.products = products;
      } catch (e) {}
    },
    installOwlCarousel() {
      $(".owl-carousel").owlCarousel({
        nav: true,
        dots: true,
        margin: 10,
        // lazyLoad: true,
        responsiveClass: true,
        responsive: {
          // breakpoint from 0 up
          0: {
            items: 1,
            nav: true,
            dots: true
          },
          // breakpoint from 480 up
          480: {
            items: 3,
            nav: true,
            dots: true
          },
          // breakpoint from 768 up
          768: {
            items: 4,
            nav: true,
            dots: true
          },
          // breakpoint from 1920 up
          1921: {
            items: 7,
            nav: true,
            dots: true
          }
        },
        navText: [
          `<i class="icon material-icons">chevron_left</i>`,
          `<i class="icon material-icons">chevron_right</i>`
        ]
        // navigationText: [
        //   "<i class='fa fa-long-arrow-left'></i>",
        //   "<i class='fa fa-long-arrow-right'></i>"
        // ]
      });
    }
  },
  // async created() {

  // },
  async mounted() {
    let vm = this;
    await this.loadProducts();
    this.$nextTick(() => {
      vm.installOwlCarousel();
    });
  },
  components: { productCardFashion }
};
</script>
<style>
</style>

