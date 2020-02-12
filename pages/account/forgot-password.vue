<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container>
      <v-flex md6 offset-md3 sm8 offset-sm2>
        <v-card>
          <v-card-text>
            <form @submit.stop.prevent="submit" novalidate autocomplete="off">
              <div :class="{'v-input-invalid': errors.has('email')}">
                <v-text-field
                  :label="$t('Email')"
                  labelFloat
                  name="email"
                  type="email"
                  append-icon="email"
                  v-model="email"
                  v-validate="'required|email'"
                  :error-messages="errors.collect('email')"
                  autofocus
                ></v-text-field>
              </div>
              <submit
                color="secondary"
                :loading="loading"
                :disabled="errors.any()"
                block
                round
                icon="mail"
                :text="$t('Send Reset Password Email')"
              ></submit>
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
import Breadcrumb from "@/components/Breadcrumb";
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      email: "",
      breadcrumb: [
        { text: "Account", url: "/account/login", disabled: false },
        { text: "Change Password", disabled: true }
      ]
    };
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
    async submit() {
      const result = await this.$validator.validateAll();

      if (!result) {
        return;
      } else {
        try {
          const res = await this.$store.dispatch("auth/forgotPassword", {
            email: this.email
          });
          // console.log(res);
          // this.$store.commit("setInfo", res);
        } catch (e) {
          // console.log(e);
          this.$store.commit("setInfo", e.response.data);
        }
      }
    },
    onDismissed() {}
  },
  components: {
    Submit,
    Breadcrumb
  },
  created() {
    this.email = this.$route.query.email;
  },
  layout: "account",
  head() {
    return {
      title: "Recovery of Password"
    };
  }
};
</script>
<style scoped>
.w200 {
  width: 300px;
}
.card1 {
  font-family: Lato, arial, sans-serif;
  border-bottom-right-radius: 0.7rem;
  box-shadow: 6px 6px 12px rgb(185, 189, 190);
}
.login {
  background: linear-gradient(45deg, #f4e7f7, white);
  /* background: rgb(255, 255, 255); */
  border-color: #0d47a1;
  padding: 50px 50px 30px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  color: black;
}
</style>
