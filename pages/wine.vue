<template>
  <div style="height: 100%">
    <div class="banner bg-image-8">
      <div class="caption">
        <div class="title-group">
          <h5 class="sub-title">{{$t('Royal Products')}}</h5>
          <WineVendorSearch/>
        </div>
      </div>
    </div>
    <section class="bg-242424">
      <v-flex xs12 sub-navigation>
        <v-container fluid main_content_area>
          <v-layout row wrap>
            <v-flex xs1 style="text-align: center">
              <v-icon color="white">arrow_left</v-icon>
            </v-flex>
            <v-flex xs10 v-if="isBranchChanged" v-dragscroll class="branch_item_wrapper">
              <div v-for="(branch, ix) in branches" :key="ix" class="branch_item_div">
                <span
                  :class="branchesFilter[ix] ? 'branch_item active' : 'branch_item'"
                  @click="branchClick(ix)"
                >{{branch}}</span>
              </div>
            </v-flex>
            <v-flex xs1 style="text-align: center">
              <v-icon color="white">arrow_right</v-icon>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>

      <v-container fluid grid-list-xl class="main_content_area">
        <v-layout row wrap>
          <v-flex xs12 class="empty_vendor" v-if="vendors.length ==  0">
            <h3>{{$t('No vendors in that area.')}}</h3>
            <h5>
              {{$t('If you know a vendor who should be on this platform, please send him the link')}}
              <a
                href="https://meine.regionaleernte.de/account/signup"
              >https://meine.regionaleernte.de/account/signup</a>
            </h5>
          </v-flex>

          <v-flex
            xs12
            class="empty_vendor"
            v-if="vendors.length > 0 && (vendors[0].distance > distance || vendors[0].distance == null)"
          >
            <h3>{{$t('No vendors in that area.')}}</h3>
            <h5>
              {{$t('If you know a vendor who should be on this platform, please send him the link')}}
              <a
                href="https://meine.regionaleernte.de/account/signup"
              >https://meine.regionaleernte.de/account/signup</a>
            </h5>
            <h5 class="next_available">{{$t('Next available vendors:')}}</h5>
          </v-flex>
          <v-flex xs12 lg3>
            <div class="box filter_box">
              <div class="radius_div">
                <label class="user_address" v-if="userAddress">{{ userAddress.formattedAddress }}</label>
                <br>
                <br>
                <v-slider
                  v-model="distance"
                  step="10"
                  max="50"
                  color="red"
                  dark
                  ticks="always"
                  thumb-color="red"
                  thumb-label="always"
                ></v-slider>
                <v-layout row wrap>
                  <v-flex xs12 lg6 class="divZip">
                    <v-btn :color="isZipSearch ? 'red' : 'secondary'" block @click="isZipSearch = true" class="toggleVendorBtn">
                      <v-icon v-if="isZipSearch">check</v-icon>
                      <span style="white-space: normal;">{{$t('Deliver to above address?')}}</span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 lg6 class="divPickup">
                    <v-btn :color="isZipSearch ? 'secondary' : 'red'" block @click="isZipSearch = false" class="toggleVendorBtn">
                      <v-icon v-if="!isZipSearch">check</v-icon>
                      <span style="white-space: normal;">{{$t('Pick up')}}</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div class="additional_filter" v-if="isExpanded">
                <h4 class="line-default">{{$t('Delivery Services')}}</h4>
                <ul class="form-group list list-border">
                  <li class="form-check">
                    <v-checkbox
                      label="Selbstabholung"
                      v-model="service_click"
                      height="0"
                      color="white"
                      dark
                    ></v-checkbox>
                  </li>
                  <li class="form-check">
                    <v-checkbox
                      label="Versand"
                      v-model="service_shipping"
                      height="0"
                      color="white"
                      dark
                    ></v-checkbox>
                  </li>
                  <li class="form-check">
                    <v-checkbox
                      label="Lieferung"
                      v-model="service_sameday"
                      height="0"
                      color="white"
                      dark
                    ></v-checkbox>
                  </li>
                </ul>
                <h4 class="line-default">{{$t('Vendor Rating')}}</h4>
                <v-layout row wrap>
                  <v-flex xs12>
                    <star-rating :star-size="20" v-model="vendor_stars"></star-rating>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn color="red" @click="vendor_stars = 0" style="color: white;">
                      <v-icon>refresh</v-icon>
                      {{$t('Reset')}}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div @click="isExpanded = !isExpanded" class="expand_div">
                <v-icon large color="white" v-if="isExpanded">expand_less</v-icon>
                <v-icon large color="white" v-else>expand_more</v-icon>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 lg9>
            <!-- show all vendors -->
            <v-flex v-for="vendor in currentVendors" :key="vendor._id" class="vendor_div">
              <v-layout row store-info wrap style="border-bottom: 1px solid white;">
                <v-flex align-center class="logo" @click="go('/store/'+vendor._id)">
                  <!-- <v-img class="vendor_avatar" v-if="vendor.avatar" :src="vendor.avatar"/>&nbsp;&nbsp;&nbsp; -->
                  <div>
                    <h3
                      class="text-truncate"
                      :title="`${vendor.businessName}`"
                    >{{ vendor.businessName }}</h3>
                  </div>
                  <div>
                    <star-rating :star-size="15" :rating="vendor.rating" :read-only="true"></star-rating>
                  </div>
                </v-flex>
                <v-spacer/>
                <v-flex style="text-align: right">
                  <v-btn
                    v-for="category in vendor.categories"
                    :key="category"
                    flat
                    class="vendor_category_item"
                  >{{category}}</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row class="wine" wrap>
                <v-flex lg2 md3 xs12>
                  <v-layout column>
                    <v-layout style="margin-top: 30px;">
                      <!-- <v-flex xs3>
                        <v-icon color="white" large>local_shipping</v-icon>
                      </v-flex>-->
                      <v-flex xs12>
                        <p
                          class="font_white"
                          v-for="service in vendor.deliveryServices"
                          :key="service"
                        >
                          <span v-if="service == 'Lieferung'">{{ "Lieferung| + " + vendor.shippingCost + "€" }}</span>
                          <br v-if="service == 'Lieferung'" />
                          <span v-if="service == 'Lieferung'" class="small_span">{{$t('from')}} {{ vendor.minAmountForSameDayDelivery}}€ {{$t('free')}}</span>
                          
                          <span v-if="service == 'Selbstabholung'"> {{ service }} </span>
                        </p>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <!-- <v-flex xs3>
                        <v-icon color="white" large>directions_run</v-icon>
                      </v-flex>-->
                      <v-flex xs12>
                        <span class="font_white">{{$t('Distance')}}: {{ vendor.distance }}km</span>
                      </v-flex>
                    </v-layout>
                    <v-layout>
                      <!-- <v-flex xs3>
                        <v-icon color="white" large>location_on</v-icon>
                      </v-flex>-->
                      <v-flex xs12>
                        <p class="formatAddress">
                          <span class="font_white">{{ vendor.formattedAddress1 }}</span>
                        </p>
                        <p class="formatAddress">
                          <span class="font_white">{{ vendor.formattedAddress2 }}</span>
                        </p>
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </v-flex>
                <v-flex lg10 md9 xs12>
                  <carousel
                    :per-page="carouselItemCount"
                    navigationEnabled
                    :paginationEnabled="false"
                    mouseDrag
                  >
                    <slide
                      v-for="product in productFilter(vendor.vendor_products, searchWine)"
                      :key="product._id"
                      class="item_slide"
                    >
                      <div class="box-item">
                        <router-link :to="'/store/'+vendor._id+'/'+product._id" class="img">
                          <v-img
                            class="product_thumb"
                            v-if="product.productType.key=='single' && product.variants[0].img"
                            :src="'/' + product.variants[0].img[0]"
                          ></v-img>
                          <v-img
                            v-if="product.productType.key=='bundle' && product.coverImg"
                            class="product_thumb"
                            :src="'/'+product.coverImg"
                            :alt="product._id"
                          ></v-img>
                          <div class="top promo_black">
                            <div v-if="product.hot">
                              <span>{{$t('Available')}} {{ product.activeDuration }} {{$t('days')}}</span>
                            </div>
                            <div v-else>
                              <span>{{$t('Available while stock lasts')}}</span>
                            </div>
                          </div>
                          <div
                            v-if="product.hot && product.originalPrice > product.sellingPrice"
                            class="bottom promo"
                          >
                            <span>{{Math.round((((product.originalPrice- product.sellingPrice)/product.originalPrice)*100),2)}}% off</span>
                          </div>
                        </router-link>
                        <v-layout row wrap class="product_detail">
                          <v-flex
                            xs12
                          >{{ product.productType.key == 'single' ? product.variants[0].wineName : product.bundleName }}</v-flex>
                        </v-layout>
                        <v-layout row class="price_detail">
                          <v-flex
                            xs4
                            :class="product.hot && product.originalPrice != product.sellingPrice ? 'original_price' : 'left_product_size'"
                          >{{ product.hot && product.originalPrice != product.sellingPrice ? '&euro;' + product.originalPrice : product.productType.key == 'single' ? product.variants[0].unit : 'Kiste' }}</v-flex>
                          <v-flex
                            xs4
                            product_unit
                          >{{ product.hot && product.originalPrice != product.sellingPrice ? product.productType.key == 'single' ? product.variants[0].unit : 'Kiste' : ''}}</v-flex>
                          <v-flex
                            xs4
                            selling_price
                          >&euro;{{ product.hot ? product.sellingPrice : product.originalPrice }}</v-flex>
                        </v-layout>
                      </div>
                    </slide>
                  </carousel>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex row wrap>
              <v-flex xs12 offset-sm3 sm6>
                <nav aria-label="Page navigation" v-if="pageLength > 1">
                  <div class="text-xs-center">
                    <v-pagination v-model="page" :length="pageLength"></v-pagination>
                  </div>
                </nav>
              </v-flex>
            </v-flex>
          </v-flex>
          <br>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
