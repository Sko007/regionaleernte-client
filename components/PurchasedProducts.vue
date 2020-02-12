<template>
  <div
    v-infinite-scroll="scroll"
    :infinite-scroll-distance="3"
    :infinite-scroll-immediate-check="true"
    v-if="isLoaded"
  >
    <div v-for="(product,ix) in products" :key="ix">
      <v-card>
        <v-card-text>
          <v-layout row>
            <v-flex md5>
              <v-list subheader>
                <v-list-tile avatar :key="product.title">
                  <v-list-tile-avatar>
                    <img
                      :src="product.url"
                      v-if="product.url!==''"
                      @error="setListImage(product)"
                      alt
                    >
                    <list-image :text="product.name" v-else/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{product.name}}</v-list-tile-title>
                    <v-list-tile-title>{{product.price | currency}}</v-list-tile-title>
                    <v-list-tile-title>{{$t('Purchased on')}} {{product.orderDate | date}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
            <v-flex md7>
              <v-flex>
                <v-icon v-for="(i,ix) in product.rating" :key="ix" color="yellow">star</v-icon>
              </v-flex>
              <v-flex>{{product.message}}</v-flex>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-if="product.reviewCreated" flat round @click="leaveFeedback(product)">
            {{$t('Change feedback')}}
            <v-icon>chevron_right</v-icon>
          </v-btn>
          <v-btn v-else flat round @click="leaveFeedback(product)">
            {{$t('Leave feedback')}}
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <br>
    </div>
    <v-flex v-if="products.length===0 && isLoaded">
      <center>{{$t('No purchased products found')}}</center>
    </v-flex>

    <!-- review dialog -->
    <v-dialog v-model="showReviewModal" persistent max-width="700px">
      <v-layout row fluid>
        <v-flex xs12>
          <div class="relative">
            <v-btn icon absolute right top @click="dismissDialog()">
              <v-icon>close</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <h3>{{$t('Rating & Review')}}</h3>
              </v-card-title>
              <v-card-text>
                <star-rating v-model="ratingCount" :star-size="30"></star-rating>
                <span class="err">{{msg}}</span>
                <v-textarea label="Your Review" v-model="message"/>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="orange" @click="dismissDialog()">{{$t('Cancel')}}</v-btn>
                <v-spacer/>
                <v-btn
                  @click="submitReview({rating:ratingCount, message})"
                  :loading="loading"
                  round
                  block
                  color="secondary"
                  :disabled="errors.any()"
                >
                  <v-icon>save</v-icon>
                  {{$t('Submit')}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { basic } from "@/mixins/";
import Vue from "vue";
import ListImage from "@/components/ListImage";
import StarRating from "vue-star-rating";
import Submit from "@/components/Submit";
export default {
  mixins: [basic],
  props: ["api"],
  data() {
    return {
      isLoaded: false,
      products: [],
      showReviewModal: false,
      ratingCount: 0,
      message: "",
      selectedProduct: null,
      msg: ""
    };
  },
  methods: {
    ...mapMutations(["setErr", "setInfo"]),

    async loadData() {
      this.products = [];
      this.isLoaded = false;

      let ordersResponse = await this.$axios.get("orders/my");
      let orders = ordersResponse.data;

      // get purchased products from orders
      for (let i in orders) {
        let order = orders[i];
        // filter order with status(if this order is delivered and not canceled).
        // Right now check order if it's not canceled(temporary).
        if (order.status != "Cancellation Requested") {
          let items = order.items;
          // check if item product is already in 'this.products' variable
          for (let j in items) {
            let item = items[j];
            let isExisted = false;
            for (let k in this.products) {
              let product = this.products[k];
              if (product.productId == item.productId) {
                isExisted = true;
                break;
              }
            }
            if (!isExisted) {
              item.orderDate = order.createdAt;
              this.products.push(item);
            }
          }
        }
      }

      // get review data according to purchased products
      let reviews = await this.$axios.$get("reviews/my");

      if (reviews.length > 0) {
        // console.log("reviews", reviews);
        for (let i in reviews) {
          for (let j in this.products) {
            if (reviews[i].pid == this.products[j].productId) {
              this.products[j].message = reviews[i].message;
              this.products[j].rating = reviews[i].rating;
              this.products[j].reviewActive = reviews[i].active;
              this.products[j].reviewCreated = reviews[i].created;
            }
          }
        }
        // console.log("products", this.products);
      }

      this.isLoaded = true;
    },
    setListImage(i) {
      i.url = "";
    },
    dismissDialog() {
      this.showReviewModal = false;
      this.message = "";
      this.ratingCount = 0;
    },
    async leaveFeedback(product) {
      // show feedback dialog
      this.selectedProduct = await this.$axios.$get(
        "products/" + product.productId
      );
      if (product.reviewCreated) {
        this.message = product.message;
        this.ratingCount = product.rating;
      }
      this.showReviewModal = true;
    },
    async submitReview(data) {
      if (!data.rating) {
        this.msg = "Please rate the item from a scale of 1-5";
        return;
      }
      this.dismissDialog();

      // save to db
      data.pid = this.selectedProduct._id;
      data.pname =
        this.selectedProduct.productType.key == "bundle"
          ? this.selectedProduct.bundleName
          : this.selectedProduct.variants[0].wineName;
      data.avatar =
        this.selectedProduct.productType.key == "bundle"
          ? this.selectedProduct.coverImg
          : this.selectedProduct.variants[0].img[0];
      data.vendorId = this.selectedProduct.vendorId;
      data.vendorName = this.selectedProduct.vendorName;
      data.vendorEmail = this.selectedProduct.vendorEmail;
      data.email = this.user.email;
      data.reviewer = this.user.name;

      try {
        let response = await this.$axios.$post("reviews", data);

        // console.log(response);

        if (this.$store.state.settings.review.moderate) {
          this.popMessage(
            "Your review is under moderation. Will be visible to public after approval."
          );
        } else {
          this.popMessage(
            "Your review successfully summitted. Thanks for your feedback."
          );
        }

        // refresh the page
        this.loadData();
      } catch (err) {
        // console.log(err);
        this.err(err);
      }
    },
    popMessage(msg) {
      this.setInfo(msg);
    }
  },
  components: { ListImage, StarRating, Submit },
  computed: {
    ...mapGetters({ loading: "loading" }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  created() {
    this.loadData();
  }
};
</script>
<style scoped>
.order-detail span:after {
  content: "";
  width: 4px;
  height: 4px;
  background-color: #a4a4a4;
  border-radius: 50%;
  margin: 0 8px 3px;
  display: inline-block;
}
.text-center {
  text-align: center;
}
</style>