<template>
  <div>
    <header :class="scrolled ? 'header-fixed smaller top_header_bg': 'header-fixed smaller'">
      <div class="main-header">
        <v-container>
          <v-layout row>
            <v-flex xs6 sm2>
              <router-link to="/" class="logo">
                <WineLogo label="true" outerWidth="110px"/>
              </router-link>
            </v-flex>
            <v-flex></v-flex>
            <!-- account icon -->
            <v-flex xs4 sm2 lg1 style="margin-top: 10px">
              <Topmenu :mobile="false"/>
            </v-flex>
            <!-- cart icon -->
            <v-flex xs3 sm2 lg1 style="margin-top: 10px">
              <div class="cart">
                <v-btn flat @click.stop="toggleCart(true)" class="white--text">
                  <v-badge color="red">
                    <span slot="badge" v-if="getTotalCount > 0">{{ getTotalCount }}</span>
                    <v-icon color="white" large>shopping_basket</v-icon>
                  </v-badge>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </header>
  </div>
</template>

<script>
import WineLogo from "~/components/wine-logo-brand.vue";
import Topmenu from "~/components/Topmenu";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "WineHeader",
  props: ["stick"],
  components: {
    WineLogo,
    Topmenu
  },
  data() {
    return {
      scrolled: false
    };
  },
  methods: {
    ...mapMutations({
      toggleCart: "cart/toggleCart"
    }),
    toggle(event, source) {
      this.mainNav = !this.mainNav;
    },
    handleScroll(event) {
      this.scrolled = window.scrollY > 0;
    }
  },
  computed: {
    mainNav: {
      get() {
        return this.$store.getters.mainNav;
      },
      set(val) {
        this.$store.commit("mainNav", !!val);
      }
    },
    ...mapGetters({
      showCart: "cart/showCart",
      getTotalCount: "cart/getTotalCount",
      getTotal: "cart/getTotal"
    }),

    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  created() {
    if (!this.stick) window.addEventListener("scroll", this.handleScroll);
    else this.scrolled = true;
  },
  destroyed() {
    if (!this.stick) window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style  lang="scss" scoped>
@import "../assets/scss/_variables";

.top_header_bg {
  background: rgba(0, 0, 0, 0.5);
  margin-top: -80px;
  top: 80px;
  transition: 0.5s top ease-in-out;
}

.main-header .container {
  padding-top: 10px;
  padding-bottom: 10px;
}

.pull-right {
  display: flex;
  align-items: center;
}
.menu-btn v-icon {
  color: #c4a976;
  margin-left: auto;
  cursor: pointer;
}

.cart {
  color: #fff;
  .cart-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: left;
    color: #fff;
    .badge {
      padding: 4px 6px;
      line-height: 0.9;
      display: inline-block;
      position: absolute;
      top: -10px;
      font-size: 14px;
      border-radius: 30px;
      background: $main-red;
      right: -10px;
    }
  }

  .bag {
    font-size: 1.5em;
    float: right;
    margin-left: 20px;
    position: relative;
  }
}
</style>
