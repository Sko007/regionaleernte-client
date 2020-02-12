<template>
  <div>
    <v-card :color="color" class="card white--text">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex>
            <div style="align:right;" @click="go(url)">
              <h2 class="m-b">{{$t(text1)}}</h2>
              <h2 class="fl" style=" font-size: 30px;">
                <v-icon color="white" size="40">{{icon}}</v-icon>
                <v-spacer></v-spacer>
                <span style="color:white">{{value1}}</span>
              </h2>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["color", "url", "text1", "value1", "text2", "value2", "icon"],
  methods: {
    go(url) {
      this.$router.push(url);
    }
  }
};
</script>
<style scoped>
h2 {
  cursor: pointer;
}
.card {
  margin-bottom: 20px;
  /* margin-right: 20px; */
  min-width: 220px;
}
.fl {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.fc {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mb0 {
  margin-bottom: -30px;
}

.blue {
  background: linear-gradient(45deg, #4099ff, #73b4ff);
}
.green {
  background: linear-gradient(45deg, #2ed8b6, #59e0c5);
}
.pink {
  background: linear-gradient(45deg, #ff5370, #ff869a);
}
.yellow {
  background: linear-gradient(45deg, #ffb64d, #ffcb80);
}
</style>

