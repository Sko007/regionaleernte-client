<template>
  <div>
    <v-dialog v-model="isShowing" width="500">
      <v-card>
        <v-img v-if="url" :src="'/'+url"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["isShowing", "url"],
  methods: {
    show: function() {
      return this.isShowing;
    }
  }
};
</script>