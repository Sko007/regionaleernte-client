<template>
  <div>
    <v-container>
      <v-layout row>
        <v-flex xs12>
          <v-layout column>
            <div>
              <h3 style="float: left;">{{$t('Ready?')}}</h3>
              <v-btn
                @click="go('/wine')"
                color="secondary"
                style="float: right"
              >{{$t('Add more items')}}</v-btn>
            </div>
            <div style="clear: both"></div>
            <form @submit.stop.prevent="placeOrder()" novalidate>
              <v-stepper v-model="step" vertical>
                <v-stepper-step step="1" :complete="step > 1" editable>
                  <h5>{{$t('How should the products be delivered?')}}</h5>
                </v-stepper-step>
                <v-container step="1" v-if="cartVendors">
                  <v-flex class="cart_vendor_item" v-for="(vendor, ix) in cartVendors" :key="ix">
                    <v-flex xs12>
                      <p class="vendor_title" @click="go('/store/' + vendor._id)">{{vendor.name}}</p>
                    </v-flex>
                    <v-layout row wrap>
                      <v-flex xs12 md3>
                        <v-list two-line>
                          <template v-for="item in vendor.cartProducts">
                            <v-list-tile
                              @click="go('/store/'+item.vendorId+'/'+item.productId)"
                              avatar
                              :key="item.productId"
                            >
                              <v-list-tile-avatar>
                                <img v-if="item.img" :src="'/' + item.img">
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title class="product-name" v-html="item.name"></v-list-tile-title>
                                <v-list-tile-sub-title>
                                  <b
                                    class="price"
                                  >{{item.hot ? item.sellingPrice : item.originalPrice | currency}}</b>
                                  x {{item.qty}}
                                </v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </template>
                        </v-list>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-radio-group
                          v-model="selectedServices[ix]"
                          @change="updateSelectedService"
                        >
                          <v-radio
                            v-for="(service, key) in vendor.deliveryServices"
                            :key="key"
                            :label="service"
                            :value="service"
                          ></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 md6>
                        <div v-if="selectedServices[ix] == 'Selbstabholung'">
                          <p>
                            <span class="info_title">{{$t('Place')}}:</span>
                            {{vendor.formattedAddress ? vendor.formattedAddress : vendor.address.formattedAddress}}
                          </p>
                          <v-layout class="desc_item">
                            <v-flex>
                              <p>
                                <span class="info_title">{{$t('Available Days')}}:</span>
                                <span
                                  class="dayItem"
                                  v-for="day in vendor.availableDaysForClick"
                                  :key="day"
                                >{{day}}</span>
                              </p>
                              <p>
                                <span>
                                  <strong>{{$t('Morning') + ' ' + $t('between')}}</strong>
                                  {{vendor.timeToPickFrom}} - {{vendor.timeToPickTo}}
                                  <strong>Uhr und</strong>
                                </span>
                              </p>
                              <p>
                                <span>
                                  <strong>{{$t('Afternoon') + ' ' + $t('between')}}</strong>
                                  {{vendor.timeToPickFrom2}} - {{vendor.timeToPickTo2}}
                                  <strong>Uhr</strong>
                                </span>
                              </p>
                            </v-flex>
                          </v-layout>
                        </div>

                        <div v-if="selectedServices[ix] == 'Versand'">
                          <p>
                            {{$t('This vendor taskes shipping cost of ')}}
                            <strong>&euro;{{vendor.shippingCost}}</strong>
                            {{$t('within German')}}
                          </p>
                          <!-- <p>
                            <span class="info_title">{{$t('Minimum amount for free shipping')}}:</span>
                            &euro;{{vendor.freeAmountForShipping}}
                          </p>-->
                        </div>

                        <div v-if="selectedServices[ix] == 'Lieferung'">
                          <div class="desc_item">
                            <p>
                              <span class="info_title">{{$t('Available Days')}}:</span>
                              <span
                                class="dayItem"
                                v-for="day in vendor.availableDaysForSameday"
                                :key="day"
                              >{{day}}</span>
                              <span>
                                <strong>{{$t('between')}}</strong>
                                {{vendor.timeForDeliveryFrom}} - {{vendor.timeForDeliveryTo}}
                                <strong>Uhr</strong>
                              </span>
                            </p>
                          </div>
                          <div class="desc_item">
                            <p>
                              <span>
                                <strong>{{$t('Amount for free delivery')}}:</strong>
                                &euro;{{vendor.minAmountForSameDayDelivery}}
                              </span>
                            </p>
                          </div>

                          <div class="desc_item">
                            <p>
                              <span>
                                <strong>{{$t('Deliverycosts')}}:</strong>
                                &euro;{{vendor.shippingCost}}
                              </span>
                            </p>
                          </div>

                          <div class="desc_item">
                            <span class="info_title">{{$t('Available Zipcodes')}}:</span>
                            <span
                              class="zipCodeItem"
                              v-for="zip in vendor.zipCodes"
                              :key="zip"
                            >{{zip}}</span>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <div class="payment_summary">
                    <p>{{$t('Subtotal')}}: &nbsp; {{ getSubtotal | currency }}</p>
                    <p>{{$t('Delivery Cost')}}: &nbsp; {{ getCartTotalCost - getSubtotal | currency }}</p>
                    <p>
                      <strong>{{$t('Total Cost')}}: &nbsp; {{ getCartTotalCost | currency }}</strong>
                    </p>
                  </div>
                </v-container>
                <v-stepper-step
                  :step="isShipping ? 2 : 0"
                  v-if="isShipping"
                  :complete="step > 2"
                  editable
                >
                  <h5>{{$t('Where should the products be delivered?')}}</h5>
                </v-stepper-step>
                <v-container :step="isShipping ? 2 : 0" v-if="isShipping">
                  <v-layout row wrap v-if="!getUser">
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        class="px-1"
                        name="houseNumber"
                        v-model="houseNumber"
                        :label="$t('House Number') + ' *'"
                        v-validate="'required'"
                        :error-messages="errors.collect('houseNumber')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        class="px-1"
                        name="streetName"
                        v-model="streetName"
                        :label="$t('Street Name') + ' *'"
                        v-validate="'required'"
                        :error-messages="errors.collect('streetName')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        class="px-1"
                        name="city"
                        v-model="city"
                        :label="$t('City') + ' *'"
                        v-validate="'required'"
                        :error-messages="errors.collect('city')"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        class="px-1"
                        name="zip"
                        v-model="zip"
                        :label="$t('Zipcode') + ' *'"
                        v-validate="'required'"
                        :error-messages="errors.collect('zip')"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-flex>
                    <div v-if="showAddressForm" style="width: 100%">
                      <form
                        novalidate
                        @submit.stop.prevent="saveAddress({houseNumber, streetName, city, zip})"
                      >
                        <v-layout row wrap>
                          <v-flex xs12 sm6 md3>
                            <v-text-field
                              class="px-1"
                              name="houseNumber"
                              v-model="houseNumber"
                              :label="$t('House Number') + ' *'"
                              v-validate="'required'"
                              :error-messages="errors.collect('houseNumber')"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md3>
                            <v-text-field
                              class="px-1"
                              name="streetName"
                              v-model="streetName"
                              :label="$t('Street Name') + ' *'"
                              v-validate="'required'"
                              :error-messages="errors.collect('streetName')"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md3>
                            <v-text-field
                              class="px-1"
                              name="city"
                              v-model="city"
                              :label="$t('City') + ' *'"
                              v-validate="'required'"
                              :error-messages="errors.collect('city')"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md3>
                            <v-text-field
                              class="px-1"
                              name="zip"
                              v-model="zip"
                              :label="$t('Zipcode') + ' *'"
                              v-validate="'required'"
                              :error-messages="errors.collect('zip')"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row>
                          <submit
                            color="primary"
                            :round="true"
                            :full="true"
                            icon="location_on"
                            text="Save Address"
                            :disabled="errors.any()"
                          ></submit>
                          <v-btn
                            v-if="addresses.length>0"
                            round
                            color="secondary"
                            @click="cancelAddressForm"
                          >{{$t('Cancel')}}</v-btn>
                        </v-layout>
                      </form>
                    </div>
                    <v-radio-group
                      v-if="!showAddressForm && getUser"
                      v-model="selectedAddress"
                      @change="savePrimaryAddress"
                      :mandatory="false"
                    >
                      <div v-for="address in addresses" :key="address._id">
                        <v-radio :value="address" class="radio_address">
                          <template v-slot:label>
                            <span
                              class="radio_address_label"
                            >{{address.houseNumber}}, {{address.streetName}}, {{address.city}} {{address.zip}}</span>
                          </template>
                        </v-radio>
                      </div>
                      <v-btn
                        color="primary"
                        round
                        block
                        @click="openAddressForm"
                      >{{$t('New Address')}}</v-btn>
                    </v-radio-group>
                  </v-flex>
                </v-container>
                <v-stepper-step :step="isShipping ? 3 : 2" :complete="step > 3" editable>
                  <h5>{{$t('How can we reach you?')}}</h5>
                </v-stepper-step>
                <v-container :step="isShipping ? 3 : 2">
                  <v-flex>
                    <v-layout column>
                      <v-flex>
                        <v-layout row wrap>
                          <v-flex md6>
                            <v-text-field
                              name="name"
                              class="px-1"
                              v-validate="'required'"
                              :error-messages="errors.collect('name')"
                              v-model="name"
                              :label="$t('Name') + ' *'"
                            ></v-text-field>
                          </v-flex>
                          <v-flex md6>
                            <v-text-field
                              name="email"
                              class="px-1"
                              v-model="email"
                              :label="$t('Email') + ' *'"
                              v-validate="'required|email'"
                              :error-messages="errors.collect('email')"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <v-layout row wrap>
                          <v-flex md6>
                            <v-text-field
                              name="phone"
                              class="px-1"
                              v-model="phone"
                              :label="$t('Phone number') + ' *'"
                              v-validate="'required|max:20|numeric'"
                              :error-messages="errors.collect('phone')"
                            ></v-text-field>
                          </v-flex>
                          <v-flex md6>
                            <v-text-field
                              class="px-1"
                              v-model="companyName"
                              :label="$t('Company name')"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-container>
                <v-stepper-step :step="isShipping ? 4 : 3" :complete="step > 4" editable>
                  <h5>{{$t('Payment Details')}}</h5>
                </v-stepper-step>
                <v-container :step="isShipping ? 4 : 3">
                  <div v-if="getSubtotal===0">
                    <h3>
                      {{$t('Your Cart found empty.')}}
                      <br>
                      <router-link to="/">{{$t('Please add some items')}}</router-link>.
                    </h3>
                  </div>
                  <v-layout column v-else>
                    <div class="flex">
                      <div>{{$t('Cart Total')}}: {{ getCartTotalCost | currency }}</div>
                      <v-btn round flat @click="toggleCart">
                        <v-icon>shopping_cart</v-icon>
                        {{$t('Check Cart')}}
                      </v-btn>
                    </div>

                    <v-radio-group
                      v-if="isPaymentLoaded"
                      v-model="paymentMethod"
                      row
                      :label="$t('Payment Method')"
                    >
                      <v-radio
                        v-for="n in paymentMethodsFilter(paymentMethods)"
                        :key="n"
                        :label="`${n}`"
                        :value="n"
                      ></v-radio>
                    </v-radio-group>
                    <div v-if="paymentMethod==='Creditcard'" class="stripe">
                      <card
                        class="stripe-card input"
                        id="card"
                        :class="{ complete }"
                        :stripe="stripePublishableKey"
                        @change="complete = $event.complete"
                      ></card>
                    </div>
                    <div v-show="paymentMethod==='SEPA'">
                      <div class="stripe" id="iban"></div>
                      <div id="bank-name"></div>
                      <div id="error-message" role="alert"></div>
                      <v-layout id="mandate-acceptance" row align-start>
                        <v-flex xs1>
                          <v-icon color="orange" large>error_outline</v-icon>
                        </v-flex>
                        <v-flex xs11>{{$t('iban_desc')}}</v-flex>
                      </v-layout>
                    </div>
                    <div v-if="!isCODAvailable">
                      <v-layout id="mandate-acceptance" row align-start>
                        <v-flex xs1>
                          <v-icon color="orange" medium>error_outline</v-icon>
                        </v-flex>
                        <v-flex xs11>{{$t('cod_desc')}}</v-flex>
                      </v-layout>
                    </div>
                    <div>
                      <p style="text-align: center">
                        {{$t('With click on the Place Order button I am accepting the')}}
                        <router-link to="/pages/agb">AGBs</router-link>
                        {{$t('and')}}
                        <router-link to="/pages/datenschutz">Datenschutz</router-link>
                      </p>
                    </div>
                    <v-btn
                      type="submit"
                      :disabled="disable"
                      :loading="loading"
                      class="primary"
                      block
                      round
                    >
                      <v-icon>shopping_cart</v-icon>
                      {{$t('Place Order')}}
                    </v-btn>
                  </v-layout>
                </v-container>
              </v-stepper>
            </form>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-dialog v-model="alert" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-3">{{$t('Info')}}</v-card-title>
          <v-card-text>{{ message }}</v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { Card, createToken, CardNumber } from "vue-stripe-elements-plus";
