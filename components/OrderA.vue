<template>
  <div
    v-infinite-scroll="scroll"
    :infinite-scroll-distance="3"
    :infinite-scroll-immediate-check="true"
  >
    <div v-for="(order,ix) in data" :key="ix">
      <v-card :class="{cancel: order.status==='Cancellation Requested'}">
        <div class="text-center">
          <div class="headline">{{$t('Order')}} {{order.orderNo}}</div>
          <div class="body-1 grey--text order-detail">
            {{$t('Placed on')}} {{order.createdAt | date}}
            <span class></span>
            {{order.amount.total | currency}} {{$t('for')}} {{order.items.length}} {{$t('items')}}
          </div>
        </div>
        <v-spacer/>
        <v-card-text>
          <v-list subheader>
            <v-subheader>Items</v-subheader>
            <template v-for="(i,ix) in order.items">
              <v-divider :inset="true" :key="i.title" v-if="ix!=0"/>
              <v-list-tile avatar :key="i.title">
                <v-list-tile-avatar>
                  <img :src="i.url" v-if="i.url!==''" @error="setListImage(i)" alt>
                  <list-image :text="i.name" v-else/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    <!-- <router-link :to="`/product/${i.description}/${i._id}`"> -->
                    {{i.name}}
                    <!-- </router-link>  -->
                  </v-list-tile-title>
                  {{i.price | currency}} * {{i.qty}}
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <!-- <v-btn flat round @click="cancel(order)" v-if="order.status!='Cancellation Requested' && order.status!='Return Requested'">
            <span v-if="order.status=='Delivered'">Return</span>
            <span v-else>Cancel</span>
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>-->
          <v-btn flat round @click="go(`/my/orders/${order._id}`)">
            {{$t("View Details")}}
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <br>
    </div>
    <v-flex v-if="data.length===0 && !loading">
      <center>{{$t('No order found')}}</center>
    </v-flex>
    <span v-if="loading" slot="loader" class="custom-loader">
      <v-icon light>cached</v-icon>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { basic } from "@/mixins/";
import Vue from "vue";
import ListImage from "@/components/ListImage";
export default {
  mixins: [basic],
  props: ["api"],
  data() {
    return {
      f: {},
      path: {},
      model: "orders",
      heading: "Orders"
    };
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    setListImage(i) {
      i.url = "";
    },
    cancel(order) {
      this.$swal({
        title: "Please let us know the reason.",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !swal.isLoading()
      }).then(result => {
        // if (result.value) {
        this.cancelOrder({
          _id: order._id,
          status: "Cancellation Requested",
          cancellationComment: result.value
        });
        // }
      });
    },
    async cancelOrder(order) {
      try {
        const data = await this.$axios.$put("orders/" + order._id, order);
        this.getData();
      } catch (err) {}
    }
  },
  components: { ListImage },
  computed: {
    ...mapGetters({
      loading: "loading"
    }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
.order-detail span:after {
  content: "";
  width: 4px;
  height: 4px;
  background-color: #a4a4a4;
  border-radius: 50%;
  margin: 0 8px 3px;
  display: inline-block;
}
.text-center {
  text-align: center;
}
/* .order-content {
  display: flex;
} */
/* .order-content img {
  border-radius: 50%;
  height: 6rem;
  width: 6rem;
  padding: 5px;
  margin-right: 5px;
} */
</style>