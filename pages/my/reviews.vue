<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container>
      <v-list two-line v-if="reviews.length>0">
        <template v-for="(item, index) in reviews">
          <v-divider inset :key="item._id" v-if="!index==0"></v-divider>
          <v-list-tile avatar :key="index">
            <v-list-tile-avatar>
              <img :src="item.avatar" v-if="item.avatar && item.avatar!==''" alt>
              <list-image :text="item.pname" v-else/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{item.pname}}</v-list-tile-title>
              <v-list-tile-sub-title style="display: flex;">
                <v-icon v-for="(i,ix) in item.rating" :key="ix" color="yellow">star</v-icon>
              </v-list-tile-sub-title>
              <v-list-tile-sub-title v-html="item.message"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click="deleteReview(item._id)" class="delete">
                <v-icon size="18">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
      <img v-else-if="loading" src="/loading.svg" alt="loading ...">
      <v-layout v-else>
        <v-container>
          <v-layout align-center>
            <v-flex text-xs-center>
              <h5 class="display-1">
                <v-icon size="72">warning</v-icon>
                {{$t('No Reviews & Ratings')}}
              </h5>
              <p>{{$t('You have not rated or reviewed any product yet!')}}</p>
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
    let reviews = [];
    try {
      reviews = await app.$axios.$get("reviews/my");
      return { reviews, err: null };
    } catch (err) {
      return { reviews: [], err };
    }
  },
  data() {
    return {
      // reviews: [],
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "Reviews", disabled: true }
      ]
    };
  },
  computed: {
    ...mapGetters({ loading: "loading" })
  },
  methods: {
    deleteReview(id) {
      let vm = this;
      this.$swal({
        title: "Are you sure to delete this review?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete"
      }).then(result => {
        if (result.value) {
          vm.remove(id);
        }
      });
    },
    async remove(id) {
      this.reviews = await this.$axios.$delete(`reviews/${id}`);
      this.getData();
    },
    async getData() {
      this.reviews = await this.$axios.$get("reviews/my");
    }
  },
  components: {
    Breadcrumb,
    ListImage
  },
  // created() {
  // this.getData();
  // },
  layout: "checkout",
  head() {
    return {
      title: "Your Product Reviews",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "All products that you reviewed in past appears here. You may choose to delete or keep it"
        }
      ]
    };
  }
};
</script>
<style scoped>
.delete .icon {
  color: #aaa;
}
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