import { STRIPE_PUBLISHABLE_KEY } from "@/config";
import Submit from "@/components/Submit";
import Vue from "vue";

export default {
  layout: "checkout",
  data() {
    return {
      loading: false,
      alert: false,
      addresses: [],
      selectedAddress: null,
      showAddressForm: false,
      message: "",
      name: "",
      houseNumber: "",
      streetName: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      companyName: "",
      paymentMethod: "Creditcard",
      step: 1,
      weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      complete: false,
      stripe: null,
      stripeEmail: "admin@codenx.com",
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
      iban: null,
      isCODAvailable: false,
      sepa: "",
      selectedServices: [],
      paymentMethods: [],
      isPaymentLoaded: false,
      isShipping: false,
      isValidSEPA: false,
    };
  },
  components: { Submit, Card },
  computed: {
    ...mapGetters({
      cartItems: "cart/getItems",
      cartVendors: "cart/getCartVendors",
      getCartTotalCost: "cart/getCartTotalCost",
      getSubtotal: "cart/getSubtotal",
      getUser: "auth/getUser"
    }),
    disable() {
      if (this.paymentMethod === "Creditcard")
        return !this.complete || this.errors.any();
      else if (this.paymentMethod === "SEPA")
        return !this.isValidSEPA
      else return this.errors.any();
    }
  },
  async created() {
    // if user force refresh the checkout page, redirect to
    this.paymentMethods = this.$store.state.settings.paymentMethods;
    if (!this.paymentMethods) {
      let settings = await this.$axios.$get("settings");
      this.paymentMethods = settings[0].paymentMethods;
    }

    this.isPaymentLoaded = true;

    // get current logged-in User
    if (this.getUser) {
      this.name = this.getUser.name;
      this.email = this.getUser.email;
      this.phone = this.getUser.phone;
      this.companyName = this.getUser.businessName;

      // get user addresses
      this.populateAddress();

      // check if this user placed an order
      let userId = this.getUser._id;
      let orders = await this.$axios.$get("orders/my");

      if (orders.length > 0) {
        this.isCODAvailable = true;
      }
    }

    // init selectedServices variable and save to store
    if (this.cartVendors.length > 0) {
      for (let i = 0; i < this.cartVendors.length; i++) {
        this.selectedServices.push("");
      }
      this.$store.commit("cart/saveDeliveryServices", this.selectedServices);
    }
  },
  mounted() {
    if (this.cartVendors.length > 0) {
      // create IBAN element
      this.stripe = Stripe(this.stripePublishableKey);
      let elements = this.stripe.elements();
      let style = {
        base: {
          color: "#32325d",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          },
          ":-webkit-autofill": {
            color: "#32325d"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
          ":-webkit-autofill": {
            color: "#fa755a"
          }
        }
      };

      this.iban = elements.create("iban", {
        style: style,
        supportedCountries: ["SEPA"]
      });

      // attach element to div
      // this.iban.mount(this.$refs.iban);
      this.iban.mount(document.getElementById("iban"));

      let errorMessage = document.getElementById("error-message");
      let bankName = document.getElementById("bank-name");

      let vm = this;

      this.iban.on("change", function(event) {
        // Handle real-time validation errors from the iban Element.
        if (event.error) {
          vm.isValidSEPA = false;
          errorMessage.textContent = event.error.message;
          errorMessage.classList.add("visible");
        } else {
          vm.isValidSEPA = true;
          errorMessage.classList.remove("visible");
        }

        if(event.empty)
          vm.isValidSEPA = false;

        // Display bank name corresponding to IBAN, if available.
        if (event.bankName) {
          bankName.textContent = event.bankName;
          bankName.classList.add("visible");
        } else {
          bankName.classList.remove("visible");
        }
      });
    }
  },

  methods: {
    ...mapMutations({
      toggleCart: "cart/toggleCart"
    }),
    ...mapActions({
      checkout: "cart/checkout"
    }),
    go(url) {
      this.$router.push(url);
    },
    async populateAddress() {
      let addresses = await this.$axios.$get("addresses/my");
      this.addresses = addresses;
    },
    async getMyAddress() {
      try {
        if (!this.getUser) return;
        this.addresses = await this.$axios.$get("addresses/my");
        if (this.addresses.length === 0) {
          this.selectedAddress = {
            houseNumber: "",
            streetName: "",
            city: "",
            zip: ""
          };
          this.showAddressForm = true;
        } else {
          this.selectedAddress = this.addresses[0];
          this.showAddressForm = false;
        }
      } catch (e) {}
    },
    savePrimaryAddress(address) {
      this.houseNumber = address.houseNumber;
      this.streetName = address.streetName;
      this.city = address.city;
      this.zip = address.zip;
    },
    async saveAddress(address) {
      const result = await this.$validator.validateAll();

      if (!result) {
        return;
      }

      this.selectedAddress = address;
      try {
        address.updated = Date.now();
        await this.$axios.$post("addresses", address);
        this.getMyAddress();
      } catch (e) {}
    },
    async openAddressForm() {
      this.city = "";
      this.zip = "";
      this.houseNumber = "";
      this.streetName = "";

      this.selectedAddress = {
        city: "",
        zip: "",
        streetName: "",
        houseNumber: ""
      };
      this.showAddressForm = true;
    },
    cancelAddressForm() {
      this.showAddressForm = false;
      this.selectedAddress = this.addresses[0];
    },
    paymentMethodsFilter(methods) {
      let isCODAvailable = this.isCODAvailable;
      return methods.filter(function(method) {
        if (method == "Barzahlung" && !isCODAvailable) return false;
        else return true;
      });
    },
    updateSelectedService(val) {
      this.isShipping = false;
      for (let i = 0; i < this.cartVendors.length; i++) {
        if (
          this.selectedServices[i] == "Versand" ||
          this.selectedServices[i] == "Lieferung"
        )
          this.isShipping = true;
      }

      // save deliverServices to store
      this.$store.commit("cart/saveDeliveryServices", this.selectedServices);
    },
    async placeOrder() {
      this.loading = true;

      const result = await this.$validator.validateAll();

      if (!result) {
        this.loading = false;
        return;
      } else {
        for (let i = 0; i < this.cartVendors.length; i++) {
          // check if deliveryService is selected
          if (this.selectedServices[i] == "") {
            this.message = "Bitte Lieferservice auswählen.";
            this.alert = true;
            this.loading = false;
            return;
          }

          // check if zip code is inputed when deliveryService is 'shipping' or 'vendor delivery'
          if (this.selectedServices[i] == "Lieferung") {
            if (this.cartVendors[i].zipCodes.indexOf(this.zip) < 0) {
              this.message =
                "Ihre Adresse ist für den angegebenen Lieferservice nicht verfügbar.";
              this.alert = true;
              this.loading = false;
              return;
            }
          }

          if (this.selectedServices[i] == "Versand" && !this.zip) {
            this.message = "Bitte Adresse auswählen.";
            this.alert = true;
            this.loading = false;
            return;
          }

          // if (this.selectedServices[i] == "Lieferung") {
          //   // check if 'Vendor Delivery' is available
          //   let subTotal = 0;
          //   for (let j = 0; j < this.cartVendors[i].cartProducts.length; j++) {
          //     subTotal += this.cartVendors[i].cartProducts[j].hot
          //       ? this.cartVendors[i].cartProducts[j].sellingPrice *
          //         this.cartVendors[i].cartProducts[j].qty
          //       : this.cartVendors[i].cartProducts[j].originalPrice *
          //         this.cartVendors[i].cartProducts[j].qty;
          //   }
          //   if (subTotal < this.cartVendors[i].minAmountForSameDayDelivery) {
          //     this.message =
          //       "Der Mindestwert für die Lieferantenlieferung beträgt €" +
          //       this.cartVendors[i].minAmountForSameDayDelivery +
          //       ". Bitte fügen Sie weitere Produkte für Vendor Delivery Service hinzu oder wählen Sie einen anderen Lieferservice aus.";

          //     this.alert = true;
          //     this.loading = false;
          //     return;
          //   }
          // }
        }

        // check if products has available stock
        for (let i = 0; i < this.cartItems.length; i++) {
          let productId = this.cartItems[i].productId;
          let productInfo = await this.$axios.$get("products/" + productId);
          if (this.cartItems[i].qty > productInfo.stock) {
            this.message =
              "Not enough stock for '" +
              this.cartItems[i].name +
              "'." +
              "Its stock is " +
              productInfo.stock;
            this.alert = true;
            this.loading = false;
            return;
          }
        }

        // process if current paymentMethods equals SEPA
        if (this.paymentMethod == "SEPA") {
          let sourceData = {
            type: "sepa_debit",
            currency: "eur",
            owner: {
              name: this.name,
              email: this.email
            },
            mandate: {
              // Automatically send a mandate notification email to your customer
              // once the source is charged.
              notification_method: "email"
            }
          };

          let errorMessage = document.getElementById("error-message");
          let bankName = document.getElementById("bank-name");


          // goto cart store for checkout process
          if (!this.selectedAddress) {
            this.selectedAddress = {
              houseNumber: this.houseNumber,
              streetName: this.streetName,
              city: this.city,
              zip: this.zip
            };
          }

          this.checkout({
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.selectedAddress,
            companyName: this.companyName,
            paymentMethod: this.paymentMethod,
            amount: this.getTotal,
            stripeInstance: this.stripe,
            iban: this.iban,
            ibanSourceData: sourceData
          });


          // // Call `stripe.createSource` with the iban Element and additional options.
          // this.stripe
          //   .createSource(this.iban, sourceData)
          //   .then(function(result) {
          //     if (result.error) {
          //       // Inform the customer that there was an error.
          //       errorMessage.textContent = result.error.message;
          //       errorMessage.classList.add("visible");
          //     } else {
          //       // Send the Source to your server to create a charge.
          //       errorMessage.classList.remove("visible");
                  //  result.source
          //     }
          //   });
        } else {

          // goto cart store for checkout process
          if (!this.selectedAddress) {
            this.selectedAddress = {
              houseNumber: this.houseNumber,
              streetName: this.streetName,
              city: this.city,
              zip: this.zip
            };
          }

          this.checkout({
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.selectedAddress,
            companyName: this.companyName,
            paymentMethod: this.paymentMethod,
            amount: this.getTotal
          });
        }
      }
    }
  },
  head() {
    return {
      title: "Checkout with the products in your cart",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "After this checkout process we will ship the item and it should be delivered within 7 working days"
        }
      ]
    };
  }
};
</script>
<style scoped lang="scss">
.stripe {
  background-color: #fff;
  border: 2px solid rgb(187, 212, 243);
  border-radius: 10px;
  padding: 10px 20px;
}
.err {
  color: red;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
#mandate-acceptance {
  background-color: #fcf9e9;
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
  color: #555;
}

#error-message.visible {
  color: red;
  display: block;
}
#error-message {
  display: none;
}

#bank-name {
  display: none;
}
#bank-name.visible {
  display: block;
  color: green;
}
.cart_vendor_item {
  border-bottom: 1px solid black;
}

.info_title {
  font-weight: bold;
}
.zipCodeItem {
  background: lightgreen;
  padding: 3px 15px;
  border-radius: 15px;
  margin: 5px;
}
.dayItem {
  background: lightgrey;
  color: grey;
  padding: 3px 15px;
  border-radius: 15px;
  margin: 2px;
}
.radio_address {
  margin: 7px 0;

  .radio_address_label {
    font-size: 18px;
    color: #333;
  }
}
.desc_item {
  margin-bottom: 10px;
}
.vendor_title {
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
.payment_summary {
  margin-top: 30px;
  p {
    margin: 7px 0 !important;
  }
}
</style>