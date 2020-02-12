<template>
<div>
  <v-container v-if="page">
      <h1>{{page.name}}</h1>
      <v-container>
        <div v-html="page.content"></div>
      </v-container>
  </v-container>
  <GmapMap
    :center="{lat:22.252820, lng:84.895833}"
    :zoom="15"
    map-type-id="terrain"
    style="width: 100%; height: 300px"
  >
  <GmapMarker
      :key="index"
      v-for="(m, index) in [{
              position: {
                lat: 22.252820,
                lng: 84.895833
              }
            }]"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    />
  </GmapMap>
</div>
</template>
<script>
export default {
  layout: 'wine',
  async asyncData({ params, app }) {
    try {
      const page = await app.$axios.$get("pages/5affd44dc2308422582c91c0");
      return { page };
    } catch (e) {}
  },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.page.description
        }
      ]
    };
  }
};
</script>

