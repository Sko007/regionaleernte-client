<template>
  <div>
    <div class="container">
      <h4>{{$t('Dashboard')}}</h4>
      <div class="dashboard-cards">
        <router-link
          tag="div"
          v-for="(i,ix) in cards"
          :key="ix"
          class="gradient-card left vcenter"
          :class="i.color"
          v-if="hasRole(i.authenticate)"
          :to="i.url"
        >
          <v-icon>{{i.icon}}</v-icon>
          <div class="content flex">
            <div class="header">{{i.name}}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cards: [],
      breadcrumb: []
    };
  },
  components: {
    Breadcrumb
  },
  layout: "wine",
  created() {
    this.cards = [
      {
        name: "Profile",
        url: "/account/profile",
        authenticate: "user",
        icon: "face"
      },
      {
        name: "Change Password",
        url: "/account/change-password",
        authenticate: "user",
        icon: "lock"
      }
    ];
    this.breadcrumb = [{ name: "Dashboard" }];
  },
  computed: {
    ...mapGetters({ hasRole: "user/hasRole" })
  },
  head() {
    return {
      title: "Profile"
    };
  }
};
</script>
