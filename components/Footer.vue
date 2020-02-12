<template>
  <div>
    <v-footer height="auto">
      <v-container fluid>
        <v-layout row wrap class="baseline">
          <v-flex>
            <v-card-text>
              <h4>About Us</h4>
              <ul>
                <li>
                  <router-link to="/about">About Us</router-link>
                </li>
                <li>
                  <router-link to="/payment">Payment</router-link>
                </li>
                <li>
                  <router-link to="/shipping">Shippings</router-link>
                </li>
                <li>
                  <router-link to="/contact">Contact Us</router-link>
                </li>
              </ul>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-text>
              <h4>Inventory</h4>
              <ul>
                <li>
                  <router-link to="/categories">Category List</router-link>
                </li>
                <li>
                  <router-link to="/brands">Brand List</router-link>
                </li>
              </ul>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-text>
              <h4>My Account</h4>
              <ul>
                <li>
                  <router-link to="/my/orders">Past Orders</router-link>
                </li>
                <li>
                  <router-link to="/account/profile">Edit Account Info</router-link>
                </li>
              </ul>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-text>
              <h4>Address</h4>
              <span>
                <div class="fl">
                  <v-icon size="16" color="grey">location_on</v-icon>
                  &nbsp; {{$store.state.settings.shopAddress}}
                </div>
                <div class="fl">
                  <v-icon size="16" color="grey">email</v-icon>
                  &nbsp; {{$store.state.settings.shopEmail}}
                </div>
                <div class="fl">
                  <v-icon size="16" color="grey">phone</v-icon>
                  &nbsp;{{$store.state.settings.shopPhone}}
                </div>
              </span>
            </v-card-text>
          </v-flex>
        </v-layout>
        <div class="flex">
          <v-flex md6 xs12>
            <div>
              <v-btn
                :href="$store.state.settings.facebook"
                target="_blank"
                flat
                class="social facebook"
                aria-label="Find us at facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M17 2v4h-2c-.69 0-1 .81-1 1.5V10h3v4h-3v8h-4v-8H7v-4h3V6a4 4 0 0 1 4-4h3z"
                  ></path>
                </svg>
                <span class="hidden-sm-and-down">{{$t('Facebook')}}</span>
              </v-btn>
              <v-btn
                :href="$store.state.settings.twitter"
                target="_blank"
                flat
                class="social twitter"
                aria-label="Find us at twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="41" height="24">
                  <path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  ></path>
                </svg>
                <span class="hidden-sm-and-down">{{$t('Twitter')}}</span>
              </v-btn>
              <v-btn
                :href="$store.state.settings.google"
                target="_blank"
                flat
                class="social google"
                aria-label="Find us at google"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="41" height="24">
                  <path
                    d="M13.3 13.45l-1.08-.85c-.36-.3-.82-.69-.82-1.42s.55-1.29.97-1.62c1.31-1.02 2.57-2.1 2.57-4.34 0-2.07-1.27-3.26-2.04-3.92h1.75L15.9.05H9.67c-4.36 0-6.6 2.71-6.6 5.72 0 2.33 1.79 4.83 4.98 4.83h.8c-.13.35-.35.84-.35 1.3 0 1.01.42 1.43.92 2-1.42.1-4.01.43-5.92 1.6-1.86 1.1-2.3 2.63-2.3 3.75 0 2.3 2.06 4.5 6.57 4.5 5.35 0 8.03-2.96 8.03-5.88 0-2.16-1.13-3.27-2.5-4.42M5.65 4.31c0-2.21 1.31-3.21 2.69-3.21 2.66 0 4.01 3.45 4.01 5.53 0 2.57-2.07 3.07-2.89 3.07C7 9.7 5.65 6.64 5.65 4.31M9.3 22.3c-3.33 0-5.45-1.49-5.45-3.7 0-2.2 1.96-2.91 2.65-3.16 1.3-.44 3-.49 3.27-.49.3 0 .46 0 .73.02 2.34 1.69 3.35 2.44 3.35 4.03 0 1.77-1.82 3.3-4.55 3.3"
                  ></path>
                  <path d="M21 10V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
                </svg>
                <span class="hidden-sm-and-down">{{$t('Google')}}</span>
              </v-btn>
            </div>
            <div class="aign-left">
              &copy;2018 — {{$store.state.settings.shopName}}
              <v-btn flat round outline @click="showContactForm=true" color="green">
                <v-icon>email</v-icon>
                {{$t('Let us know')}}
              </v-btn>
            </div>
          </v-flex>
        </div>
      </v-container>
    </v-footer>
    <login-modal/>
    <v-snackbar :timeout="snackTimer" :bottom="true" v-model="showSnackbar" v-if="error">
      {{ $t(error.msg) }}
      <v-btn flat class="primary" @click.stop="showSnackbar = false">{{$t('Close')}}</v-btn>
    </v-snackbar>
    <contact :show.sync="showContactForm"></contact>
  </div>
</template>
<script>
import LoginModal from "@/components/modal/LoginModal";
import Contact from "@/components/modal/Contact";
import { snackTimer, typingTimeout } from "@/config";
import { mapGetters } from "vuex";
export default {
  props: ["settings"],
  data() {
    return {
      showContactForm: false,
      showSnackbar: false,
      snackTimer,
      icons: [
        "fab fa-facebook",
        "fab fa-twitter",
        "fab fa-google-plus",
        "fab fa-linkedin",
        "fab fa-instagram"
      ]
    };
  },
  components: {
    Contact,
    LoginModal
  },
  computed: {
    ...mapGetters({ error: "error" })
  },
  methods: {
    contactUs() {
      this.showContactForm = true;
    }
  },
  // watch: {
  //   "$store.state.settings.language": {
  //     async handler(val) {
  //       this.$translate.setLang(val);
  //     }
  //   }
  // },
  created() {
    // this.$translate.setLang(this.$store.state.settings.language);
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
<style scoped>
.theme--light .v-footer,
.application .theme--light.v-footer {
  background-color: #ddd;
  font-size: 0.8rem;
}
.flex h4 {
  /* color: #999; */
  font-weight: bold;
}
.flex span {
  /* color: #aaa; */
}
ul {
  list-style: none;
  padding-left: 0;
}
ul li a {
  color: #333;
  text-decoration: none;
}
.fl {
  display: flex;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.baseline {
  align-items: baseline;
}
.w100 {
  width: 100%;
}
</style>
