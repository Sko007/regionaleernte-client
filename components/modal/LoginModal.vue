<template>
  <div>
    <v-dialog v-model="showLogin" persistent max-width="600px" class>
      <v-layout row fluid>
        <v-flex xs12>
          <div class="relative">
            <v-btn
              class="close"
              icon
              absolute
              right
              top
              @click="showLoginModal({show:false,btn:'cancel'})"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <div class="login">
              <login-form-email
                @submit="showLoginModal({show:false,btn:'submit'})"
                @hide="showLoginModal({show:false,btn:'cancel'})"
              />
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import loginFormEmail from "@/components/login-form-email";
export default {
  components: {
    loginFormEmail
  },
  data() {
    return {
      activeStep: 1
    };
  },
  computed: {
    showLogin: {
      get: function() {
        return this.$store.state.login.show;
      },
      set: function() {
        this.showLoginModal({ show: true }); // Only for the v-dialog model
      }
    }
  },
  methods: {
    ...mapMutations({
      showLoginModal: "login/showLoginModal"
    }),
    hide() {
      this.showLoginModal({ show: false, btn: "cancel" });
    }
  }
};
</script>

<style scoped>
.btn--top.btn--absolute {
  top: inherit !important;
  /* right: inherit !important; */
  margin-right: -15px;
}

.font_white {
  color: white;
}

.login {
  padding: 50px 50px 30px;
  background: white;
}
/* .close {
  position: absolute !important;
  top: 20px;
  right: 500px;
} */
.close {
  margin-top: 25px;
  margin-right: -15px;
}
.icon-list {
  list-style: none;
}
.icon-list li {
  display: flex;
  margin-bottom: 10px;
  color: white;
}
h1 {
  margin-left: 3px;
}
h4 {
  margin-bottom: 20px;
  margin-left: 4px;
}
.relative {
  position: relative;
}
</style>
