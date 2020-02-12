<template>
  <div>
    <v-menu v-model="showZip" :close-on-content-click="false" :nudge-width="200" offset-y>
      <v-btn
        mini
        flat
        slot="activator"
        small
        outline
        color="orange"
        class="mini2"
      >Your location {{zip}}</v-btn>
      <form novalidate @submit.stop.prevent="submit(zip)">
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <!-- <v-list-tile-avatar>
            <img src="https://s3.amazonaws.com/vuetify-docs/images/john.jpg" alt="John">
              </v-list-tile-avatar>-->

              <v-list-tile-content>
                <v-list-tile-title>Where do you want the delivery?</v-list-tile-title>
                <v-list-tile-sub-title>Supermart is available only in Mumbai</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon>
                  <v-icon>location_on</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <!-- <v-divider></v-divider> -->
          <!-- {{serverError}} -->
          <v-list>
            <v-text-field
              autocomplete
              name="zip"
              v-model="zip"
              :items="zips"
              :label="`Select your area`"
              persistent-hint
              prepend-icon="mdi-city"
              :error-messages="serverError"
            />
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat @click="showZip = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" flat>Save</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-menu>
  </div>
</template>

<script>
import Submit from "./../Submit";
import { mapGetters, mapMutations } from "vuex";
import includes from "lodash/includes";
export default {
  props: ["show"],
  data: () => ({
    showZip: false,
    serverError: undefined,
    zips: ["560001", "560002", "560003"],
    zip: "",
    loading: false,
    rules: {
      required: value => !!value || "Required."
    }
  }),

  methods: {
    async submit(zip) {
      if (!zip || !zip.trim() === "") {
        this.serverError = "Did you forget to type your zip code?";
        return;
      } else {
        this.$store.commit("user/setZip", zip);
        this.serverError = undefined;
        if (this.$store.state.settings.enableZips) {
          let inc = includes(this.$store.state.settings.zips, zip);
          if (!inc) {
            this.serverError = "Sorry.We are not operational in your area";
            return;
          }
        }
        this.showZip = false;
      }
    },
    close() {}
  },
  mounted() {
    const zip = this.$store.state.user.zipcode;
    if (zip == undefined || zip == null) {
      // console.log("zip null");
      this.showZip = true;
    } else {
      this.zip = zip;
    }
  },
  components: {
    Submit
  }
};
</script>
<style scoped>
.mini2 {
  font-size: 0.5em;
}
.mini {
  font-size: 0.7em;
}
.fx {
  display: flex;
  justify-content: space-between;
}
.close {
  position: absolute !important;
  right: -9px;
  top: 0;
}

.p20 {
  padding: 20px;
}
</style>
