<template>
  <v-app>
    <WineHeader stick="true"/>
    <div class="main_content_checkout">
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
  components: { WineHeader, WineFooter, Cart }
};
</script>
<style lang="scss">
@import "../assets/scss/_variables";
@import "../assets/scss/style";
.main_content_checkout {
  padding-top: 80px;
  min-height: 500px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background: white;

  &.boxed {
    max-width: 1300px;
    margin: 0 auto;
    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15),
      0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  }
}
#cookie_alert_wrapper {
  position: fixed;
  z-index: 99999;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding-top: 10px;
  .cookie_content {
    padding: 10px;
  }
}
</style>
