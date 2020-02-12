<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex>
          <h3 style="color: white;">{{$t('Verify Email')}}</h3>
          <h5 style="color: white;">{{msg}}</h5>
          <v-btn color="white" flat @click="go('/account/login')">
            <v-icon>keyboard_backspace</v-icon>
            {{$t('Back to login')}}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
const Submit = () => import("@/components/Submit");
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  props: ["id"],
  data() {
    return {
      token: null,
      msg: "",
      password: "",
      confirm: "",
      breadcrumb: [
        { text: "Account", url: "/account/login", disabled: false },
        { text: "Reset Password", disabled: true }
      ]
    };
  },
  async created() {
    try {
      this.token = this.$route.params.id;
      let result = await this.$axios.$get("/users/verify/" + this.token);
      this.msg = result;
    } catch (e) {
      this.msg = e.response.data;
    }
  },
  computed: {
    ...mapGetters({ user: "user/user", error: "error", loading: "loading" })
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    submit() {
      this.$store.dispatch("user/resetPassword", {
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
      title: "Verify Email"
    };
  },
  layout: "account"
};
</script>
