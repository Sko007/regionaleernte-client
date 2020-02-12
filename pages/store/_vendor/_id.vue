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
      <WineVendor v-if="isLoaded"/>
      <v-container fluid grid-list-xl class="main_content_area">
        <div class="content">
          <v-layout row wrap justify-center>
            <v-flex md4 lg3 xs12>
              <div class="box black_border">
                <h3 class="line-default">{{$t('Categories')}}</h3>
                <ul class="form-group list list-border">
                  <li class="form-check" v-for="category in categories" :key="category._id">
                    <v-checkbox
                      :label="`${category.name} (${category.count})`"
                      height="0"
                      color="white"
                      dark
                      :value="category._id"
                      v-model="checkCategory"
                    ></v-checkbox>
                  </li>
                </ul>

                <h3 class="line-default">{{$t('Types')}}</h3>
                <ul class="form-group list list-border">
                  <li class="form-check">
                    <v-checkbox
                      label="Einzelnes Produkt"
                      height="0"
                      color="white"
                      dark
                      value="single"
                      v-model="checkProductType"
                    ></v-checkbox>
                  </li>
                  <li class="form-check">
                    <v-checkbox
                      label="Produkt Kiste"
                      height="0"
                      color="white"
                      dark
                      value="bundle"
                      v-model="checkProductType"
                    ></v-checkbox>
                  </li>
                </ul>
              </div>
            </v-flex>
            <v-flex md8 lg9 xs12 v-if="selectedVendor != null">
              <v-flex row v-if="activeProducts.length == 0" class="no_products">
                <h5>{{$t('No available products.')}}</h5>
              </v-flex>
              <div
                class="wine_item"
                v-for="(product, productIndex) in activeProducts"
                :key="productIndex"
              >
                <v-layout row wrap justify-center style="margin: 0 !important">
                  <v-flex sm4 xs12 class="image_wrapper" v-if="product.variants">
                    <div class="img hover-img image-zoom">
                      <v-img
                        v-if="product.productType.key == 'bundle' && selIndex[productIndex] == 0"
                        :src="'/'+product.coverImg"
                        class="main-image"
                        @click="showImageModal(product.coverImg)"
                      ></v-img>
                      <v-img
                        v-if="product.productType.key == 'bundle' && selIndex[productIndex] > 0"
                        :src="'/'+product.variants[selIndex[productIndex] - 1].img[0]"
                        class="main-image"
                        @click="showImageModal(product.variants[selIndex[productIndex] - 1].img[0])"
                      ></v-img>
                      <v-img
                        v-if="product.productType.key == 'single'"
                        :src="'/'+product.variants[0].img[0]"
                        class="main-image"
                        @click="showImageModal(product.variants[0].img[0])"
                      ></v-img>
                      <div class="top promo_black">
                        <div v-if="product.hot">
                          <span>{{$t('Available')}} {{ product.activeDuration }} {{$t('days')}}</span>
                        </div>
                        <div v-else>
                          <span>{{$t('Available while stock lasts')}} ({{ product.stock }})</span>
                        </div>
                      </div>
                      <div
                        class="bottom promo"
                        v-if="product.hot && product.originalPrice > product.sellingPrice"
                      >
                        <span>{{Math.round((((product.originalPrice - product.sellingPrice)/product.originalPrice)*100),2)}}% off</span>
                      </div>
                    </div>
                    <v-layout
                      v-if="product.productType.key=='bundle'"
                      justify-space-around
                      row
                      wrap
                    >
                      <!-- cover image -->
                      <v-flex class="thumbnail" @click="selectImg(productIndex, 0)">
                        <img
                          :src="'/'+product.coverImg"
                          height="50"
                          width="50"
                          v-lazy="{src:'/'+product.coverImg, loading: '/'+product.coverImg, error: '/450x250-err.svg'}"
                          alt
                        >
                      </v-flex>
                      <!-- product images -->
                      <v-flex
                        class="thumbnail"
                        v-for="(g,ix) in product.variants"
                        :key="ix"
                        @click="selectImg(productIndex, ix+1)"
                      >
                        <img
                          :src="'/'+g.img[0]"
                          height="50"
                          width="50"
                          v-lazy="{src:'/'+g.img[0], loading: '/'+g.img[0], error: '/450x250-err.svg'}"
                          alt
                        >
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!-- bundle product cover page info -->
                  <v-flex
                    sm8
                    xs12
                    bg-484848
                    v-if="product.productType.key == 'bundle' && selIndex[productIndex] == 0"
                  >
                    <div class="caption">
                      <h5 class="heading pull-left">{{ product.bundleName }}</h5>
                      <v-flex pull-right>
                        <v-img
                          class="certificate_avatar"
                          v-for="img in certificatesFilter(selectedVendor.certificates)"
                          @click="showImageModal(img);"
                          :key="img"
                          :src="'/' + img"
                        />
                      </v-flex>
                    </div>
                    <div class="clear"></div>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <p
                          class="bundle_product_summary"
                          v-for="v in product.variants"
                          :key="v._id"
                        >{{v.wineName}} - {{v.unit}}</p>
                      </v-flex>
                      <v-flex offset-sm4 class="cart_button_wrapper">
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
                        <button
                          class="ht-btn red"
                          @click="addToCart({product, variant:product, qty:qty[productIndex], vendorId: product.vendorId});"
                        >
                          <input
                            type="number"
                            min="1"
                            :max="product.stock"
                            v-model="qty[productIndex]"
                            @click.stop
                          >
                          {{ product.productType.key=='bundle' ? $t('Add bundle to Cart') : $t('Add product to Cart') }}
                        </button>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!-- single product detail info -->
                  <v-flex sm8 xs12 bg-484848 v-if="product.productType.key == 'single'">
                    <div class="caption">
                      <h5 class="heading pull-left">
                        {{ product.variants[selIndex[productIndex]].wineName }}
                        - {{ product.variants[selIndex[productIndex]].isDailyRefresh ? $t('Daily Refresh') : product.variants[selIndex[productIndex]].wineYear }}
                        - {{ product.variants[selIndex[productIndex]].country }}
                        - {{ product.variants[selIndex[productIndex]].region }}
                      </h5>
                      <v-flex pull-right>
                        <v-img
                          class="certificate_avatar"
                          v-for="img in certificatesFilter(selectedVendor.certificates)"
                          @click="showImageModal(img);"
                          :key="img"
                          :src="'/' + img"
                        />
                      </v-flex>
                    </div>
                    <div class="clear"></div>
                    <v-layout row>
                      <v-flex p-r-0 md6 pull-left features_div>
                        <p>{{$t('Category')}} : {{ product.variants[selIndex[productIndex]].categoryName }}</p>
                        <p
                          v-for="feature in featuresFilter(product.variants[selIndex[productIndex]].features)"
                          :key="feature.key"
                        >{{ feature.key }} : {{ feature.val }}</p>
                        <p>{{$t('Quality points')}} : {{ product.variants[selIndex[productIndex]].expertPoints }}</p>
                      </v-flex>

                      <v-flex p-0 md6>
                        <div
                          v-html="product.variants[selIndex[productIndex]].description"
                          class="product_desc"
                          style="height: 85%"
                        ></div>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex offset-sm4 class="cart_button_wrapper">
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
                        <button
                          class="ht-btn red"
                          @click="addToCart({product, variant:product, qty:qty[productIndex], vendorId: product.vendorId});"
                        >
                          <input
                            type="number"
                            min="1"
                            :max="product.stock"
                            v-model="qty[productIndex]"
                            @click.stop
                          >
                          {{ product.productType.key=='bundle' ? $t('Add bundle to Cart') : $t('Add product to Cart') }}
                        </button>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <!-- bundle product detail info(if bundle product cover page not clicked) -->
                  <v-flex
                    sm8
                    xs12
                    bg-484848
                    v-if="product.productType.key == 'bundle' && selIndex[productIndex] > 0"
                  >
                    <div class="caption">
                      <h5 class="heading pull-left">
                        {{ product.variants[selIndex[productIndex]-1].wineName }}
                        - {{ product.variants[selIndex[productIndex]-1].isDailyRefresh ? $t('Daily refresh') : product.variants[selIndex[productIndex]-1].wineYear }}
                        - {{ product.variants[selIndex[productIndex]-1].country }}
                        - {{ product.variants[selIndex[productIndex]-1].region }}
                      </h5>
                      <v-flex pull-right>
                        <v-img
                          class="certificate_avatar"
                          v-for="img in certificatesFilter(selectedVendor.certificates)"
                          @click="showImageModal(img);"
                          :key="img"
                          :src="'/' + img"
                        />
                      </v-flex>
                    </div>
                    <div class="clear"></div>
                    <v-layout row>
                      <v-flex p-r-0 md6 pull-left features_div>
                        <p>{{$t('Category')}} : {{ product.variants[selIndex[productIndex]-1].categoryName }}</p>
                        <p
                          v-for="feature in featuresFilter(product.variants[selIndex[productIndex]-1].features)"
                          :key="feature.key"
                        >{{ feature.key }} : {{ feature.val }}</p>
                        <p>{{$t('Quality points')}} : {{ product.variants[selIndex[productIndex]-1].expertPoints }}</p>
                      </v-flex>

                      <v-flex p-0 md6>
                        <div
                          v-html="product.variants[selIndex[productIndex]-1].description"
                          class="product_desc"
                          style="height: 85%"
                        ></div>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex offset-sm4 class="cart_button_wrapper">
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
                        <button
                          class="ht-btn red"
                          @click="addToCart({product, variant:product, qty:qty[productIndex], vendorId: product.vendorId});"
                        >
                          <input
                            type="number"
                            min="1"
                            :max="product.stock"
                            v-model="qty[productIndex]"
                            @click.stop
                          >
                          {{ product.productType.key=='bundle' ? $t('Add bundle to Cart') : $t('Add product to Cart') }}
                        </button>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
              <v-flex row wrap>
                <v-flex xs12 offset-sm3 sm6>
                  <nav aria-label="Page navigation" v-if="pageLength > 0">
                    <div class="text-xs-center">
                      <v-pagination v-model="page" :length="pageLength"></v-pagination>
                    </div>
                  </nav>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-layout>
        </div>
      </v-container>
    </section>

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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import WineVendorSearch from "~/components/WineVendorSearch.vue";
import StarRating from "vue-star-rating";
import WineVendor from "~/components/WineVendor.vue";

