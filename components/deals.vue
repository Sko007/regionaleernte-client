<template>
  <div v-if="$store.state.settings.banners && $store.state.settings.banners.deals.length">
    <h3>Deals of the day</h3>
    <v-card>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm3 v-for="card in $store.state.settings.banners.deals" :key="card.title">
            <v-card>
              <router-link :to="card.link">
                <v-img :src="'/'+card.image" height="250px" />
              </router-link>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.deals {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.fx {
  display: flex;
  font-size: 1.2em;
}
.fx .icon {
  font-size: 2em;
}
</style>

