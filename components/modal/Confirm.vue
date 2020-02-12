<template>
  <!-- <v-layout row justify-center style="position: relative;"> -->
  <v-dialog v-model="show" lazy max-width="290">
    <v-card>
      <v-card-title>
        <div class="headline">{{title}}</div>
      </v-card-title>
      <v-card-text>{{message}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click="close">{{$t(Cancel)}}</v-btn>
        <v-btn color="green darken-1" @click="ok">{{$t(Yes)}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- </v-layout> -->
</template>

<script>
export default {
  props: ["title", "message", "show"],
  data: () => ({
    data: {}
  }),
  methods: {
    close() {
      this.$emit("update:show", false);
      this.$emit("cancel");
    },
    ok() {
      this.$emit("update:show", false);
      this.$emit("ok");
    }
  }
};
</script>