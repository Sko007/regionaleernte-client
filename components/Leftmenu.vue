<template>
<v-navigation-drawer
v-model="drawer" 
app
>
  <v-layout row>
    <v-flex xs12>
        <v-toolbar class="primary" dark>
          <v-btn icon @click.stop="showCategorymenu(false)">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Categories</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list>
          <v-list-group
            v-for="item in $store.state.categories"
            v-if="item.count>0"
            :key="item._id"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="subItem in item.children" :key="subItem._id" v-if="subItem.count>0" @click="go(subItem.slug)">
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.name }} ({{subItem.count}})</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
    </v-flex>
  </v-layout>
</v-navigation-drawer>
</template>
<script>
import { mapMutations } from "vuex";
// import { menuItems } from "@/config";
export default {
  data() {
    return {
      // categories: []
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
