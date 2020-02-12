<template>
  <section class="p-0">
    <div class="banner bg-image-8">
      <div class="caption">
        <div class="title-group">
          <h5 class="sub-title">{{$t('Royal Products')}}</h5>
          <WineMainSearch/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import WineMainSearch from "~/components/WineMainSearch.vue";

export default {
  name: "WineTopBanner",
  components: {
    WineMainSearch
  }
};
</script>

<style scoped>
.bg-image-8 {
  height: 300px;
}
</style>