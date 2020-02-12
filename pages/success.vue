<template>
  <v-container fluid>
    <v-layout>
      <v-layout align-center>
        <v-flex text-xs-center v-if="$route.query.id === 'Barzahlung'">
          <h5 class="display-1">
            <v-icon size="72" color="green">check_circle_outline</v-icon>
            <br>
            {{$t('Payment method')}}:
            <b>Barzahlung</b>
          </h5>
          <p>
            {{$t('Please handover amount')}}
            <span class="amount">{{$route.query.amount | currency}}</span>
            , {{$t('when our representative reach with the product')}}
          </p>
          <p>{{$t('And order has been sent to your email account.')}}</p>
          <p>
            {{$t('You may now check the')}}
            <router-link to="/my/orders">{{$t('Order Status')}}</router-link>
          </p>
        </v-flex>
        <v-flex text-xs-center v-else-if="$route.query.msg == 'success'">
          <h5 class="display-1">
            <v-icon size="72" color="green">check_circle_outline</v-icon>
            <br>
            {{$t('Payment Successful')}}
          </h5>
          <p>
            {{$t('Payment method')}}:
            <b>{{$route.query.method}}</b>
            <br>
            {{$t('Payment ID')}}:
            <b>{{$route.query.id}}</b>
            <br>
            {{$t('Payment Amount')}}:
            <b>{{$route.query.amount | currency}}</b>
            <br>
            {{$t('Order No')}}:
            <b>{{$route.query.orderNo}}</b>
          </p>
          <p>{{$t('And order has been sent to your email account.')}}</p>
          <p>
            {{$t('You may now check the')}}
            <router-link to="/my/orders">{{$t('Order Status')}}</router-link>
          </p>
        </v-flex>
        <v-flex text-xs-center v-else>
          <h5 class="display-1">
            <v-icon size="72" color="danger">warning</v-icon>
            {{$t('Payment failed. Please try again using different payment method')}}
          </h5>
          <p>
            {{$t('Payment ID')}}:
            <span class="amount">{{$route.query.id}}</span>
          </p>
          <p>
            {{$t('Reason')}}:
            <span class="bluee">{{$route.query.msg}}</span>
          </p>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>
<script>
import { clearCart } from "@/config";
export default {
  layout: "checkout",
  async created() {
    try {
      if (clearCart && this.$route.query.msg == "success")
        this.$store.commit("cart/clearCart", {});
    } catch (e) {}
  },
  head() {
    return {
      title: "Payment",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "This page receives payment status after payments made from payment gateway"
        }
      ]
    };
  }
};
</script>
<style scoped>
.bluee {
  color: blue;
}
.redd {
  color: red;
}
.amount {
  font-weight: bold;
  color: red;
}
</style>
