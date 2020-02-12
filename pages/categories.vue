<template>
  <div>
    <Breadcrumb :items="breadcrumb" /> 
    <v-container grid-list-lg class="mb0">
      <h1>Categories</h1>
      <v-layout row wrap>
        <v-flex md3 xs6 v-for="i in categories[0].children" :key="i._id">
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
      const response = await app.$axios.$get("categories");
      const categories = response.result;
      return { categories };
    } catch (e) {}
  },
  data() {
    return {
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Categories", disabled: true }
      ]
    };
  },
  head() {
    return {
      title: "All our Product Categories"
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
