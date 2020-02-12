<template>
  <v-app>
    <WineHeader stick="true"/>
    <div class="main_content_account">
      <nuxt/>
    </div>
    <Cart/>
    <WineFooter/>
  </v-app>
</template>

<script>
import WineHeader from "~/components/WineHeader.vue";
import WineFooter from "~/components/WineFooter.vue";
import Cart from "~/components/Cart";

export default {
  data() {
    return {};
  },
  components: {
    WineHeader,
    WineFooter,
    Cart
  }
};
</script>
<style lang="scss">
@import "../assets/scss/_variables";
@import "../assets/scss/style";
.main_content_account {
  padding-top: 80px;
  min-height: 500px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background: url("../assets/images/admin_bg43.jpg") no-repeat;
  background-size: cover;
}
</style>
