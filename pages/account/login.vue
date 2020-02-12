<template>
  <div style="margin-top: 50px;">
    <v-container text-xs-center>
      <v-layout row justify-center>
        <v-flex xs12 sm10 md8 lg6 class="login">
          <login-form-email/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import account from "@/layouts/account";
import loginFormEmail from "@/components/login-form-email";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
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
    hide() {
      this.$router.push("/my");
    }
  },
  components: {
    loginFormEmail
  },
  layout: "account",
  head() {
    return {
      title: "Login your account"
    };
  }
};
</script>
<style scoped>
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

.s-flex {
  display: flex;
  justify-content: space-between;
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
  padding-left: 15rem;
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
.info {
  /* background: linear-gradient(45deg, #ca45db, #ec9ef7); */
  background: linear-gradient(45deg, #316ba1, #72b7f8);
  /* border: 1px rgba(0, 0, 0, 0.125); */
  border-radius: 8px;
  padding: 30px;
  text-align: left;
}
.login {
  /* background: linear-gradient(45deg, #f4e7f7, aliceblue); */
  background: white;
  border-color: #0d47a1;
  padding: 50px 50px 30px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
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
  /* height: 580px; */
  /* background-color: #ffffff; */
  /* border: 1px solid rgba(0, 0, 0, 0.125); */
  border-bottom-right-radius: 0.7rem;
  box-shadow: 6px 6px 12px rgb(185, 189, 190);
}
</style>