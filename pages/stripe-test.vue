<template>
  <div>
    <div class="content">
      <transition name="fade">
        <form class="payment" v-if="status !== 'failure'" @submit.prevent="pay">
          <h3>Please enter your payment details:</h3>
          <div class="field">
            <label class="label" for="email">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input"
                id="email"
                type="email"
                required="required"
                v-model="stripeEmail"
                placeholder="name@example.com"
                name="email"
                labelFloat
                v-validate="'required|email'"
                :error-messages="errors.collect('email')"
                :class="{ 'is-danger': errors.has('email') }"
              >
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
              <span class="icon is-small is-right" v-if="errors.has('email')">
                <i class="fa fa-exclamation-triangle"></i>
              </span>
              <p class="help is-danger" v-if="errors.has('email')">{{ errors.first('email') }}</p>
            </div>
          </div>
          <div class="field">
            <label class="label" for="card">Credit Card</label>
            <p class="help">
              Test using this credit card:&nbsp;
              <strong>
                4242 4242 4242 4242,
                <br>
              </strong>and enter any 5 digits for the zip code
            </p>
          </div>
          <div class="field">
            <card
              class="stripe-card input"
              id="card"
              :class="{ complete }"
              :stripe="stripePublishableKey"
              @change="complete = $event.complete"
            ></card>
          </div>
          <div class="field">
            <button
              class="button is-success pay-with-stripe"
              :disabled="!complete || errors.any()"
              :class="{ 'is-loading': isLoading }"
            >Pay with credit card</button>
          </div>
        </form>
        <div class="statusFailure has-text-centered" v-if="status === 'failure'">
          <h3>Oh No!</h3>
          <p>Something went wrong!</p>
          <button class="button" @click="clearCart">Please try again</button>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Card, createToken } from "vue-stripe-elements-plus";
import { STRIPE_URL, STRIPE_PUBLISHABLE_KEY } from "@/config";
import { mapActions } from "vuex";

export default {
  head: {
    script: [{ src: "https://js.stripe.com/v3/" }]
  },
  data() {
    return {
      selectedAddress: {},
      total: 20,
      submitted: false,
      complete: false,
      status: undefined,
      response: undefined,
      isLoading: false,
      stripeEmail: "admin@codenx.com",
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY
    };
  },
  components: {
    Card
  },
  created() {
    // this.checkout({ address: this.selectedAddress });
  },
  methods: {
    ...mapActions({
      checkout: "cart/checkout"
    }),
    // instamojoPay() {}

    async pay() {
      const { token } = await createToken();
      try {
        const stripeRespone = await this.$axios.$post(
          "pay/stripe",
          {
            email: this.stripeEmail,
            token,
            amount: this.total * 100 // must be in cent
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        // console.log("errrrrrrrrrrrr", stripeRespone);
        // this.clearCart();
      } catch (err) {
        // console.log("errrrrrrrrrrrrr", err.response.data);
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="stylus">
.payment {
  border: 1px solid #ccc;
  max-width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.stripe-card {
  margin-bottom: 10px;

  &.input {
    display: block;
  }
}

/* -- transition -- */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
