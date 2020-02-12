<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <v-container fluid>
      <v-layout row justify-center align-center wrap>
        <v-flex xs12 md6>
          <form novalidate @submit.stop.prevent="save(address)">
            <v-card>
              <v-card-title></v-card-title>
              <v-img></v-img>
              <v-card-text>
                <v-text-field
                  name="houseNumber"
                  v-model="address.houseNumber"
                  :label="$t('House Number')"
                  labelFloat
                  v-validate="'required'"
                  :error-messages="errors.collect('houseNumber')"
                />
                <v-text-field
                  name="streetName"
                  v-model="address.streetName"
                  :label="$t('Street Name')"
                  labelFloat
                  v-validate="'required'"
                  :error-messages="errors.collect('streetName')"
                />
                <v-text-field
                  name="city"
                  v-model="address.city"
                  ref="city"
                  :label="$t('City')"
                  labelFloat
                  v-validate="'required'"
                  :error-messages="errors.collect('city')"
                />
                <v-text-field
                  name="zip"
                  v-model="address.zip"
                  ref="zip"
                  :label="$t('ZipCode')"
                  labelFloat
                  v-validate="'required|min:4|max:6|numeric'"
                  :error-messages="errors.collect('zip')"
                />
                <v-card-actions>
                  <submit
                    color="secondary"
                    :full="true"
                    icon="save"
                    text="Update"
                    :disabled="errors.any()"
                  ></submit>
                  <v-btn flat @click="go('/my/address')">{{$t('Cancel')}}</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Submit from "@/components/Submit";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      loading: "loading"
    })
  },
  data() {
    return {
      address: {
        streetName: "",
        houseNumber: "",
        city: "",
        zip: ""
      },
      editing: false,
      dialog: false,
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "Manage Address", url: "/my/address", disabled: false },
        { text: "Edit", disabled: true }
      ]
    };
  },
  methods: {
    go(uri) {
      this.$router.push(uri);
    },
    async save(address) {
      const result = await this.$validator.validateAll();
      if (!result) {
        return;
      }

      try {
        if (address._id)
          await this.$axios.put("addresses/" + address._id, address);
        else await this.$axios.post("addresses", address);
        this.$router.push("/my/address");
      } catch (e) {}
    },
    async getData() {
      let id = this.$route.params.id;
      if (id !== "new")
        this.address = await this.$axios.$get("addresses/" + id);
    }
  },
  components: {
    Breadcrumb,
    Submit
  },
  created() {
    this.getData();
    let user = (this.$store.state.auth || {}).user;
    if (user) {
      this.address.name = user.name;
      this.address.phoneAddress = user.phone;
    }
  },
  layout: "checkout",
  head() {
    return {
      title: "Edit address",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "This is address edit page from where we can do any modifications to an address"
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
</style>
