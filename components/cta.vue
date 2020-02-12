<template>
  <div v-if="$store.state.settings.alert && $store.state.settings.alert!==''" class="elevation-7">
    <div class="banner">
      <!-- <v-container> -->
      <v-layout column wrap class="center">
        <h1>{{$store.state.settings.alert}}</h1>
      </v-layout>
      <!-- </v-container> -->
    </div>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  data() {
    return {
      brand: {},
      sku: {},
      brands: [],
      products: []
    };
  }
};
</script>
<style scoped>
.banner h1 {
  font-size: 30px;
}
.center {
  align-items: center;
  justify-content: center;
}
.banner {
  padding-left: 20px;
  margin-top: 10px;
  max-height: 20vh;
  font-size: 1rem;
  font-weight: 900;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #bc4e9c; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #f80759,
    #bc4e9c
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #f80759,
    #bc4e9c
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>