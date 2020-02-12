<template>
  <div>
    <v-container grid-list-lg fluid class="mb0">
      <v-layout row wrap>
        <v-flex v-if="Totalusers.length>0">
          <summary-card
            text="No. Of vendors"
            :value="Totalusers.length"
            url="/users"
            color="blue"
            icon="face"
          />
        </v-flex>
        <v-flex>
          <summary-card
            text="Order Total"
            :value="Totalorders.length"
            url="/orders"
            color="green"
            icon="history"
            secondText="Completed Orders"
          />
          <!-- <v-card color="green" class="card white--text">
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex>
                    <div style="align:right;">
                      <h2 class="m-b" @click="go('/orders')">{{$t('Order Total')}}</h2>
                      <h2 class="fl" style=" font-size: 30px;">
                     <v-icon color="white" size="40">history</v-icon><v-spacer></v-spacer><span style="color:white">$480</span>
                      </h2>
                      <p class="fl" style="">{{$t('Completed')}} {{$t('Orders')}}<v-spacer></v-spacer><span style="color:white" class="text">{{Totalorders.length}}</span></p>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
          </v-card>-->
        </v-flex>
        <v-flex>
          <v-card color="pink" class="card white--text">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex>
                  <div style="align:right;">
                    <h2 class="m-b" @click="go('/reviews')">{{$t('Reviews')}}</h2>
                    <h2 class="fl" style=" font-size: 30px;">
                      <v-icon color="white" size="40">stars</v-icon>
                      <v-spacer></v-spacer>
                      <span style="color:white">{{Totalreviews.length}}</span>
                    </h2>
                    <p class="fl" style>
                      {{$t('Ratings')}}
                      <v-spacer></v-spacer>
                      <span style="color:white" class="text">{{Totalreviews.length}}</span>
                    </p>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex>
          <v-card color="yellow" class="card white--text">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex>
                  <div style="align:right;">
                    <h2 class="m-b" @click="go('/products/search')">{{$t('Total Products')}}</h2>
                    <h2 class="fl" style=" font-size: 30px;">
                      <v-icon color="white" size="40">store</v-icon>
                      <v-spacer></v-spacer>
                      <span style="color:white">{{Totalproducts.length}}</span>
                    </h2>
                    <p class="fl" style>
                      {{$t('Active')}}
                      <v-spacer></v-spacer>
                      <span style="color:white" class="text">{{Totalproducts.length}}</span>
                    </p>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { SummaryCards } from "@/components/SummaryCards";
export default {
  data: () => {
    return {
      Totalusers: {},
      Totalwish: {},
      Totalorders: {},
      Totalproducts: {},
      Totalreviews: {}
    };
  },
  async created() {
    try {
      if (this.$store.getters["user/hasRole"]("admin")) {
        this.Totalusers = await this.$axios.$get("users", {
          params: { sort: "-createdAt", limit: 10 }
        });
      }
      this.Totalwish = await this.$axios.$get("wishlists", {
        params: { sort: "-createdAt", limit: 10 }
      });
      this.Totalorders = await this.$axios.$get("orders/my", {
        params: { sort: "-createdAt", limit: 10 }
      });
      this.Totalproducts = await this.$axios.$get("products", {
        params: { sort: "-created_at", limit: 10 }
      });
      this.Totalreviews = await this.$axios.$get("reviews", {
        params: { sort: "-createdAt", limit: 10 }
      });
    } catch (e) {
      this.$store.commit("setErr", e.response);
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    }
  },
  components: { SummaryCards }
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
