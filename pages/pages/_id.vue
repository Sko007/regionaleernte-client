<template>
  <v-container v-if="content">
    <h1>{{content.title}}</h1>
    <v-container v-html="content.content"></v-container>
  </v-container>
</template>
<script>
export default {
  layout: "checkout",
  data() {
    return {
      page: null,
      content: null
    };
  },
  async created() {
    try {
      // console.log(this.$route.params.id);
      this.page = await this.$axios.$get("/pages/" + this.$route.params.id);
      this.content = this.page[0];
    } catch (e) {
      // console.log(e);
    }
  }
};
</script>

