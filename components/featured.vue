<template>
  <v-card v-if="$store.state.settings.banners && $store.state.settings.banners.offers.length">
    <h3 style="margin-left:5px;">Featured products</h3>
    <v-layout row wrap>
      <v-flex xs12 sm4 v-for="(card,ix) in $store.state.settings.banners.offers" :key="card.title" class="mr" v-lazy-container="{ selector: 'img',error:'450x250-err.svg',loading:'450x250.svg' }">
        <router-link :to="card.link" :name="'banner'+ix">
          <img :data-src="'/'+card.image" alt="featured products" width="100%" />
        </router-link>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.mr {
  padding: 5px;
}
</style>

