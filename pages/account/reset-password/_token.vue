<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container>
      <v-flex lg4 offset-lg4 md6 offset-md3 sm8 offset-sm2>
        <v-card>
          <v-card-text>
            <form @submit.stop.prevent="submit" novalidate autocomplete="off">
              <div :class="{'v-input-invalid': errors.has('password')}">
                <v-text-field
                  :label="$t('New Password')"
                  labelFloat
                  name="password"
                  type="password"
                  append-icon="remove_red_eye"
                  v-model="password"
                  v-validate="'required'"
                  :error-messages="errors.collect('password')"
                  autofocus
                ></v-text-field>
              </div>
              <div :class="{'v-input-invalid': errors.has('confirm')}">
                <v-text-field
                  :label="$t('Confirm Password')"
                  labelFloat
                  name="confirm"
                  type="password"
                  append-icon="remove_red_eye"
                  v-model="confirm"
                  v-validate="'required'"
                  :error-messages="errors.collect('confirm')"
                  autofocus
                ></v-text-field>
              </div>
              <Submit
                color="secondary"
                :loading="loading"
                :disabled="errors.any()"
                block
                round
                icon="mail"
                :text="$t('Reset Password')"
              ></Submit>
            </form>
            <center>
              <v-btn flat @click="go('/account/login')">
                <v-icon>keyboard_backspace</v-icon>
                {{$t('Back to login')}}
              </v-btn>
            </center>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import Submit from "@/components/Submit";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  props: ["id"],
  data() {
    return {
      token: null,
      password: "",
      confirm: "",
      breadcrumb: [
        { text: "Account", url: "/account/login", disabled: false },
        { text: "Reset Password", disabled: true }
      ]
    };
  },
  created() {
    this.token = this.$route.params.token;
  },
  computed: {
    ...mapGetters({ error: "error", loading: "loading" }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    submit() {
      this.$store.dispatch("auth/resetPassword", {
        id: this.token,
        password: this.password
      });
    }
  },
  components: {
    Submit,
    Breadcrumb
  },
  head() {
    return {
      title: "Reset Password"
    };
  },
  layout: "account"
};
</script>
