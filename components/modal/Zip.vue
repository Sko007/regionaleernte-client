<template>
  <div>
    <v-dialog v-model="showZip" persistent max-width="500px">
      <v-card>
        <form novalidate @submit.stop.prevent="submit(zip)">
          <v-img src="/zip-image.png" height="200px" style="background-color:green">
            <v-btn icon color="secondary" class="close" @click.stop="close">
              <v-icon>close</v-icon>
            </v-btn>
          </v-img>
          <v-card-text>
            <v-container>
              <h3>Verify Delivery Pincode</h3>
              <p class="mute">Only available in selected cities</p>
              <v-text-field autofocus label="Enter Pin Code" labelFloat name="zip" v-model="zip" v-validate="'required|numeric|min:4|max:7'" :error-messages="errors.collect('zip') || serverError"></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container>
              <div class="fx">
                <v-btn flat @click="close" style="width:250px;">
                  <v-icon>history</v-icon> Cancel, Go back</v-btn>
                <Submit color="primary" block :disabled="errors.any()" icon="send" :text="'Continue'"></Submit>
              </div>
            </v-container>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Submit from "./../Submit";
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["show"],
  data: () => ({
    showZip: false,
    serverError: undefined,
    zip: "",
    loading: false,
    rules: {
      required: value => !!value || "Required."
    }
  }),
  computed: {
    // showZip: {
    //   get: function() {
    //     return this.show;
    //   },
    //   set: function() {
    //     return this.show;
    //   }
    // }
  },
  methods: {
    async submit(zip) {
      if (!zip || !zip.trim() === "") {
        this.serverError = "Did you forget to type your zip code?";
        return;
      } else {
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        // let serverError = await this.$axios.$put("users/profile", { zip });
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", zip);
        this.$store.commit("user/setZip", zip);
        // localStorage.setItem("zipcode", zip);
        this.showZip = false;
        this.$emit("update:show", false);
        this.$emit("ok");
      }
    },
    close() {
      // console.log('cancel')
      this.$emit("update:show", false);
      this.$emit("cancel");
    }
  },
  created() {
    // const zip = localStorage.getItem("zipcode");
    const zip = this.$store.state.user.zipcode;
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", zip);
    if (zip == undefined) {
      // console.log("undeinfed....................");
      this.showZip = true;
    }

    // this.email = this.$store.state.user.email;
  },
  components: {
    Submit
  }
};
</script>
<style scoped>
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
