<template>
  <div>
    <Breadcrumb :items="breadcrumb" />
    <v-container grid-list-lg class="mb0">
      <h1>Brands</h1>
      <v-layout row wrap>
        <v-flex md3 xs6 v-for="i in brands" :key="i._id">
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{i.name}}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
  layout: 'wine',
  async asyncData({ params, app }) {
    try {
      const brands = await app.$axios.$get("brands", {
        params: { sort: -name }
      });
      return { brands };
    } catch (e) {}
  },
  data() {
    return {
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Brands", disabled: true }
      ]
    };
  },
  head() {
    return {
      title: "List of all Brands in our product list"
    };
  },
  components: { Breadcrumb }
};
</script>
<style scoped>
ul {
  list-style: none;
}
a {
  text-decoration: none;
}
</style>
