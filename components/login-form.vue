<template>
  <div>
    <form @submit.stop.prevent="submit" novalidate autocomplete="off">
      <center>
        <h3>
          <b>{{$t('SIGN IN')}}</b> {{$t('TO YOUR ACCOUNT')}}</h3>
        <div>
          <v-text-field validate-on-blur ref="phone" name="phone" v-model="phone" label="Enter Mobile No" labelFloat v-validate="'required|min:10|max:10|numeric'" :error-messages="errors.collect('phone')" autofocus :loading="loading" :append-icon="'phone'"></v-text-field>
          <v-alert outline v-if="OTP" type="success" :value="true">OTP sent to your mobile</v-alert>
          <v-alert outline v-if="newUser" type="success" :value="true">Welcome to {{$store.state.settings.shopName}}.</v-alert>
          <v-text-field validate-on-blur ref="password" type="password" name="password" v-model="password" :label="passwordLabel" labelFloat v-validate="'required'" :error-messages="(wrongPassword ? 'Invalid Password or OTP' : errors.collect('password'))" :append-icon="(wrongPassword ? 'bug_report' : 'short_text')"></v-text-field>
        </div>
        <div class="s-flex">
          <submit color="primary" :full="true" icon="fingerprint" :text="$t('Sign In')" :disabled="errors.any()"></submit>
          <span>
            <v-btn flat @click="go('/account/forgot-password')">{{$t('Forgot Password?')}}</v-btn>
          </span>
        </div>
        <br/>
        <v-divider/>
        <br/>
        <oauth-buttons/>
        <p>
          <v-btn flat @click="go('/account/signup')">{{$t('New here?')}} {{$t('Sign up')}}</v-btn>
        </p>
      </center>
    </form>
  </div>
</template>

<script>
import Submit from "@/components/Submit";
import OauthButtons from "@/components/OauthButtons";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      newUser: false,
      name: "",
      email: "",
      zone: "",
      qrno: "",
      phone: "",
      password: "",
      OTP: false,
      typingTimer: null,
      wrongPassword: false,
      passwordLabel: "Enter Password or OTP"
    };
  },
  watch: {
    phone(value) {
      if (value.length === 10) this.checkPhone();
    }
  },
  computed: {
    ...mapGetters({ loading: "loading" })
  },
  methods: {
    async sendOtp(phone) {
      this.wrongPassword = false;
      if (!phone || phone == "") {
        this.$store.commit("setErr", "Please enter phone number");
        this.$refs.phone.focus();
        return;
      }
      try {
        let data = await this.$axios.$post("users/sendOtp", { phone });
        if (data) {
          if (data.message === "Phone ok") {
            // this.passwordLabel = "Enter password";
            this.newUser = false;
          }
          if (data.message === "OTP sent to mobile.") {
            this.passwordLabel = "Enter OTP";
            this.OTP = true;
          } else {
            // this.passwordLabel = "Enter Password";
            this.OTP = false;
          }
          this.$refs.password.focus();
        } else {
          this.$store.commit("setErr", "Phone not registered");
          this.passwordLabel = "Enter OTP";
        }
      } catch (e) {
        this.$store.commit("setErr", e.response.data.message);
      }
    },
    async checkPhone() {
      this.wrongPassword = false;
      if (this.phone && this.phone !== "") {
        try {
          const res = await this.$axios.get("users/phone/" + this.phone);
          const data = res.data;
          const status = res.status;
          if (status === 200) {
            // User exist
            if (data.message === "Phone ok") {
              this.newUser = false;
            }
            if (data.message === "OTP sent to mobile.") {
              this.passwordLabel = "Enter OTP";
              this.OTP = true;
            } else {
              this.OTP = false;
            }
            this.$refs.password.focus();
          } else {
            // New user created
            this.newUser = true;
            this.$store.commit(
              "setErr",
              "Welcome to " + this.$store.state.settings.shopName
            );
            this.passwordLabel = "Enter OTP";
            this.$refs.password.focus();
          }
        } catch (e) {
          let err = e.response && e.response.data;
          this.newUser = true;
          this.passwordLabel = "Enter OTP";
          this.$store.commit("setErr", err);
        }
      } else {
        this.$store.commit("setErr", "Phone no can not be blank");
        this.$refs.phone.focus();
      }
      return;
    },
    async submit() {
      let data;
      if (this.password === "") {
        this.$store.commit("setErr", "Please enter your Password");
        this.wrongPassword = true;
        this.$refs.password.focus();
        return;
      }
      try {
        data = await this.$store.dispatch("user/login", {
          phone: this.phone,
          password: this.password
        });
        if (!data) {
          this.$store.commit("setErr", "Invalid password");
          this.wrongPassword = true;
          this.$refs.password.focus();
        } else {
          this.wrongPassword = false;
          // this.$router.push("/my");
          this.$emit("submit", false); // We can not directly hide the modal from here. Because this component could be called from other pages (e.g. checkout) than a modal
        }
      } catch (e) {
        this.wrongPassword = true;
        // this.$store.commit("setErr", e);
      }
    },
    go(url) {
      // this.show = false;
      this.$emit("hide");
      this.$router.push(url);
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
</style>
