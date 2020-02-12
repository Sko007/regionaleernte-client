<template>
  <div>
    <Breadcrumb :items="breadcrumb"/>
    <order-detail :id="$route.params.id"/>
  </div>
</template>
<script>
import OrderDetail from "@/components/OrderDetail";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  data: () => {
    return {
      breadcrumb: [
        { text: "Home", url: "/", disabled: false },
        { text: "Dashboard", url: "/my", disabled: false },
        { text: "My Orders", url: "/my/orders", disabled: false },
        { text: "Order Detail", disabled: true }
      ]
    };
  },
  layout: "checkout",
  components: {
    OrderDetail,
    Breadcrumb
  },
  created() {},
  methods: {
    cancelOrderDialog(order) {
      let vm = this;
      this.$swal({
        input: "textarea",
        title: "Please let us know the reason",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes Cancel"
      }).then(result => {
        if (result.value) {
          vm.cancelConfirmed(order, result.value);
        }
      });
    },
    returnOrderDialog(order) {
      let vm = this;
      this.$swal({
        input: "textarea",
        title: "Are you sure to return the item?",
        text: "You won't be able to revert this!",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, return"
      }).then(result => {
        if (result.value) {
          vm.returnConfirmed(order, result.value);
        }
      });
    },
    async cancelConfirmed(order, reason) {
      order.status = "Cancellation Requested";
      order.cancellationComment = reason;
      let res = await this.$axios.$put("orders/" + order._id, order);
    },
    async returnConfirmed(order, reason) {
      order.returnComment = reason;
      order.status = "Return Initiated";
      let res = await this.$axios.$put("orders/" + order._id, order);
    }
  },
  head() {
    return {
      title: "Details of order"
    };
  }
};
</script>
