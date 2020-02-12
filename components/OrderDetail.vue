<template>
  <div>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-flex>
          <v-card :class="{cancel: order.status==='Cancellation Requested'}">
            <v-card-title :class="{error: order.status==='Cancellation Requested'}">
              <div class="text-center">
                <div class="headline">
                  {{$t('Order')}}
                  <b>{{order.orderNo}}</b>
                </div>
                <span
                  class="body-1 grey--text"
                  v-if="order.items"
                >{{$t('Placed on')}} {{order.createdAt | date}} . {{order.amount.total | currency}} {{$t('for')}} {{order.items.length}} {{$t('items')}}</span>
              </div>
              <v-spacer/>
              <v-alert :value="true" type="warning" v-if="order.cancellationComment">
                {{$t('Cancellation Reason')}}:
                <b>{{order.cancellationComment}}</b>
              </v-alert>
              <!--
              <div class="text-center">
                <v-btn
                  class="secondary"
                  @click="cancel(order)"
                  v-if="order.status!='Cancellation Requested'"
                >Cancel Order</v-btn>
              </div>
              -->
            </v-card-title>
            <v-layout row wrap>
              <v-flex>
                <v-list three-line v-for="i in order.items" :key="i.title">
                  <template>
                    <div>
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <img
                            v-if="i.url"
                            :src="i.url"
                            alt="product thumbnail"
                            onError="this.src='/product-placeholder.svg'"
                          >
                        </v-list-tile-avatar>&nbsp;&nbsp;&nbsp;
                        <v-list-tile-content>
                          <div>{{i.name | truncate(120)}}</div>
                          <div class="fx">
                            <div>
                              <v-list-tile-sub-title>
                                <b>{{$t('Amount')}}:</b>
                                {{i.price | currency}} x
                                <b>{{i.qty}}</b>
                                <div class="fx">
                                  <b>{{$t('Status:')}}</b>
                                  &nbsp; {{order.status}}
                                </div>
                              </v-list-tile-sub-title>
                            </div>
                          </div>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                  </template>
                </v-list>
              </v-flex>
              <v-flex>
                <div class="addr-align">
                  <v-card class="ma-1 address-card">
                    <v-card-title>
                      <h3 class="headline mb-0">{{$t('Address')}}</h3>
                    </v-card-title>
                    <v-list one-line>
                      <v-list-tile v-if="order.name">
                        <v-list-tile-action>
                          <v-icon class="blue--text text--lighten-2">person</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{order.name}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="order.address && order.address.zip">
                        <v-list-tile-action>
                          <v-icon class="blue--text text--lighten-2">place</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ order.address.houseNumber }}, {{ order.address.streetName }}, {{ order.address.city }} - {{ order.address.zip }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="order.phone">
                        <v-list-tile-action>
                          <v-icon class="blue--text text--lighten-2">phone</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{order.phone}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="order.email">
                        <v-list-tile-action>
                          <v-icon class="blue--text text--lighten-2">email</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{order.email}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="order.companyName">
                        <v-list-tile-action>
                          <v-icon class="blue--text text--lighten-2">account_balance</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{order.companyName}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <!-- </v-card-text> -->
                  </v-card>

                  <v-card>
                    <v-card-title class="headline">{{$t('Payment Summary')}}</v-card-title>
                    <v-card-text>
                      <v-list subheader>
                        <template>
                          <v-list-tile avatar ripple>
                            <v-list-tile-content>
                              <v-list-tile-title>{{$t('Total item price')}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-list-tile-action-text
                                v-if="order.amount"
                              >{{order.amount.details.subtotal | currency}}</v-list-tile-action-text>
                            </v-list-tile-action>
                          </v-list-tile>
                          <v-divider/>
                          <v-list-tile avatar ripple>
                            <v-list-tile-content>
                              <v-list-tile-title>{{$t('Shipping')}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action v-if="order.amount">
                              <v-list-tile-action-text v-if="order.amount==0">{{$t('FREE')}}</v-list-tile-action-text>
                              <v-list-tile-action-text
                                v-else
                              >{{order.amount.details.shipping | currency}}</v-list-tile-action-text>
                            </v-list-tile-action>
                          </v-list-tile>
                          <v-divider/>
                          <v-list-tile avatar ripple>
                            <v-list-tile-content>
                              <v-list-tile-title>{{$t('Total')}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-list-tile-action-text
                                v-if="order.amount"
                              >{{order.amount.total | currency}}</v-list-tile-action-text>
                            </v-list-tile-action>
                          </v-list-tile>
                          <v-subheader>{{$t("Payment Mode")}}</v-subheader>
                          <v-list-tile avatar ripple v-if="order.payment">
                            <v-list-tile-content>
                              <v-list-tile-title>{{order.payment.paymentMethod}}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-list-tile-action-text>
                                <v-chip label class="green" outline>
                                  <b>{{order.payment.status}}</b>
                                </v-chip>
                              </v-list-tile-action-text>
                            </v-list-tile-action>
                          </v-list-tile>
                          <v-subheader>
                            {{$t('Delivery service')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{order.deliveryService}}</strong>
                          </v-subheader>
                          <v-subheader v-if="order.deliveryService == 'Selbstabholung'">
                            {{$t('Pick Address')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{whereToPick}}</strong>
                          </v-subheader>
                          <v-subheader v-if="order.deliveryService == 'Selbstabholung'">
                            {{$t('Available Days')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{availableDaysForClick}}</strong>
                          </v-subheader>
                          <v-subheader v-if="order.deliveryService == 'Selbstabholung'">
                            {{$t('Available Time')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{availableTimeForClick}}</strong>
                          </v-subheader>
                          <v-subheader v-if="order.deliveryService == 'Lieferung'">
                            {{$t('Available Days')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{availableDaysForVendor}}</strong>
                          </v-subheader>
                          <v-subheader v-if="order.deliveryService == 'Lieferung'">
                            {{$t('Available Time')}}:
                            &nbsp;&nbsp;&nbsp;
                            <strong>{{availableTimeForVendor}}</strong>
                          </v-subheader>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
          </v-card>
          <v-divider/>
        </v-flex>
        <v-flex v-if="order.length===0 && !loading">
          <center>{{$t('Specified order not found')}}</center>
        </v-flex>
        <span v-if="loading" slot="loader" class="custom-loader">
          <v-icon light>cached</v-icon>
        </span>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { basic } from "@/mixins/";
import Vue from "vue";
export default {
  mixins: [basic],
  props: ["id"],
  data() {
    return {
      order: {},
      vendor: null,
      availableDaysForClick: "",
      availableTimeForClick: "",
      availableDaysForVendor: "",
      availableTimeForVendor: "",
      whereToPick: ""
    };
  },
  methods: {
    async save() {
      try {
        const data = await this.$axios.$put(
          "orders/" + this.order._id,
          this.order
        );
        this.$router.push("/orders");
      } catch (err) {}
    },
    cancel(order) {
      this.$swal({
        title: "Please let us know the reason.",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !swal.isLoading()
      }).then(result => {
        if (result.value) {
          this.cancelOrder({
            _id: order._id,
            status: "Cancellation Requested",
            cancellationComment: result.value
          });
        }
      });
    },
    async cancelOrder(order) {
      try {
        const data = await this.$axios.$put("orders/" + order._id, order);
        this.$router.push("/my/orders");
      } catch (err) {}
    }
    // this.$emit("cancelOrder", data);
  },
  computed: {
    ...mapGetters({
      loading: "loading"
    }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  async created() {
    this.order = await this.$axios.$get("orders/" + this.id);
    this.vendor = await this.$axios.$get("users/" + this.order.vendorId);

    for (let i = 0; i < this.vendor.availableDaysForClick.length; i++) {
      this.availableDaysForClick += this.vendor.availableDaysForClick[i] + " ";
    }

    this.availableTimeForClick =
      this.vendor.timeToPickFrom + " - " + this.vendor.timeToPickTo;

    for (let i = 0; i < this.vendor.availableDaysForSameday.length; i++) {
      this.availableDaysForVendor +=
        this.vendor.availableDaysForSameday[i] + " ";
    }

    this.availableTimeForVendor =
      this.vendor.timeForDeliveryFrom + " - " + this.vendor.timeForDeliveryTo;

    this.whereToPick = this.vendor.whereToPick;
  }
};
</script>
<style scoped>
.text-center {
  text-align: center;
}
.list--three-line .list__tile {
  height: 117px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
.addr-align {
  margin-left: 8px;
  margin-top: 10px;
}
.fx {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.w {
  flex-wrap: wrap;
}
</style>