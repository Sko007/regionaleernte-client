<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container>
      <v-list two-line v-if="wishlist.length>0">
        <template v-for="(item, index) in wishlist">
          <v-divider inset :key="item._id" v-if="!index==0"></v-divider>
          <v-list-tile avatar :key="index">
            <v-list-tile-avatar>
              <img :src="item.avatar" v-if="item.avatar && item.avatar!==''" alt>
              <list-image :text="item.product.name" v-else/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{item.product.name}}</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-btn icon @click="remove(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-avatar class="stars">
              <!-- <v-icon v-for="(i,ix) in item.rating" :key="ix">star</v-icon> -->
            </v-list-tile-avatar>
          </v-list-tile>
        </template>
      </v-list>
      <img v-else-if="loading" src="/loading.svg" alt="loading ...">
      <v-layout v-else>
        <v-container>
          <v-layout align-center>
            <v-flex text-xs-center>
              <h5 class="display-1">
                <v-icon size="72">warning</v-icon>No Items in Wishlist
              </h5>
              <p>Your wishlist found empty. You may add one from product details page!</p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import ListImage from "@/components/ListImage";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  async asyncData({ params, app }) {
    let wishlist = [];
    try {
      let wishlist = await app.$axios.$get("wishlists/my");
      return { wishlist, err: null };
    } catch (err) {
      return { wishlist: [], err };
    }
  },
  data() {
    return {
      // wishlist: [],
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "Wishllist", disabled: true }
      ]
    };
  },
  computed: {
    ...mapGetters({ loading: "loading" })
  },
  methods: {
    async remove(wish) {
      try {
        this.wishlist = await this.$axios.$delete(`wishlists/my/${wish._id}`);
        this.getData();
      } catch (err) {
        // console.log("er......", err);
      }
    },
    async getData() {
      this.wishlist = await this.$axios.$get("wishlists/my");
    }
  },
  components: {
    Breadcrumb,
    ListImage
  },
  // created() {
  // this.getData();
  // },
  layout: "wine",
  head() {
    return {
      title: "Your Wishlist",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "This wishlist helps you to save the desired items for future purchase and also helps us to send you more likely suggestions"
        }
      ]
    };
  }
};
</script>
<style scoped>
.stars .avatar {
  height: 29px;
  width: 134px !important;
}
a {
  text-decoration: none;
}
.font {
  /* font-size: 12px; */
  font-weight: bolder;
}
</style>