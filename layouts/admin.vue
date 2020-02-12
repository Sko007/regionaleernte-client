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
  components: {
    WineHeader,
    WineFooter,
    Cart
  },
  computed: {},
  methods: {},
  created() {}
};
</script>
