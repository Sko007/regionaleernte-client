<template>
  <v-card >
     <v-card-title >
          <div v-if="selectedName">
            <h3 class="headline mb-0">{{selectedName.name}}</h3>
            <div>{{selectedName.size}}</div>
          </div>
        </v-card-title>
  </v-card>
</template>
<script>
export default {
  props: ["selectedName"]
};
</script>
