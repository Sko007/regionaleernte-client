<template>
  <div v-show="isEnabled">
    <div class="breadcrumb-bar" v-if="isEnabled">
      <v-breadcrumbs :items="items">
        <template v-slot:item="props">
          <v-btn
            flat
            small
            v-if="props.item.url"
            @click="go(props.item.url)"
          >{{ $t(props.item.text) }}</v-btn>
          <v-btn flat small v-else disabled>{{ $t(props.item.text) }}</v-btn>
        </template>
      </v-breadcrumbs>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"],
  data: () => ({
    isEnabled: true
  }),
  methods: {
    go(url) {
      this.$router.push(url);
    }
  }
};
</script>
<style scoped>
.breadcrumb-bar {
  flex: 1;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.08),
    0 2px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 5px 0 rgba(0, 0, 0, 0.05);
}

.breadcrumb li {
  list-style: none;
  margin-top: 0;
}

.breadcrumb li a {
  font-weight: 400;
  font-size: 1rem;
}
</style>