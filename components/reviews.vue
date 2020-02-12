<template>
  <div class="pt" v-if="$store.state.settings.review">
    <v-card-title v-if="$store.state.settings.review.enabled" class="sb">
      <!-- <div v-if="rating">
            <h1>Ratings & Reviews</h1>
            {{rating.total}} Ratings & {{reviewCount}} Reviews
      </div>-->
      <v-spacer></v-spacer>
      <v-btn large color="red" @click="reviewForm()">
        <v-icon>star</v-icon>&nbsp; Rate This Product
      </v-btn>
    </v-card-title>

    <v-layout row justify-space-around v-if="rating.total>0">
      <div class="fc">
        <div class="base">
          <h1>{{rating.avg}}</h1>
          <v-icon style="font-size:29px">star</v-icon>
        </div>
        <div class="font">
          {{rating.count}} Ratings
          <div>{{reviewCount}} Reviews</div>
        </div>
      </div>
      <!-- </v-flex> -->

      <v-flex d-flex lg10 xs9 sm6 md10>
        <div>
          <div class="fx sa">
            5
            <v-icon style="color:green">star</v-icon>
            <v-flex lg10 md10 class="fx">
              <v-progress-linear :value="rating.r5*100 / rating.count" height="3" color="green"></v-progress-linear>
            </v-flex>
            <div>{{rating.r5}}</div>
          </div>

          <div class="fx sa">
            4
            <v-icon style="color:rgb(33,150,243)">star</v-icon>
            <v-flex lg10 md10>
              <v-progress-linear :value="rating.r4*100 / rating.count" height="3" color="blue"></v-progress-linear>
            </v-flex>
            <div>{{rating.r4}}</div>
          </div>

          <div class="fx sa">
            3
            <v-icon style="color:orange">star</v-icon>
            <v-flex lg10 md10>
              <v-progress-linear :value="rating.r3*100 / rating.count" height="3" color="warning"></v-progress-linear>
            </v-flex>
            <div>{{rating.r3}}</div>
          </div>

          <div class="fx sa">
            2
            <v-icon style="color:rgb(255,87,34)">star</v-icon>
            <v-flex lg10 md10>
              <v-progress-linear
                style="color:rgb(255,87,34)"
                :value="rating.r2*100 / rating.count"
                height="3"
                color="red"
              ></v-progress-linear>
            </v-flex>
            <div>{{rating.r2}}</div>
          </div>

          <div class="fx sa">
            1
            <v-icon style="color:brown">star</v-icon>
            <v-flex lg10 md10>
              <v-progress-linear :value="rating.r1*100 / rating.count" height="3" color="error"></v-progress-linear>
            </v-flex>
            <div>{{rating.r1}}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-container>
        <v-layout align-center>
          <v-flex text-xs-center>
            <h5 class="display-1">
              <v-icon size="72">warning</v-icon>No ratings or reviews
            </h5>
            <p>Be the first to review the item</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
    <!-- <v-layout row wrap>
  <v-flex lg2 md2 xs2>05</v-flex>
  <v-flex lg8 md8 xs8>
    <v-progress-linear value="15" height="2" color="sucess"></v-progress-linear></v-flex></v-layout>-->
    <div v-for="r in reviews" :key="r._id">
      <v-card>
        <v-card-text row>
          <v-layout>
            <v-flex class="voting">
              <v-btn flat icon @click="vote(r,1)">
                <v-icon size="48">keyboard_arrow_up</v-icon>
              </v-btn>
              <div class="votes" v-if="loading">
                <img src="/loading.svg" alt="loading ...">
              </div>
              <div class="votes" v-else>{{r.votes.count}}</div>
              <v-btn flat icon @click="vote(r,0)" :disabled="r.votes===0">
                <v-icon size="48">keyboard_arrow_down</v-icon>
              </v-btn>
            </v-flex>
            <v-flex class="sb">
              <v-chip label color="success" text-color="white" dark>
                {{r.rating}}
                <v-icon size="15">star</v-icon>
              </v-chip>
              <v-spacer/>
              <v-btn icon @click="deleteReview(r)" v-if="myReview(r)">
                <v-icon class="mute">delete</v-icon>
              </v-btn>
              <div class="pt fs2">{{r.message}}</div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="sb co fs">
          <div>{{$store.state.settings.shopName}} customer Certified Buyer</div>
          <v-spacer/>
          <div class="fx">
            <v-icon size="15">person</v-icon>
            &nbsp;{{r.reviewer}}&nbsp;
            <v-icon size="15">access_time</v-icon>
            &nbsp;{{r.created | date}}
          </div>
        </v-card-actions>
      </v-card>
      <br>
    </div>
    <v-dialog v-model="showReviewModal" persistent max-width="700px">
      <v-layout row fluid>
        <v-flex xs12>
          <div class="relative">
            <v-btn icon absolute right top @click="showReviewModal=false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <h1>{{$t('Rating & Review')}}</h1>
              </v-card-title>
              <v-card-text>
                <star-rating v-model="ratingCount" :star-size="30"></star-rating>
                <span class="err">{{msg}}</span>
                <v-textarea label="Your Review" v-model="message"/>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="orange" @click="showReviewModal=false">Cancel</v-btn>
                <v-spacer/>
                <v-btn
                  @click="submitReview({rating:ratingCount, message})"
                  :loading="loading"
                  round
                  block
                  color="primary"
                  :disabled="errors.any()"
                >
                  <v-icon>save</v-icon>Submit
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
import Confirm from "./modal/Confirm";
import ListImage from "./ListImage";
import { mapGetters, mapMutations } from "vuex";
import Submit from "@/components/Submit";
import StarRating from "vue-star-rating";
export default {
  props: ["product", "selectedVariant"],
  data() {
    return {
      currentRating: "No Rating",
      currentSelectedRating: "No Current Rating",
      boundRating: 3,
      reviews: [],
      ratingCount: 0,
      rating: {},
      starsArray: [],
      message: null,
      msg: null,
      error: {},
      showReviewModal: false
    };
  },
  components: {
    Confirm,
    ListImage,
    Submit,
    StarRating
  },
  created() {
    this.getReviews();
  },
  computed: {
    ...mapGetters({ loading: "loading" }),
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  methods: {
    async vote(review, count) {
      try {
        await this.$axios.$put(`reviews/vote/${count}/${review._id}`);
        await this.getReviews();
      } catch (err) {
        this.err(err);
      }
    },
    ...mapMutations({
      showLoginModal: "login/showLoginModal"
    }),
    setRating(rating) {
      this.rating = "You have Selected: " + rating + " stars";
    },
    showCurrentRating(rating) {
      this.currentRating =
        rating === 0
          ? this.currentSelectedRating
          : "Click to select " + rating + " stars";
    },
    setCurrentSelectedRating(rating) {
      this.currentSelectedRating = "You have Selected: " + rating + " stars";
    },

    async getReviews() {
      if (!this.product._id) return;
      try {
        let r = await this.$axios.$get("reviews/product/" + this.product._id);
        this.publishRatings(r);
        this.reviews = r;
      } catch (err) {
        this.err(err);
      }

      let selectedVendor = this.$store.state.selectedVendor;
      let reviewSum = 0;
      let reviewCount = 0;

      if (selectedVendor != null) {
        for (let j = 0; j < selectedVendor.vendor_products.length; j++) {
          let r = await this.$axios.$get(
            "reviews/product/" + selectedVendor.vendor_products[j]._id
          );
          if (r.length > 0) {
            for (let k = 0; k < r.length; k++) {
              reviewSum += r[k].rating;
              reviewCount++;
            }
          }
        }
        // console.log("vendor rating: ", reviewSum, reviewCount);
        if (reviewCount > 0) {
          // if there are some reviews
          selectedVendor.rating = Math.round(reviewSum / reviewCount);
        } else {
          selectedVendor.rating = 0;
        }

        this.$store.commit("selectedVendor", selectedVendor);
      }
    },
    publishRatings(r) {
      let vm = this;
      let reviewCount = 0;
      let rating = {
        r5: 0,
        r4: 0,
        r3: 0,
        r2: 0,
        r1: 0,
        count: 0,
        total: 0,
        avg: 0
      };
      r.forEach(function(i) {
        if (i.message) reviewCount++;
        if (i.rating) rating.count++;
        if (i.rating) rating.total = rating.total + i.rating;
        if (i.rating == 5) rating.r5++;
        if (i.rating == 4) rating.r4++;
        if (i.rating == 3) rating.r3++;
        if (i.rating == 2) rating.r2++;
        if (i.rating == 1) rating.r1++;
      }, this);
      this.reviewCount = reviewCount;
      rating.avg = Math.round((rating.total / rating.count) * 10) / 10;
      this.rating = rating;
    },
    deleteReview(review) {
      let vm = this;
      this.$swal({
        text: "Would you like to delete the review ?",
        type: "question",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          vm.deleteConfirmed(review);
        }
      });
    },
    async deleteConfirmed(review) {
      try {
        await this.$axios.$delete("/reviews/" + review._id);
        await this.getReviews();
      } catch (err) {
        this.err("Error while saving your review.");
      }
    },
    myReview(review) {
      if (this.user) return review.email === this.user.email;
    },
    reviewForm() {
      if (!this.user || !this.user.email) {
        this.showLoginModal({ show: true, initiator: "review" });
      } else {
        this.showReviewModal = true;
      }
    },
    // loginSuccess() {
    //   this.review();
    // },
    async submitReview(data) {
      if (!data.rating) {
        this.msg = "Please rate the item from a scale of 1-5";
        return;
      }
      this.showReviewModal = false;
      data.pid = this.product._id;
      data.pname = this.product.name;
      data.pslug = this.product.slug;
      data.avatar = this.selectedVariant.img[0];
      data.size = this.selectedVariant.size;
      data.vendorId = this.product.vendorId;
      data.vendorName = this.product.vendorName;
      data.vendorEmail = this.product.vendorEmail;
      data.email = this.user.email;
      data.reviewer = this.user.name;
      try {
        await this.$axios.$post("reviews", data);
        this.getReviews();
        if (this.$store.state.settings.review.moderate)
          this.popMessage(
            "Your review is under moderation. Will be visible to public after approval."
          );
      } catch (err) {
        this.err(err);
      }
    },
    popMessage(msg) {
      this.$swal({
        title: "Review Moderation",
        text: msg,
        allowOutsideClick: () => !swal.isLoading()
      });
    },
    err(err) {
      this.$store.commit("setErr", err.response.data);
    }
  }
};
</script>
<style scoped>
.err {
  color: red;
  font-size: 0.8em;
}
.voting {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.votes {
  margin-left: 10px;
  font-size: 2em;
}
.btn--top.btn--absolute {
  z-index: 100000;
  top: inherit !important;
  /* right: inherit !important; */
  margin-right: -15px;
}
.relative {
  position: relative;
}
.fx {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.base {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
}
.base1 {
  align-content: baseline;
}
.fc {
  flex-direction: column;
}
.sb {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.sa {
  justify-content: space-around;
}
.font {
  font-size: 15px;
  color: rgb(185, 183, 183);
}
.pt {
  padding-top: 18.5px;
}
.fs2 {
  font-size: 15px;
}
.fs {
  font-size: 13px;
}
.co {
  color: #999999;
}
.mute {
  color: #ccc !important;
}

.footer-icons {
  font-size: 18px;
  width: 18px;
  height: 18px;
}

.w100 {
  width: 88%;
}

.md-progress {
  margin: 0 10px 0 5px;
}

.mb10 {
  margin-bottom: 10px;
}

.mute {
  color: #aaa;
}

.close {
  position: absolute !important;
  right: 0px;
  top: 3px;
  width: 20px;
  min-width: 22px;
}

.reviews-header .total-rating {
  margin: 10px 0px 10px 10px;
  width: 80px;
}

.rating-signal {
  display: flex;
}

.rating-signal md-progress-linear {
  width: 150px;
  margin: 0 20px;
}

.reviews-header .total {
  font-size: 2em;
  margin-bottom: 2px;
}

md-card-header-text .md-title {
  font-weight: bold;
}

.rating-button {
  font-size: 1.1em;
  background-color: limegreen;
  color: #fff;
  width: 49px;
  border-radius: 4px;
  padding: 0 6px;
}

.rating-button ng-md-icon {
  margin-top: -3px;
}
</style>
