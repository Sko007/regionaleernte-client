<template>
  <div style="width: 100%">
    <v-btn :color="color" :block="block" :round="round" type="submit" :disabled="loading || disabled" :loading="loading">
      <v-icon>{{icon}}</v-icon>&nbsp;
      <span>{{text}}</span>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: [
    "disabled",
    "form",
    "icon",
    "text",
    "round",
    "block",
    "color",
    "loading"
  ],
  computed: {
    // ...mapGetters(["loading"])
  }
};
</script>
<style scoped>
.spinner {
  top: 6px;
}
</style>
