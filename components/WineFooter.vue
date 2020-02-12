<template>
  <footer>
    <div class="footer-top">
      <v-container>
        <!--
        <v-layout column align-center>
          <WineLogo label="true" outerWidth="124px" width="72" font-size="24px"/>
        </v-layout>
        -->
        <v-layout row wrap>
          <v-flex xs12 sm6 lg1 class="link_wrapper">
            <router-link to="/pages/shipping">{{$t('Shipping')}}</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg2 class="link_wrapper">
            <router-link to="/pages/impressum">Impressum</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg2 class="link_wrapper">
            <router-link to="/pages/wiederrufsrecht">Wiederrufsrecht</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg2 class="link_wrapper">
            <router-link to="/pages/datenschutz">Datenschutz</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg1 class="link_wrapper">
            <router-link to="/pages/agb">AGB</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg2 class="link_wrapper">
            <router-link to="/pages/cookies">Verwendung von Cookies</router-link>
          </v-flex>
          <v-flex xs12 sm6 lg2 class="link_wrapper">
            <router-link to="/pages/payments">{{$t('Payment')}}</router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="footer-bottom bg-0">
      <v-container>
        <p
          class="footer_copyright"
        >&copy; {{ new Date().getFullYear() }}. {{$t('All rights reserved')}}</p>
      </v-container>
    </div>
    <login-modal/>
    <v-snackbar :timeout="snackTimer" :bottom="true" v-model="showSnackbar" v-if="error">
      {{ $t(error.msg) }}
      <v-btn flat class="primary" @click.stop="showSnackbar = false">{{$t('Close')}}</v-btn>
    </v-snackbar>
  </footer>
</template>

<script>
import WineLogo from "~/components/wine-logo-brand.vue";
import LoginModal from "@/components/modal/LoginModal";
import { snackTimer, typingTimeout } from "@/config";
import { mapGetters } from "vuex";

export default {
  name: "WineFooter",
  data() {
    return {
      showSnackbar: false,
      snackTimer
    };
  },
  components: {
    WineLogo,
    LoginModal
  },
  computed: {
    ...mapGetters({ error: "error" })
  },
  created() {
    this.$store.watch(
      function(state) {
        return state.error;
      },
      err => {
        if (err.is) {
          this.showSnackbar = true;
          // if (this.error === "Please login again to continue.") {
          //   this.$store.state.showLogin = true;
          // }
        } else {
          this.showSnackbar = false;
        }
      }
    );
  }
};
</script>

<style lang="scss" scoped>
footer {
  background: #191a1c;
}

.link_wrapper {
  margin-top: 20px;
  text-align: center;
  a {
    color: white;
  }
}

.footer_copyright {
  color: white;
  text-align: center;
}
.container {
  padding: 0;
}
</style>
