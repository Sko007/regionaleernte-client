<template>
<div>
  <v-carousel hide-delimiters class="promo">
    <v-carousel-item v-for="(item,i) in brands" :src="item.src" :key="i"></v-carousel-item>
  </v-carousel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      brands: [
        {
          src: "/slider/1.jpg"
        },
        {
          src: "/slider/2.jpg"
        },
        {
          src: "/slider/3.jpg"
        }
      ]
    };
  },
  async created() {
    // this.loadProducts();
  }
};
</script>
<style scoped>
.promo {
  max-height: 250px;
}
</style>