// import WineTopBanner from "~/components/WineTopBanner.vue";
import WineVendorSearch from "~/components/WineVendorSearch.vue";
import { Carousel, Slide } from "vue-carousel";
import StarRating from "vue-star-rating";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { dragscroll } from "vue-dragscroll";

export default {
  name: "Wine",
  layout: "wine",
  data() {
    return {
      screenWidth: 0,
      carouselItemCount: 3,
      pageLength: 0,
      distance: 50,
      vendor_stars: 0,
      isExpanded: false,
      service_click: false,
      service_shipping: false,
      service_sameday: false,
      list: true,
      page: 1,
      vendors: this.$store.getters.vendors,
      availableVendors: null,
      currentVendors: null,
      deliveryServices: [],
      countPerPage: 2,
      branches: [],
      branchesFilter: [],
      isBranchChanged: false,
      isZipSearch: true
    };
  },
  directives: {
    dragscroll
  },
  components: {
    WineVendorSearch,
    StarRating,
    Carousel,
    Slide
  },

  methods: {
    async loadData() {
      await this.loadVendors();
      await this.loadDeliveryServices();

      this.branches = [];
      this.branchesFilter = [];

      let branches = await this.$axios.$get("branch");

      for (let i = 0; i < branches.length; i++) {
        if (this.branches.indexOf(branches[i].name) < 0 && branches[i].active) {
          this.branches.push(branches[i].name);
          this.branchesFilter.push(false);
        }
      }

      this.isBranchChanged = true;

      // get vendors available for current page
      this.getActiveVendors();

      window.addEventListener("resize", this.handleResize);
      this.handleResize();
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 1300) this.carouselItemCount = 3;
      if (this.screenWidth >= 600 && this.screenWidth < 1300)
        this.carouselItemCount = 2;
      if (this.screenWidth < 600) this.carouselItemCount = 1;
    },
    branchClick(ix) {
      // set branch filter value
      this.isBranchChanged = false;
      this.branchesFilter[ix] = !this.branchesFilter[ix];

      for (let i = 0; i < this.branchesFilter.length; i++) {
        if (i != ix) {
          this.branchesFilter[i] = 0;
        }
      }

      // reset page to first page
      this.page = 1;

      this.getActiveVendors();

      // refresh the page
      this.isBranchChanged = true;
    },
    getActiveVendors() {
      // get available vendors based on distance, star and service(init this value because available vendors will be changed after branch filter)
      let distance = this.distance;

      if (this.vendors[0].distance > this.distance) {
        distance = 20000;
      }

      // get available vendors by filtering service, radius and rating
      this.availableVendors = this.vendorsFilter(
        this.vendors,
        distance,
        this.service_click,
        this.service_shipping,
        this.service_sameday,
        this.vendor_stars
      );

      // filter available vendors by branch
      if (this.branchesFilter.indexOf(true) > -1) {
        let branchFilteredVendors = [];
        // filter available vendors based on checked branch
        for (let i = 0; i < this.availableVendors.length; i++) {
          let flag = false;
          for (let j = 0; j < this.branchesFilter.length; j++) {
            if (this.branchesFilter[j]) {
              if (
                this.availableVendors[i].workingBranch.indexOf(
                  this.branches[j]
                ) >= 0
              ) {
                flag = true;
              }
            }
          }

          if (flag) {
            branchFilteredVendors.push(this.availableVendors[i]);
          }
        }

        this.availableVendors = branchFilteredVendors;
      }

      // filter available vendor by zipcode if that button clicked
      if (this.isZipSearch) {
        let zipFilteredVendors = [];
        for (let i = 0; i < this.availableVendors.length; i++) {
          let flag = false;
          if (
            this.availableVendors[i].zipCodes.length > 0 &&
            this.availableVendors[i].deliveryServices.indexOf(
              'Lieferung'
            ) >= 0 &&
            this.availableVendors[i].zipCodes.indexOf(
              this.userAddress.zipcode
            ) >= 0
          ) {
            zipFilteredVendors.push(this.availableVendors[i]);
          }
        }

        this.availableVendors = zipFilteredVendors;
      } else {
        // filter available vendors by 'pick up' service
        let pickupVendors = [];
        for (let i = 0; i < this.availableVendors.length; i++) {
          let flag = false;
          if (
            this.availableVendors[i].deliveryServices.indexOf(
              'Selbstabholung'
            ) >= 0
          ) {
            pickupVendors.push(this.availableVendors[i]);
          }
        }

        this.availableVendors = pickupVendors;
      }

      // get current page vendors
      if (this.availableVendors.length > 0) {
        this.currentVendors = this.availableVendors.slice(
          (this.page - 1) * this.countPerPage,
          (this.page - 1) * this.countPerPage + this.countPerPage
        );
      } else {
        this.currentVendors = [];
      }
      // set pages number
      this.pageLength = Math.ceil(
        this.availableVendors.length / this.countPerPage
      );
    },
    async loadVendors() {
      try {
        // get user address
        let userLongitude = 0;
        let userLatitude = 0;

        if (this.userAddress) {
          // get user position
          userLongitude = this.userAddress.longitude;
          userLatitude = this.userAddress.latitude;
        }

        // load vendors from api
        this.vendors = await this.$axios.$get("products/vendorProducts", {
          params: {
            lat1: userLatitude,
            lon1: userLongitude
          }
        });

        for (let i = 0; i < this.vendors.length; i++) {
          // customize vendor's formattedAddress from HERE address object
          this.vendors[i].formattedAddress = "";
          this.vendors[i].formattedAddress1 = "";
          this.vendors[i].formattedAddress2 = "";
          if (this.vendors[i].address != null) {
            this.vendors[i].formattedAddress += this.vendors[i].address.zipcode
              ? this.vendors[i].address.zipcode + ", "
              : "";

            this.vendors[i].formattedAddress1 += this.vendors[i].address.zipcode
              ? this.vendors[i].address.zipcode + ", "
              : "";

            this.vendors[i].formattedAddress += this.vendors[i].address.city
              ? this.vendors[i].address.city + ", "
              : "";

            this.vendors[i].formattedAddress1 += this.vendors[i].address.city
              ? this.vendors[i].address.city + ", "
              : "";

            this.vendors[i].formattedAddress += this.vendors[i].address
              .streetName
              ? this.vendors[i].address.streetName
              : "";
            this.vendors[i].formattedAddress2 += this.vendors[i].address
              .streetName
              ? this.vendors[i].address.streetName
              : "";

            this.vendors[i].formattedAddress += this.vendors[i].address
              .streetNumber
              ? "-" + this.vendors[i].address.streetNumber
              : "";
            this.vendors[i].formattedAddress2 += this.vendors[i].address
              .streetNumber
              ? "-" + this.vendors[i].address.streetNumber
              : "";
          }

          // customize vendor specific delivery services
          // this.vendors[i].deliveryServicesNew = [];

          // for (let j = 0; j < this.vendors[i].deliveryServices.length; j++) {
          //   switch (this.vendors[i].deliveryServices[j]) {
          //     case "Lieferung":
          //       this.vendors[i].deliveryServicesNew.push(
          //         "Lieferung| + " +
          //           this.vendors[i].shippingCost +
          //           "€"
          //       );
          //       break;
          //     case "Versand":
          //       this.vendors[i].deliveryServicesNew.push(
          //         "Versand | + " + this.vendors[i].shippingCost + "€"
          //       );
          //       break;
          //     default:
          //       this.vendors[i].deliveryServicesNew.push(
          //         this.vendors[i].deliveryServices[j]
          //       );
          //       break;
          //   }
          // }
        }

        // save vendors data to vuex store
        this.$store.commit("vendors", this.vendors);
      } catch (e) {}
    },
    // old function: show working branches of vendors who are available in radius (not all working branches)
    // getActiveVendors() {
    //   this.isBranchChanged = false;

    //   let distance = this.distance;

    //   if (this.vendors.length == 0) {
    //     return;
    //   }

    //   if (this.vendors[0].distance > this.distance) {
    //     distance = 20000;
    //   }

    //   // filter available vendors
    //   this.availableVendors = this.vendorsFilter(
    //     this.vendors,
    //     distance,
    //     this.service_click,
    //     this.service_shipping,
    //     this.service_sameday,
    //     this.vendor_stars
    //   );

    //   this.branches = [];
    //   this.branchesFilter = [];

    //   // set working branches corresponding to active vendors
    //   for (let i = 0; i < this.availableVendors.length; i++) {
    //     if (this.availableVendors[i].workingBranch) {
    //       for (
    //         let j = 0;
    //         j < this.availableVendors[i].workingBranch.length;
    //         j++
    //       ) {
    //         if (
    //           this.branches.indexOf(
    //             this.availableVendors[i].workingBranch[j]
    //           ) == -1
    //         ) {
    //           this.branches.push(this.availableVendors[i].workingBranch[j]);
    //           this.branchesFilter.push(false);
    //         }
    //       }
    //     }
    //   }

    //   this.isBranchChanged = true;

    //   // get current page vendors
    //   this.currentVendors = this.availableVendors.slice(
    //     (this.page - 1) * this.countPerPage,
    //     (this.page - 1) * this.countPerPage + this.countPerPage
    //   );

    //   // set pages number
    //   this.pageLength = Math.ceil(
    //     this.availableVendors.length / this.countPerPage
    //   );

    //   this.page = 1;
    // },
    async loadDeliveryServices() {
      let services = await this.$axios.$get("delivery");
      this.deliveryServices = services;
    },
    // toggleZipSearch() {
    //   if (this.userAddress.zipcode) {
    //     this.isZipSearch = !this.isZipSearch;
    //     this.getActiveVendors();
    //   } else {
    //     this.$store.commit(
    //       "setErr",
    //       "Your address is not available to get zipcode."
    //     );
    //   }
    // },
    containsKey(obj, key) {
      return Object.keys(obj).includes(key);
    },
    go(url) {
      this.$router.push(url);
    },
    productFilter: function(products, searchWine) {
      return products.filter(function(product) {
        if (searchWine == "") {
          return product.active == true && product.stock > 0;
        } else {
          return (
            product.active == true &&
            product.q.indexOf(searchWine) >= 0 &&
            product.stock > 0
          );
        }
      });
    },
    deliveryServicesFilter: function(services) {
      return services.filter(function(service) {
        return service.active;
      });
    },
    vendorsFilter: function(
      vendors,
      distance,
      service_click,
      service_shipping,
      service_sameday,
      vendor_stars
    ) {
      let userAddress = this.userAddress;

      return vendors.filter(function(vendor) {
        let isServiceAvailable = false;

        for (let i = 0; i < vendor.deliveryServices.length; i++) {
          if (service_click && vendor.deliveryServices[i] == "Selbstabholung") {
            isServiceAvailable = true;
          }
          if (service_shipping && vendor.deliveryServices[i] == "Versand") {
            isServiceAvailable = true;
          }
          if (
            service_sameday &&
            vendor.deliveryServices[i] == "Lieferung"
          ) {
            isServiceAvailable = true;
          }
        }

        // if all the services are unchecked, show all
        if ((service_click || service_shipping || service_sameday) === false) {
          isServiceAvailable = true;
        }

        if (userAddress) {
          // if user inputed address
          return (
            vendor.distance <= distance &&
            isServiceAvailable &&
            vendor.rating >= vendor_stars
          );
        } else {
          // if user click refresh without intead of address input
          return isServiceAvailable && vendor.rating >= vendor_stars;
        }
      });
    },
    ...mapMutations({
      clearCart: "cart/clearCart"
    })
  },
  watch: {
    isZipSearch(val) {
      if(val == true) {
        // zip based search vendors
        if (this.userAddress.zipcode) {
          // reset page to first page
          this.page = 1;
          this.getActiveVendors();
        } else {
          this.$store.commit(
            "setErr",
            "Your address is not available to get zipcode."
          );
        }
      } else {
        // show vendors providing 'pick up' service
        this.page = 1;
        this.getActiveVendors();
      }
    },
    page(val) {
      this.getActiveVendors();
    },
    distance(val) {
      // reset page to first page
      this.page = 1;
      this.getActiveVendors();
    },
    service_click(val) {
      // reset page to first page
      this.page = 1;
      this.getActiveVendors();
    },
    service_shipping(val) {
      // reset page to first page
      this.page = 1;
      this.getActiveVendors();
    },
    service_sameday(val) {
      // reset page to first page
      this.page = 1;
      this.getActiveVendors();
    },
    vendor_stars(val) {
      // reset page to first page
      this.page = 1;
      this.getActiveVendors();
    },
    userAddress(val) {
      this.loadData();
    }
  },
  computed: {
    ...mapState({
      searchWine: state => state.searchWine || "",
      userAddress: state => state.userAddress
    })
  },
  created() {
    this.loadData();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="scss" scoped>
.item_slide {
  padding: 0 10px;
}
.font_white {
  color: white;
  font-size: 14px;
}
.distance_label {
  margin: 0 0 0 10px;
}
.container.grid-list-xl .layout:not(:only-child) {
  margin: 0;
}
.rating {
  margin-top: 15px;
  border-bottom: 1px solid white;
}
.vendor_avatar {
  max-width: 50px;
  max-height: 50px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
section.bg-242424 {
  height: 100%;
  background: #242424;
  padding-top: 20px;
  padding-bottom: 60px;
}
.store-info {
  margin: 0;

  .mdi {
    font-size: 2em;
    float: left;
    line-height: 47px;
    margin-right: 10px;
    opacity: 0.75;
  }
  span {
    font-size: 14px;
    color: white;
  }
  .logo {
    cursor: pointer;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }
}
.box {
  background-color: #191a1c !important;
  color: #fff;
}
.box-item {
  background-color: #191a1c !important;
  border: 1px solid black;
  color: #fff;
  padding: 0;
  margin-bottom: 0;
  .img {
    display: block;
    position: relative;
  }

  .product_detail {
    padding: 10px;
    background: rgba(255, 0, 0, 0.3);
    border-top: 1px solid black;
    border-bottom: 1px solid white;
    font-size: 16px;

    .flex {
      padding: 0;
    }
  }

}
h3.text-truncate {
  color: white;
  margin-bottom: 10px;
}
.date_available {
  font-size: 14px;
  padding: 0 0 10px 0;
}
.filter_box {
  padding-top: 0 !important;
  border: 1px solid black;
}
.form-group {
  margin-bottom: 20px;
}
.vendor_div {
  background: #191a1c;
  border: 1px solid black;
  margin-bottom: 20px;
}
.radius_div {
  padding: 20px 0 !important;
}
.user_address {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
.expand_div {
  margin-top: 20px;
  color: white;
  text-align: center;
  cursor: pointer;
}
.price_detail {
  font-size: 16px;
  padding: 10px;
  background: rgba(255, 0, 0, 0.3);

  .original_price {
    text-align: left;
    text-decoration: line-through;
    padding: 0 !important;
  }
  .left_product_size {
    text-align: left;
    padding: 0 !important;
  }
  .selling_price {
    text-align: right;
    padding: 0 !important;
    color: white;
  }
  .product_unit {
    text-align: center;
    padding: 0 !important;
  }
}
.empty_vendor {
  padding-top: 0px !important;
  color: #fff;

  h3 {
    padding-top: 0 !important;
  }

  a {
    color: #dc4c46;
  }

  .next_available {
    color: lightgreen;
  }
  .h_line {
    background: white;
    height: 1px;
    width: 100%;
    margin: 20px auto;
  }
}
.working_branch {
  background: #191a1c;
  margin-bottom: 20px;
}

.vendor_category_item {
  color: white;
  background: #454545;
}
.branch_title {
  color: white;
  position: relative;
  padding: 0;
}
.branch_title:after {
  position: absolute;
  bottom: 0px;
  left: 0;
  content: "";
  margin-left: 0px;
  border-bottom: 1px solid red;
  width: 70px;
}

.branch_item_wrapper {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;

  .branch_item_div {
    display: inline-block;
    font-size: 20px;
    cursor: pointer;

    .branch_item {
      color: white;
      padding: 0 20px;
    }

    .branch_item:hover {
      color: black;
    }

    .branch_item.active {
      color: black;
    }
  }
}
.sub-navigation {
  background-color: rgba(255, 0, 0, 0.3);
  margin: -20px 0 60px 0;
  position: sticky;
  top: 70px;
  height: 60px;
  z-index: 200;

  .main_content_area {
    padding: 15px;
  }
}

.product_thumb {
  height: 300px;
}

.toggleVendorBtn {
  color: white;
  height: 40px;
}
.formatAddress {
  margin: 0px !important;
}
.divZip {
  padding: 5px !important;
}
.divPickup {
  padding:5px !important;
}
.small_span {
  font-size: 12px;
}
</style>
