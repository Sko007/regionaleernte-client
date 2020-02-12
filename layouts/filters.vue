<template>
  <v-app>
    <Header/>
    <v-content>
      <nuxt />
    </v-content>
    <Cart/>
    <Footer/>
  </v-app>
</template>
<script>
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Cart from "~/components/Cart";

export default {
  data() {
    return {};
  },
  components: { Header, Footer, Cart }
};
</script>
