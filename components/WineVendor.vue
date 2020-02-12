<template>
  <v-layout row sub-navigation align-center v-if="selectedVendor">
    <v-flex xs2 md1 class="left_arrow">
      <!-- <a @click="$router.go(-1)">
        <v-icon color="white">chevron_left</v-icon>
        <span>Back</span>
      </a>-->
      <v-btn @click="$router.go(-1)" flat icon color="white">
        <v-icon>chevron_left</v-icon>
      </v-btn>
    </v-flex>

    <v-flex xs2 md3 center>
      <a @click="showInfoDialog = true">
        <v-icon color="white" style="float: left; margin-right: 5px;">info_outline</v-icon>
        <span class="color_white" style="float: left">{{$t('Information')}}</span>
      </a>
    </v-flex>

    <v-flex xs5 md4 logo center>
      <v-img
        class="vendor_avatar"
        v-if="selectedVendor.avatar"
        :src="'/' + selectedVendor.avatar"
        @click="showImageModal(selectedVendor.avatar)"
      />
      <p class="business_name hidden-sm-and-down" v-if="selectedVendor.address">
        <span>{{ selectedVendor.businessName }}</span>
        <br>
        <span>{{ selectedVendor.city }} , {{ selectedVendor.address.streetName }} - {{ selectedVendor.address.streetNumber }}</span>
      </p>
    </v-flex>
    <v-flex xs3 md4 center @click="showReviewDialog = true" style="cursor: pointer">
      <span class="rating">{{$t('Rating')}}</span>
      <star-rating class="pull-left" :star-size="20" :rating="averageRating" :read-only="true"></star-rating>
    </v-flex>
    <!-- <v-flex class="logo center" :class="{'xs4': !isBig, 'xs3': isBig}">
      <div class="cart">
        <v-btn flat @click.stop="toggleCart(true)" class="white--text">
          <p class="hidden-sm-and-down">
            <span>Warebasket</span>
            <br>
            {{ getTotal|currency }}
          </p>
          <v-badge color="red">
            <span slot="badge">{{ getTotalCount }}</span>
            <v-icon color="white" large>shopping_basket</v-icon>
          </v-badge>
        </v-btn>
      </div>
    </v-flex>-->
    <!-- review dialog -->
    <v-dialog v-model="showReviewDialog" width="600">
      <v-card>
        <h3 class="center">{{$t('Reviews from users')}}</h3>
        <v-list>
          <template v-for="(item, index) in reviews">
            <v-divider inset :key="item._id" v-if="!index==0"></v-divider>
            <v-list-tile avatar :key="index">
              <v-flex md1 xs2>
                <v-list-tile-avatar>
                  <img :src="'/'+item.avatar">
                </v-list-tile-avatar>
              </v-flex>
              <v-flex md9 xs8>
                <v-list-tile-title>{{item.reviewer}} - {{item.pname}}</v-list-tile-title>
                <v-list-tile-sub-title v-html="item.message"></v-list-tile-sub-title>
              </v-flex>
              <v-list-tile-avatar class="stars">
                <v-icon v-for="(i,ix) in item.rating" :key="ix" color="yellow">star</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>
          </template>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="showReviewDialog = false">{{$t('Close')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- info dialog -->
    <v-dialog v-model="showInfoDialog" width="600">
      <v-card class="info_dialog">
        <h3 class="center">{{$t('Vendor Information')}}</h3>
        <v-card-title>
          {{$t('Vendor Name')}}:
          <span class="vendorInfo">{{ selectedVendor.name }}</span>
        </v-card-title>
        <v-card-title>
          {{$t('Shop Name')}}:
          <span class="vendorInfo">{{ selectedVendor.businessName }}</span>
        </v-card-title>
        <v-card-title>
          {{$t('Location')}}:
          <span
            class="vendorInfo"
          >{{ selectedVendor.address ? selectedVendor.address.formattedAddress : selectedVendor.city }}</span>
        </v-card-title>
        <v-card-title>
          {{$t('City')}}:
          <span class="vendorInfo">{{ selectedVendor.city }}</span>
        </v-card-title>
        <v-card-title>
          {{$t('ZipCode')}}:
          <span class="vendorInfo">{{ selectedVendor.zip }}</span>
        </v-card-title>
        <v-card-title>
          {{$t('Delivery Services')}}:
          <span
            class="vendorInfo"
            v-for="service in selectedVendor.deliveryServices"
            v-bind:key="service"
          >{{ service }}, &nbsp;</span>
        </v-card-title>

        <v-flex v-if="serviceClick">
          <h5 class="center">Selbstabholung</h5>
          <v-card-title>
            {{$t('Place to pick it up')}}:
            <span
              class="vendorInfo"
            >{{ selectedVendor.formattedAddress ? selectedVendor.formattedAddress : selectedVendor.address.formattedAddress }}</span>
          </v-card-title>
          <v-card-title>
            {{$t('Available days to pick up')}}:
            <span
              class="vendorInfo"
              v-for="day in selectedVendor.availableDaysForClick"
              :key="day"
            >{{ day }}, &nbsp;</span>
          </v-card-title>
          <v-card-title>
            {{$t('Morning') + ' ' + $t('between')}}:
            <span
              class="vendorInfo"
            >{{ selectedVendor.timeToPickFrom }} - {{ selectedVendor.timeToPickTo }}</span>
          </v-card-title>
          <v-card-title>
            {{$t('Afternoon') + ' ' + $t('between')}}:
            <span
              class="vendorInfo"
            >{{ selectedVendor.timeToPickFrom2 }} - {{ selectedVendor.timeToPickTo2 }}</span>
          </v-card-title>
        </v-flex>
        <v-flex v-if="serviceSameday">
          <h5 class="center">Lieferung</h5>
          <v-card-title>
            {{$t('Available delivery zip codes')}}:
            <span
              class="vendorInfo"
              v-for="zip in selectedVendor.zipCodes"
              v-bind:key="zip"
            >{{ zip }}, &nbsp;</span>
          </v-card-title>
          <v-card-title>
            {{$t('Available days for vendor delivery')}}:
            <span
              class="vendorInfo"
              v-for="day in selectedVendor.availableDaysForSameday"
              :key="day"
            >{{ day }}, &nbsp;</span>
          </v-card-title>
          <v-card-title>
            {{$t('Time for delivery')}}:
            <span
              class="vendorInfo"
            >{{ selectedVendor.timeForDeliveryFrom }} - {{ selectedVendor.timeForDeliveryTo }}</span>
          </v-card-title>
          <v-card-title>
            {{$t('Amount for free delivery')}}:
            <span
              class="vendorInfo"
            >€ {{ selectedVendor.minAmountForSameDayDelivery }}</span>
          </v-card-title>
          <v-card-title>
            {{$t('Deliverycosts')}}:
            <span class="vendorInfo">€ {{ selectedVendor.shippingCost }}</span>
          </v-card-title>
        </v-flex>
        <v-flex v-if="serviceShipping">
          <h5 class="center">Versand</h5>
          <v-card-title>
            {{$t('Shipping Cost')}}:
            <span class="vendorInfo">€ {{ selectedVendor.shippingCost }}</span>
          </v-card-title>
          <!-- <v-card-title>
            {{$t('Free Amount for Shipping')}}:
            <span
              class="vendorInfo"
            >€ {{ selectedVendor.freeAmountForShipping }}</span>
          </v-card-title>-->
        </v-flex>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="showInfoDialog = false">{{$t('Close')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- image modal -->
    <v-dialog v-model="isShowImage" width="500">
      <v-card>
        <v-img v-if="imageUrl" :src="'/'+imageUrl"></v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="isShowImage = false">{{$t('Close')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import StarRating from "vue-star-rating";
import { VTooltip, VPopover } from "v-tooltip";
import { mapState } from "vuex";

export default {
  name: "WineVendor",
  data() {
    return {
      isShowImage: false,
      imageUrl: null,
      reviews: [],
      showReviewDialog: false,
      serviceClick: false,
      serviceShipping: false,
      serviceSameday: false,
      showInfoDialog: false,
      averageRating: 0
    };
  },
  components: {
    StarRating,
    VTooltip,
    VPopover
  },
  methods: {
    showImageModal(url) {
      this.imageUrl = url;
      this.isShowImage = true;
    },
    go(to) {
      this.$router.push(to);
    }
  },
  computed: {
    ...mapState({
      selectedVendor: state => state.selectedVendor || {}
    })
  },
  async created() {
    // get delivery service from selectedVendor
    let deliveryServices = this.$store.getters.selectedVendor.deliveryServices;

    if (deliveryServices.indexOf("Selbstabholung") > -1)
      this.serviceClick = true;
    if (deliveryServices.indexOf("Versand") > -1) this.serviceShipping = true;
    if (deliveryServices.indexOf("Lieferung") > -1)
      this.serviceSameday = true;

    // get review data(all reviews from user)
    this.reviews = await this.$axios.$get(
      "reviews/vendorReviews/" + this.$store.getters.selectedVendor._id
    );

    // sum average review rating
    let sum = 0;
    let count = 0;
    if (this.reviews.length == 0) {
      this.averageRating = 0;
    } else {
      for (let i = 0; i < this.reviews.length; i++) {
        sum += this.reviews[i].rating;
        count++;
      }
      this.averageRating = Math.round(sum / count);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";

// dialog style
.v-dialog__content {
  // z-index: 1200 !important;
}

.vendorInfo {
  color: black;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
}

.business_name {
  color: white;
  font-size: 20px;
  text-align: center;
}

.rating {
  color: white;
  float: left;
}

.color_white {
  color: white;
}

.f-14 {
  font-size: 14px !important;
}

.pull-right {
  margin-left: auto;
  float: right;
}

.pull-left {
  float: left;
}

.sub-navigation {
  background-color: rgba(255, 0, 0, 0.3);
  border: 1px solid black;
  margin: -60px 0 60px 0;
  position: sticky;
  top: 70px;
  height: 60px;
  z-index: 200;
  .line-default {
    padding: 10px 0;
  }
  .vue-star-rating {
    margin-left: 20px;
  }
  .mdi {
    font-size: 1.5em;
    vertical-align: middle;
    margin-right: 5px;
  }
  .m {
    display: none;
  }
}
@media (max-width: 992px) {
  .sub-navigation a > span,
  .sub-navigation button p br,
  .sub-navigation button p span {
    display: none;
  }
}
@media (max-width: 768px) {
  .sub-navigation h3 {
    display: none;
  }
}
@media (max-width: 500px) {
  .sub-navigation .vue-star-rating {
    display: none;
  }
  .sub-navigation .m {
    display: block;
  }
}
.relative {
  position: relative;
}
.cart {
  color: #fff;
  .cart-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: left;
    color: #fff;
    .badge {
      padding: 4px 6px;
      line-height: 0.9;
      display: inline-block;
      position: absolute;
      top: -10px;
      font-size: 14px;
      border-radius: 30px;
      background: $main-red;
      right: -10px;
    }
  }

  .bag {
    font-size: 1.5em;
    float: right;
    margin-left: 20px;
    position: relative;
  }
}
p {
  margin: 0;
}
.vendor_avatar {
  max-width: 50px;
  max-height: 50px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 20px;
}
.left_arrow {
  text-align: center;
}
.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: #000;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
}
.stars {
  text-align: right;
}
.center {
  text-align: center;
}
.info_dialog .v-card__title {
  padding: 5px 16px;
}
</style>

