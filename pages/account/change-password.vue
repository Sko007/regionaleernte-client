<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex lg4 offset-lg4 md6 offset-md3 sm8 offset-sm2>
          <v-card>
            <v-card-text>
              <form @submit.stop.prevent="submit" novalidate>
                <input
                  type="text"
                  name="username"
                  value="..."
                  autocomplete="username"
                  style="display: none;"
                >
                <v-text-field
                  type="password"
                  v-model="password.oldPassword"
                  browser-autocomplete="current-password"
                  name="oldPassword"
                  v-validate="'required'"
                  :error-messages="errors.collect('oldPassword')"
                  autofocus
                  :label="$t('Current Password')"
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="password.newPassword"
                  browser-autocomplete="new-password"
                  name="newPassword"
                  v-validate="'required'"
                  :error-messages="errors.collect('newPassword')"
                  :label="$t('New Password')"
                ></v-text-field>
                <br>
                <submit
                  color="secondary"
                  @loading="loading"
                  :disabled="errors.any()"
                  :block="true"
                  icon="vpn_key"
                  :text="$t('Change Password')"
                ></submit>
              </form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Submit from "@/components/Submit";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  data() {
    return {
      isShow: false,
      loading: false,
      password: { oldPassword: "", newPassword: "" },
      breadcrumb: [
        { text: "Dashboard", url: "/", disabled: false },
        { text: "Change Password", disabled: true }
      ]
    };
  },
  methods: {
    async submit() {
      const result = await this.$validator.validateAll();

      if (!result) {
        return;
      } else {
        await this.$store.dispatch("auth/changePassword", this.password);
      }
    }
  },
  components: {
    Submit,
    Breadcrumb
  },
  layout: "account",
  head() {
    return {
      title: "Change Password"
    };
  }
};
</script>