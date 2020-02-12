<template>
  <div>
    <v-btn v-if="wished" color="secondary" @click="toggleWishlist()" :loading="loading">
      <v-icon>favorite</v-icon>&nbsp;{{$t('Wished')}}
    </v-btn>
    <v-btn v-if="!wished" @click="toggleWishlist()" :loading="loading">
      <v-icon>favorite</v-icon>&nbsp;{{$t('Add To Wishlist')}}
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["readOnly", "product", "variant"],
  data() {
    return {
      wished: false,
      loading: false
    };
  },
  watch: {
    "$store.state.login.show": function(val) {
      if (val === false) {
        this.checkWish();
      }
    }
  },
  components: {},
  methods: {
    ...mapMutations({
      showLoginModal: "login/showLoginModal"
    }),
    async checkWish() {
      this.wished = false;
      if (
        !this.$store.state.auth.token ||
        this.$store.state.auth.token == "undefined"
      )
        return;
      try {
        const data = await this.$axios.$get(
          "wishlists/product/" + this.product._id + "/" + this.variant._id
        );
        this.wished = data[0] ? true : false;
      } catch (e) {}
    },
    // On click select star
    toggleWishlist() {
      if (this.readOnly) return;
      if (!this.$store.state.auth.token) {
        this.showLoginModal({ show: true, initiator: "wish" });
      } else {
        this.save();
      }
    },
    loginSuccess() {
      this.checkWish(); // Shows 401 error after login
      // this.save() // Shows 401 error after login
      return;
    },
    async save() {
      this.loading = true;
      let p = { product: this.product, variant: this.variant };
      try {
        let data = await this.$axios.$post("wishlists", p);
        if (data.msg !== "deleted") {
          this.wished = true;
          this.message("Added to your wishlist"); // Should be at end because it returns false
        } else {
          this.wished = false;
          this.message("Removed from wishlist"); // Should be at end because it returns false
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.err(err);
      }
    },
    message(msg) {
      this.$store.commit("setErr", msg);
    },
    err(err) {
      this.$store.commit("setErr", err);
    }
  },
  created() {
    this.checkWish();
  },
  computed: {
    ...mapGetters({ isLoggedIn: "auth/isLoggedIn" })
  }
};
</script>