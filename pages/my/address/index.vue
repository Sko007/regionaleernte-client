<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <v-container fluid grid-list-md>
      <v-layout row wrap justify-center align-center>
        <v-flex xs12 add_btn_wrapper>
          <v-btn :to="'/my/address/new?referrer=address'" round class="secondary">
            <v-icon>add</v-icon>
            {{$t('New Address')}}
          </v-btn>
        </v-flex>
        <v-flex xs12 sm6 md4 v-for="address in addresses" :key="address._id">
          <v-card class="ma-2">
            <v-card-text>
              <v-list one-line>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">my_location</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{address.houseNumber}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">location_city</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{address.streetName}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">place</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{address.city}} - {{address.zip}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon @click="go('/my/address/'+address._id)">
                <v-icon color="primary">edit</v-icon>
              </v-btn>
              <v-btn icon @click="deleteAddress(address._id)">
                <v-icon color="primary">delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{$t('Are you Sure you want to Remove it?')}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" @click.native="dialog = false">Yes</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  async asyncData({ params, app }) {
    try {
      let addresses = await app.$axios.$get("addresses/my");
      return { addresses };
    } catch (e) {}
  },
  data() {
    return {
      editing: false,
      dialog: false,
      addresses: [],
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "Address", disabled: true }
      ]
    };
  },
  methods: {
    go(uri) {
      this.$router.push(uri);
    },
    deleteAddress(id) {
      let vm = this;
      this.$swal({
        title: "Are you sure to delete the address?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete"
      }).then(result => {
        if (result.value) {
          vm.deleteConfirmed(id);
        }
      });
    },
    async deleteConfirmed(id) {
      let res = await this.$axios.$delete("addresses/" + id);
      if (res.msg == "deleted") {
        this.getData();
      }
    },
    async getData() {
      this.addresses = await this.$axios.$get("addresses/my");
    }
  },
  components: {
    Breadcrumb
  },
  // created() {
  //   this.getData();
  // },
  layout: "checkout",
  head() {
    return {
      title: "View/Manage addresses",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Find/Add/Update/Delete all your addresses from here"
        }
      ]
    };
  }
};
</script>
<style scoped>
.pl15 {
  padding-left: 35px;
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.close {
  position: absolute !important;
  right: -6px;
  cursor: pointer;
}

.container {
  align-items: stretch;
  display: flex;
  justify-content: center;
}

.address-card {
  width: 20em;
  margin: 0 10px 10px 10px;
  cursor: pointer;
}

.add-address {
  width: 20em;
  margin: 0 0 10px 0;
}

.selected {
  border: 1px solid yellow;
}

.w100 {
  max-width: 100px;
}
.add_btn_wrapper {
  text-align: center;
}
</style>
