<template>
  <div>
    <v-menu
      bottom
      left
      origin="center center"
      transition="scale-transition"
      open-on-click
      v-if="user"
    >
      <v-btn flat color="white" slot="activator">
        <v-flex>{{user.name}}</v-flex>
      </v-btn>
      <v-list>
        <v-list-tile v-for="(m,ix) in menuItems" :key="ix" @click="go(m.url)">
          <v-list-tile-action>
            <v-icon :color="m.color">{{m.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="m.color+'--text'">{{$t(`${m.text}`)}}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="$store.dispatch('auth/logout')">
          <v-list-tile-action>
            <v-icon color="black">all_out</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{$t('Logout')}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <!-- For mobile device -->
    <v-btn
      @click.stop="showLoginModal({show:true,initiator:'header'})"
      flat
      color="white"
      v-else-if="!mobile"
    >
      <span>{{$t('Login')}}</span>
    </v-btn>

    <!-- For desktops and tablets -->
    <v-btn
      @click.stop="showLoginModal({show:true,initiator:'header'})"
      flat
      icon
      color="white"
      v-else
      aria-label="user account"
    >
      <span>{{$t('Login')}}</span>
    </v-btn>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { menuItems } from "~/config";
export default {
  props: ["mobile"],
  computed: {
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  data() {
    return { menuItems };
  },
  methods: {
    ifExists(val) {
      let x = !val || val == "undefined";
      return !x;
    },
    ...mapMutations({
      showLoginModal: "login/showLoginModal"
    }),
    go(to) {
      this.$router.push(to);
    }
  }
};
</script>
<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.list__tile__action {
  min-width: 30px !important;
}

.v-menu__content {
  z-index: 1000 !important;
}
</style>