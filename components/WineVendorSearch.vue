<template>
  <v-layout flex row align-center justify-center>
    <v-flex xs10 md6>
      <v-autocomplete
        class="search_input"
        v-model="model"
        :items="entries"
        :loading="isLoading"
        :search-input.sync="search"
        :filter="customFilter"
        color="black"
        height="45"
        hide-no-data
        hide-selected
        item-text="formattedAddress"
        item-value="formattedAddress"
        :placeholder="$t('Type in your Address City, Street, Number...')"
        prepend-inner-icon="search"
        background-color="white"
        return-object
      ></v-autocomplete>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "WineVendorSearch",
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
    prev: null
  }),

  methods: {
    async getAddress(address) {
      if (address && address.length > 0 && !this.isLoading) {
        // save address to prev in order to check if current input(now) is the same as search result(before request to server)
        this.prev = address;
        this.isLoading = true;

        let locations = await this.$axios.$get("location/findLocation", {
          params: { address: address }
        });

        this.entries = locations;

        this.isLoading = false;

        // check if downloaded response is corresponding to current input state
        if (this.prev != this.search) {
          await this.getAddress(this.search);
        }
      }
    },
    customFilter() {
      return true;
    }
  },

  watch: {
    async search(address) {
      await this.getAddress(address);
    },
    model(val) {
      let userAddress = val;
      this.$store.commit("userAddress", userAddress);

      if (val != null) {
        this.$router.push("/wine");
      }
    }
  }
};
</script>

<style scoped>
.form-item {
  height: 45px;
}
.form-item,
.fa {
  font-size: 20px;
}
.search_input {
  font-size: 20px;
}
</style>