export default {
  name: "Store",
  layout: "wine",
  data() {
    return {
      isShowImage: false,
      imageUrl: null,
      vendorId: null,
      productId: null,
      selectedVendor: null,
      checkProductType: [],
      checkCategory: [],
      list: true,
      selectedVariant: {},
      categories: [],
      selIndex: [],
      qty: [],
      page: 1,
      countPerPage: 2,
      pageLength: 1,
      availableProducts: null,
      activeProducts: [],
      isLoaded: false
    };
  },
  components: {
    WineVendorSearch,
    StarRating,
    WineVendor
  },
  methods: {
    afterImageLoaded(component) {},
    showImageModal(url) {
      this.imageUrl = url;
      this.isShowImage = true;
    },
    selectImg(productIndex, ix) {
      this.$set(this.selIndex, productIndex, ix);
    },
    async loadCategories() {
      // load all vendor's categories
      let response = await this.$axios.$get(
        "categories/vendor/" + this.vendorId
      );
      for (let i = 0; i < response.length; i++) {
        if (response[i].parentCategory != null)
          this.categories.push(response[i]);
      }

      // init this.categories[i].count
      for (let i = 0; i < this.categories.length; i++) {
        this.categories[i].count = 0;
      }
    },
    getActiveProducts() {
      for (let i = 0; i < this.selectedVendor.vendor_products.length; i++) {
        this.selIndex[i] = 0;
      }

      this.availableProducts = this.productFilter(
        this.selectedVendor.vendor_products,
        this.searchWine
      );
      this.activeProducts = this.availableProducts.slice(
        (this.page - 1) * this.countPerPage,
        (this.page - 1) * this.countPerPage + this.countPerPage
      );

      // set pages number
      this.pageLength = Math.ceil(
        this.availableProducts.length / this.countPerPage
      );
    },
    productFilter: function(products, searchWine) {
      let checkCategory = this.checkCategory;
      let checkProductType = this.checkProductType;

      return products.filter(function(product) {
        if (searchWine == "") {
          let isCategoryExists = false;
          for (let i = 0; i < product.variants.length; i++) {
            for (let j = 0; j < checkCategory.length; j++) {
              if (checkCategory[j] == product.variants[i].category)
                isCategoryExists = true;
            }
          }

          if (checkCategory.length == 0) isCategoryExists = true;

          return (
            (checkProductType.indexOf(product.productType.key) >= 0 ||
              checkProductType.length == 0) &&
            isCategoryExists &&
            product.stock > 0
          );
        } else {
          return (
            product.q.indexOf(searchWine) >= 0 &&
            (checkProductType.indexOf(product.productType.key) >= 0 ||
              checkProductType.length == 0) &&
            product.stock > 0
          );
        }
      });
    },
    featuresFilter: function(features) {
      return features.filter(function(feature, ix) {
        return feature.val != "";
      });
    },
    certificatesFilter(imgs) {
      return imgs.filter(function(img, ix) {
        return ix < 3;
      });
    },
    ...mapActions({ addToCart: "cart/addToCart" })
  },
  async created() {
    // get vendorId from url param
    this.vendorId = this.$route.params.vendor;
    this.productId = this.$route.params.id;

    // get vendor data with his products
    if (this.vendorId) {
      let response = await this.$axios.$get(
        "products/selVendorProducts/" + this.vendorId
      );
      this.selectedVendor = response[0];

      // customize vendor's formattedAddress from HERE address object
      this.selectedVendor.formattedAddress = "";
      if (this.selectedVendor.address != null) {
        this.selectedVendor.formattedAddress += this.selectedVendor.address
          .zipcode
          ? this.selectedVendor.address.zipcode + ", "
          : "";

        this.selectedVendor.formattedAddress += this.selectedVendor.address.city
          ? this.selectedVendor.address.city + ", "
          : "";

        this.selectedVendor.formattedAddress += this.selectedVendor.address
          .streetName
          ? this.selectedVendor.address.streetName
          : "";

        this.selectedVendor.formattedAddress += this.selectedVendor.address
          .streetNumber
          ? "-" + this.selectedVendor.address.streetNumber
          : "";
      }
    } else {
      this.selectedVendor = null;
      return;
    }

    // load categories
    await this.loadCategories();

    if (this.productId) {
      // if productId is selected, reorder vendor products
      for (let i = 0; i < this.selectedVendor.vendor_products.length; i++) {
        if (this.selectedVendor.vendor_products[i]._id == this.productId) {
          let tmp = this.selectedVendor.vendor_products[0];
          this.selectedVendor.vendor_products[0] = this.selectedVendor.vendor_products[
            i
          ];
          this.selectedVendor.vendor_products[i] = tmp;
        }
      }
    }

    // add category data into vendor_products array
    for (let j = 0; j < this.selectedVendor.vendor_products.length; j++) {
      for (let k = 0; k < this.categories.length; k++) {
        for (
          let l = 0;
          l < this.selectedVendor.vendor_products[j].variants.length;
          l++
        )
          if (
            this.categories[k]._id ==
            this.selectedVendor.vendor_products[j].variants[l].category
          )
            this.selectedVendor.vendor_products[j].variants[
              l
            ].categoryName = this.categories[k].name;
      }
    }

    // init selIndex[], qty[](input value of AddToCart button) value
    if (this.selectedVendor) {
      for (let i = 0; i < this.selectedVendor.vendor_products.length; i++) {
        this.selIndex[i] = 0;
        this.qty[i] = 1;

        // calculate product categories of selectedVendor.vendor_products
        for (let j = 0; j < this.categories.length; j++) {
          for (
            let k = 0;
            k < this.selectedVendor.vendor_products[i].variants.length;
            k++
          ) {
            if (
              this.categories[j]._id ==
              this.selectedVendor.vendor_products[i].variants[k].category
            )
              this.categories[j].count++;
          }
        }
      }
    }

    // get active products
    this.getActiveProducts();

    this.$store.commit("selectedVendor", this.selectedVendor);
    this.isLoaded = true;
  },
  computed: {
    ...mapState({
      shipping: state => state.shipping || {},
      totalAmount: state => state.cart.totalAmount || 0,
      cartItems: state => state.cart.items || [],
      zipcode: state => state.auth.zipcode,
      searchWine: state => state.searchWine || ""
    }),
    ...mapGetters({
      loading: "loading"
    }),
    isServiceable: function() {
      if (!this.product.enableZips || !this.$store.state.settings.enableZips)
        return true;
      else return includes(this.product.zips, this.zipcode);
    }
  },
  watch: {
    page(val) {
      this.getActiveProducts();
    },
    checkProductType(val) {
      this.page = 1;
      this.getActiveProducts();
    },
    checkCategory(val) {
      this.page = 1;
      this.getActiveProducts();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/_variables";

section.bg-242424 {
  background: #242424;
  padding: 60px 0;
  height: 100%;
  .box {
    background-color: #191a1c !important;
    color: #fff;
  }
}
.wine_item {
  background-color: #191a1c !important;
  min-height: 300px;
  color: #fff;
  border: 1px solid black;
  margin-bottom: 30px;
  padding: 0px;
  position: relative;

  .image_wrapper {
    padding: 0 !important;
    border-right: 1px solid black;

    .thumbnail {
      text-align: center;
    }
  }
}
.main-image {
  height: 350px;
}

.cart_button_wrapper {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 350px;
}

@media (max-width: 600px) {
  .cart_button_wrapper {
    position: relative;
    width: inherit;
  }
}

.price_detail {
  font-size: 20px;

  .original_price {
    text-align: left;
    text-decoration: line-through;
    padding-bottom: 0 !important;
  }
  .left_product_size {
    text-align: left;
    padding-bottom: 0 !important;
  }
  .selling_price {
    text-align: right;
    padding-bottom: 0 !important;
    color: #dc4c46;
  }
  .product_unit {
    text-align: center;
    padding-bottom: 0 !important;
  }
}
.bg-484848 {
  background: #484848;
  color: white;
}
button input {
  width: 4ex;
  background: transparent;
  border: none;
  color: inherit;
}
.color_white {
  color: white;
}
.available_date {
  color: #f44336;
  float: right;
  padding-bottom: 10px;
  border-bottom: 1px solid #bbb;
}
.f-14 {
  font-size: 14px !important;
}
.clear {
  clear: both;
}
.row {
  margin-right: 0;
  &.bottom {
    width: 100%;
  }
}
.ht-btn {
  width: 100%;
  margin-top: 0;
  display: inline-block;
  color: #fff;
  font-weight: 500;
  border-radius: 0px;
  font-size: 15px;
}
.relative {
  position: relative;
}
.form-group {
  margin-bottom: 20px;
}
.padding-top {
  padding: 0 !important;
}
.heading {
  border-bottom: 1px solid white;
  min-width: 200px;
}
.features_div p {
  margin-bottom: 5px;
}
.certificate_avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  float: right;
}
.bundle_product_summary {
  font-size: 17px;
}
.no_products {
  color: white;
  text-align: center;
}
.black_border {
  border: 1px solid black;
}
</style>
