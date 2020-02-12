<template>
<div class="group" v-if="otherSize">
  <v-card>
    <v-layout row wrap v-for="s in otherSize.variants" :key="s._id">
        <div v-if="s" >
          <v-btn>{{s.size}}</v-btn>
        </div>
    </v-layout>
  </v-card>
</div>  
</template>

<script>
export default {
  props: ["otherSize"],
  data() {
    return {};
  },
  methods: {
    selectwt() {}
  }
};
</script>




<!--<template>
  <div class="box">
      <v-card  class="smallcard">aaaaaaaaaaaaaa</v-card>
      <v-card  class="smallcard">aabbbbbbbbbbb</v-card>
      <v-card  class="smallcard">aa</v-card>
      <v-card  class="smallcard">aa</v-card>
      <v-card  class="smallcard">aa</v-card>
      <v-card  class="smallcard">aa</v-card>  
  </div>
</template>
<style scoped>
.box {
  height: 200px;
  background-color: brown;
  overflow-x: scroll;
  max-width: 570px;
  white-space: nowrap;
}

.smallcard {
  display: inline-block;
  width: 150px;
  margin: 2px;
  height: 100%;
}
</style> -->
