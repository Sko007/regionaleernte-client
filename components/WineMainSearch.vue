<template>
  <v-layout flex row align-center justify-center>
    <v-flex xs10 sm8 md6>
      <v-text-field
        v-model="searchWine"
        class="wine_search"
        :placeholder="$t('Search products')"
        background-color="white"
        color="black"
        prepend-inner-icon="search"
        height="45"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "WineMainSearch",
  data() {
    return {
      searchWine: ""
    };
  },
  watch: {
    searchWine(search) {
      this.$store.commit("searchWine", search);
    }
  },
  created() {
    this.searchWine = this.$store.state.searchWine;
  }
};
</script>

<style scoped>
.form-item {
  height: 45px;
}
.form-item,
.fa {
  font-size: 20px;
}
.wine_search {
  font-size: 20px;
  padding: 10px;
}
</style>
