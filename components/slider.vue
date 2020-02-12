
<template>
  <div>
    <div class="owl-carousel owl-theme owl-loaded" v-if="$store.state.settings.banners">
      <div class="owl-stage-outer">
        <div class="owl-stage">
          <div class="owl-item" v-for="(item,i) in $store.state.settings.banners.slider" :key="i">
            <img class="owl-lazy" :data-src="'/'+item.image" alt="banners" />
          </div>
        </div>
      </div>
    </div>
    <!-- <v-carousel class="h400" v-if="$store.state.settings.banners" hide-delimiters>
  <lazy-component @show="handler">
      <v-carousel-item v-for="(item,i) in $store.state.settings.banners.slider" :src="'/'+item.image" :key="i"></v-carousel-item>
  </lazy-component>
    </v-carousel> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    // handler(component) {
    //   console.log("this component is showing");
    // },
    installOwlCarousel() {
      $(".owl-carousel").owlCarousel({
        nav: false,
        dots: false,
        margin: 10,
        lazyLoad: true,
        responsiveClass: true,
        items: 1
      });
      //Go through each carousel on the page
      // $(".owl-carousel").each(function() {
      //   //Find each set of dots in this carousel
      //   $(this)
      //     .find(".owl-dot")
      //     .each(function(index) {
      //       //Add one to index so it starts from 1
      //       $(this).attr("aria-label", index + 1);
      //     });
      // });
    }
  },
  async created() {
    let vm = this;
    this.$nextTick(() => {
      vm.installOwlCarousel();
    });
  }
};
</script>

<style scoped>
.h400 {
  max-height: 40vh;
}
</style>
