<template>
  <div>
    <div class="headsup">
      <zip-menu v-if="$store.state.settings.enableZips"/>
      <a href="https://meine.regionaleernte.de /account/signup">
        <v-btn small flat round outline color="green" class="mini2">Start selling</v-btn>
      </a>
      <!-- <v-btn small flat round outline nuxt to="/" color="yellow" class="mini2">Become a patron</v-btn> -->
    </div>
    <!-- For mobile device -->
    <v-toolbar class="primary hidden-md-and-up" extended>
      <v-toolbar-side-icon
        v-if="!noLeftMenu"
        dark
        @click.stop="showCategorymenu(true)"
        aria-label="open drawer"
      ></v-toolbar-side-icon>
      <router-link class="white--text" to="/" aria-label="Go to home page">
        <v-avatar size="24">
          <img src="/img/logo.png" alt width="24px" height="24px">
        </v-avatar>
      </router-link>
      <router-link class="white--text" to="/">
        <span v-if="$store.state.settings.shopName">{{$store.state.settings.shopName}}</span>
        <span v-else>{{$t('Home')}}</span>
      </router-link>

      <div class="w100" slot="extension">
        <v-text-field
          class="search-box"
          solo
          prepend-inner-icon="search"
          clearable
          :label="$t('Find product from 25000+')"
          v-model="search"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-btn flat icon @click.stop="toggleCart(true)" class="white--text">
        <v-badge color="red">
          <span slot="badge">{{getTotalCount}}</span>
          <v-icon color="white">shopping_cart</v-icon>
        </v-badge>
      </v-btn>
      <Topmenu :mobile="true" v-if="!hideTopmenu"/>
    </v-toolbar>

    <!-- For desktops and tablets -->
    <v-toolbar class="primary hidden-sm-and-down">
      <v-toolbar-side-icon
        v-if="!noLeftMenu"
        dark
        @click.stop="showCategorymenu(true)"
        aria-label="open drawer"
      ></v-toolbar-side-icon>
      <router-link class="white--text" to="/">
        <v-avatar size="24">
          <img src="/img/logo.png" alt width="24px" height="24px">
        </v-avatar>
      </router-link>
      <router-link class="white--text" to="/">
        <span v-if="$store.state.settings.shopName">{{$store.state.settings.shopName}}</span>
        <span v-else>{{$t('Home')}}</span>
      </router-link>
      <v-spacer/>
      <v-flex class="fl">
        <v-text-field
          class="search-box"
          solo
          prepend-inner-icon="search"
          clearable
          :label="$t('Find a product from our range of 25000+')"
          v-model="search"
        ></v-text-field>
      </v-flex>
      <v-spacer/>
      <v-btn flat @click.stop="toggleCart(true)" class="white--text">
        {{getTotal | currency}}
        <v-badge color="red">
          <span slot="badge">{{getTotalCount}}</span>
          <v-icon color="white">shopping_cart</v-icon>
        </v-badge>
      </v-btn>
      <Topmenu :mobile="false" v-if="!hideTopmenu"/>
    </v-toolbar>
    <megamenu v-if="!noMegamenu" class="hidden-sm-and-down"/>
    <megamenu-mobile v-if="!noMegamenu" class="hidden-md-and-up"/>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { typingTimeout } from "@/config";
import { isUndefined, isNull, debounce } from "lodash";
import Topmenu from "~/components/Topmenu";
import Megamenu from "~/components/Megamenu";
import MegamenuMobile from "~/components/MegamenuMobile";
import Zip from "@/components/modal/Zip";
import ZipMenu from "@/components/modal/ZipMenu";

export default {
  data() {
    return {
      showZipForm: false,
      search: "",
      showDrawer: false,
      typingTimeout: typingTimeout,
      typingTimer: null
    };
  },
  components: {
    Topmenu,
    Megamenu,
    MegamenuMobile,
    Zip,
    ZipMenu
  },
  watch: {
    search(value) {
      clearTimeout(this.typingTimer);
      let vm = this;
      this.typingTimer = setTimeout(function() {
        // if(value)
        if (isUndefined(value) || isNull(value)) value = ""; // When clear button clicked
        vm.searchString = value;
        vm.$router.push("/search/" + value);
      }, vm.typingTimeout);
    },
    "$route.params.q": {
      immediate: true,
      handler(value) {
        const pathName = this.$route.name.substr(0, 8);
        if (pathName === "category") return;
        if (isUndefined(value) || isNull(value)) value = "";
        if (value == "") return;
        if (this.search == "") this.search = value;
      }
    }
  },
  computed: {
    ...mapGetters({
      showCart: "cart/showCart",
      getTotalCount: "cart/getTotalCount",
      getTotal: "cart/getTotal"
    })
  },
  methods: {
    ...mapMutations({
      toggleCart: "cart/toggleCart",
      showCategorymenu: "login/showCategorymenu"
    }),
    // debounceInput(q) {
    //   if (q == null) q = "";
    //   debounce(function(e) {
    //     console.log("after debounce", e.target.value);
    //     this.filterKey = e.target.value;
    //   }, 500);
    // },
    go(to) {
      this.$router.push(to);
    }
  },
  props: ["hideTopmenu", "noLeftMenu", "noMegamenu"]
};
</script>
<style scoped>
.v-text-field--solo >>> .v-input__slot {
  border-radius: 50px !important;
}
.mini2 {
  font-size: 0.5em;
}
.headsup {
  background-color: #111;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
img {
  margin-top: 0px;
  margin-right: 5px;
}
a {
  text-decoration: none;
}
.search-box {
  margin-bottom: -7px;
}
.w100 {
  width: 100%;
}
</style>