<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-layout row>
      <v-flex xs12>
        <v-toolbar class="primary" dark>
          <v-btn icon @click.stop="showCategorymenu(false)" aria-label="Show Category Menu">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>{{$t('Menu')}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list>
          <v-list-tile icon v-for="(item,ix) in menuItems" :key="ix" :to="item.url">
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.text"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
import { mapMutations } from "vuex";
import { menuItems } from "@/config";

export default {
  data() {
    return {
      menuItems
    };
  },
  computed: {
    drawer: {
      get: function() {
        return this.$store.state.login.showCategories;
      },
      set: function(value) {
        this.showCategorymenu(value);
      }
    }
  },
  props: ["showDrawer"],
  methods: {
    go(slug) {
      this.$router.push("/category/" + slug);
    },
    ...mapMutations({
      showCategorymenu: "login/showCategorymenu"
    })
  }
};
</script>
