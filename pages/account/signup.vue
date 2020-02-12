<template>
  <div>
    <form class="sign-box" @submit.stop.prevent="submit" novalidate autocomplete="off">
      <v-container text-xs-center>
        <v-layout row justify-center>
          <v-flex xs12 sm8 md6 class="login">
            <div>
              <center>
                <div>
                  <v-text-field
                    name="name"
                    append-icon="name"
                    :label="$t('Name')"
                    v-model="name"
                    v-validate="'required'"
                    :error-messages="errors.collect('name')"
                  ></v-text-field>
                  <v-text-field
                    name="email"
                    append-icon="email"
                    browser-autocomplete="email"
                    :label="$t('Email')"
                    v-model="email"
                    v-validate="'required|email'"
                    :error-messages="errors.collect('email')"
                  ></v-text-field>
                  <!-- <v-text-field name="phone" append-icon="phone"  :label="$t('Phone')" v-model="phone" v-validate="'required|min:10|max:10|numeric'" :error-messages="errors.collect('phone')" ></v-text-field> -->
                  <v-text-field
                    type="password"
                    name="password"
                    append-icon="lock"
                    browser-autocomplete="new-password"
                    :label="$t('Password')"
                    v-model="password"
                    v-validate="'required'"
                    :error-messages="errors.collect('password')"
                  ></v-text-field>
                  <v-text-field
                    type="password"
                    name="confirmPassword"
                    browser-autocomplete="new-password"
                    append-icon="lock"
                    :label="$t('Confirm Password')"
                    v-model="confirmPassword"
                    v-validate="{ required : true,  confirmed: password}"
                    :error-messages="errors.collect('confirmPassword')"
                  ></v-text-field>
                </div>
                <p style="text-align: center">
                  {{$t('With click on the Sign up button I am accepting the')}}
                  <router-link to="/pages/agb">AGBs</router-link>
                  {{$t('and')}}
                  <router-link to="/pages/datenschutz">Datenschutz</router-link>
                </p>
                <br>
                <div>
                  <submit
                    :disabled="errors.any()"
                    :loading="loading"
                    icon="fingerprint"
                    color="secondary"
                    round
                    block
                    :text="$t('Sign up')"
                  />
                </div>
              </center>
              <br>
              <v-flex>
                <v-btn flat @click="go('/account/login')">{{$t('Sign in')}}</v-btn>
              </v-flex>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </form>
  </div>
</template>

<script>
import account from "@/layouts/account";
import Submit from "@/components/Submit";
import OauthButtons from "@/components/OauthButtons";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
      loading: false
    };
  },
  computed: {
    ...mapGetters({ error: "error" }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
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

      try {
        this.loading = true;
        const data = await this.$store.dispatch("auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role
        });
        if (data) {
          this.$store.commit(
            "setErr",
            "Welcome! Now you are ready to use Regionaleernte!"
          );

          this.loading = false;
          // this.$router.push("/");
        }
      } catch (err) {
        this.$store.commit("setErr", err);
        this.loading = false;
      }
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  },
  components: {
    Submit,
    OauthButtons
  },
  layout: "account",
  head() {
    return {
      title: "Create a new account"
    };
  }
};
</script>

<style lang="scss" scoped>
.icon-list {
  list-style: none;
  color: white;
}

.font_white {
  color: white;
}

i {
  float: left;
  margin-right: 8px;
}

.btn-round {
  background-color: black;
  border-radius: 50px;
  font-size: 15px;
  padding: 2px 20px 2px;
}
.bold {
  font-weight: normal;
}
p {
  margin-top: 35px;
  text-align: right;
  margin-right: -4px;
}
a {
  color: rgb(167, 167, 167);
  text-decoration: none;
}
a:hover {
  color: rgb(131, 131, 131);
}
li {
  margin-bottom: 10px;
}
h1 {
  margin-left: 3px;
}
h4 {
  margin-bottom: 20px;
  margin-left: 4px;
}

.login {
  /* background: linear-gradient(45deg, #f4e7f7, aliceblue); */
  background: white;
  border-color: #0d47a1;
  padding: 50px 50px 30px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin-top: 50px;
  color: black;
}
.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.btn-square {
  border: 1px solid black;
  border-radius: 0px;
  width: 20vw;
}
.card1 {
  font-family: Lato, arial, sans-serif;
  /* font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif; */
  /* font-size: 15px; */
  /* max-height: 580px; */
  /* background-color: #ffffff; */
  /* border: 1px solid rgba(0, 0, 0, 0.125); */
  border-bottom-right-radius: 0.7rem;
  box-shadow: 6px 6px 12px rgb(185, 189, 190);
}
</style>