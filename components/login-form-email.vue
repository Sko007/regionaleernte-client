<template>
  <v-layout column>
    <form novalidate @submit.stop.prevent="submit" autocomplete="off">
      <div>
        <v-text-field
          name="email"
          :label="$t('Email')"
          v-model="email"
          browser-autocomplete="email"
          append-icon="email"
          v-validate="'required|email'"
          :error-messages="errors.collect('email')"
        ></v-text-field>
        <v-text-field
          name="password"
          color="primary"
          type="password"
          v-model="password"
          browser-autocomplete="new-password"
          append-icon="lock"
          v-validate="'required'"
          :error-messages="errors.collect('password')"
          :label="$t('Password')"
        ></v-text-field>
      </div>
      <v-layout row wrap>
        <v-flex xs12 sm5>
          <v-checkbox :label="$t('Remember Me')" height="0"></v-checkbox>
        </v-flex>
        <v-flex class="forget_password" xs12 sm4 offset-sm3>
          <a @click="go('/account/forgot-password?email='+email);close()">{{$t('Forgot Password?')}}</a>
        </v-flex>
      </v-layout>
      <br>
      <br>
      <v-layout>
        <submit
          :disabled="errors.any()"
          color="secondary"
          :round="true"
          :loading="loading"
          :block="true"
          :text="$t('Login')"
        ></submit>
        <v-btn flat @click="go('/account/signup');close()">{{$t('Sign up')}}</v-btn>
      </v-layout>
    </form>
  </v-layout>
</template>

<script>
import Submit from "@/components/Submit";
import { mapGetters } from "vuex";
import OauthButtons from "@/components/OauthButtons";

export default {
  data() {
    return {
      userExists: undefined,
      name: "",
      email: "",
      zone: "",
      qrno: "",
      password: "",
      OTP: false,
      loading: false
    };
  },
  computed: {
    // ...mapGetters({ loading: "loading" })
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    async submit() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
      });

      let data;

      try {
        this.loading = true;
        data = await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password
        });

        this.loading = false;
        this.$emit("hide");
      } catch (e) {
        this.$store.commit(
          "setErr",
          "Authentication Failed. Please try again."
        );
        this.loading = false;
      }
    },
    close() {
      this.$emit("hide");
    }
  },
  components: {
    Submit,
    OauthButtons
  }
};
</script>
<style scoped>
.s-flex {
  display: flex;
  justify-content: space-between;
}
h3 b {
  font-weight: bold;
}
.forget_password {
  margin-top: 7px;
  text-align: right;
}

@media (max-width: 480px) {
  .forget_password {
    text-align: left;
  }
}
</style>
