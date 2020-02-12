<template>
  <div>
    <v-dialog v-model="show" persistent class="flex" max-width="500px">
      <v-layout>
        <v-flex xs12 md12 sm6>
          <v-card>
            <img src="/banner.jpg" height="200px">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="white--text headline">{{$store.state.settings.shopName}}</span>
                </v-flex>
                <v-btn icon class="close" @click.stop="close">
                  <v-icon style="color:white;">close</v-icon>
                </v-btn>
              </v-layout>
            </v-container>

            <v-card-text primary-title>
              <form novalidate @submit.stop.prevent="submit(email,message)">
                <v-text-field
                  label="Your Email"
                  hintText="Your Email"
                  name="email"
                  v-model="email"
                  v-validate="'required|email'"
                  :error-messages="errors.collect('email')"
                  v-show="!$store.state.user || !$store.state.user.email"
                ></v-text-field>
                <v-textarea
                  autofocus
                  label="Message"
                  hintText="Message"
                  name="message"
                  :rows="3"
                  :rowsMax="6"
                  v-model="message"
                  v-validate="'required'"
                  :error-messages="errors.collect('message')"
                ></v-textarea>
                <Submit
                  :round="true"
                  color="primary"
                  :disabled="errors.any()"
                  :loading="loading"
                  :block="true"
                  icon="send"
                  :text="'Send Message'"
                ></Submit>
              </form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import Submit from "./../Submit";
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["show"],
  data: () => ({
    email: "",
    message: "",
    loading: false
    // showContactBox: false
  }),
  computed: {},
  methods: {
    ...mapMutations(["setErr"]),
    async submit(email, message) {
      if (!email || !email.trim() === "") {
        this.setErr("Did you forget to enter your email?");
        return;
      } else if (!message || !message.trim() === "") {
        this.setErr("Did you forget to type a message?");
        return;
      } else {
        await this.$axios.$post("email/contactus", {
          from: email,
          subject: "Conact from REGIONALE-ERNTE",
          text: message
        });
        // console.log('ok')
        this.setErr("Thank you for your feedback.");
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
    // this.email = this.$store.state.user.email;
  },
  components: {
    Submit
  }
};
</script>
<style scoped>
.clr {
  background: linear-gradient(rgb(180, 4, 127), rgb(241, 159, 204));
}
.close {
  position: absolute !important;
  right: -9px;
  top: 0;
}
</style>
