<template>
  <div>
    <section class="p-0 page1_main_area">
      <div class="banner bg-image-8 home_page">
        <div class="caption">
          <div class="title-group">
            <h5 class="sub-title">{{$t('REGIONAL-HARVEST')}}</h5>
            <h1>{{$t('The regional product mediator for food')}}</h1>
            <WineVendorSearch/>
          </div>
        </div>
      </div>

      <v-layout row wrap>
        <v-flex xs12 class="why_background">
          <p class="text-md-center why_regionale">{{$t('Why Regionaleernte?')}}</p>
        </v-flex>
      </v-layout>

      <!-- 3 advantages -->
      <v-container fluid class="steps_wrapper">
        <v-layout row wrap justify-space-around>
          <v-flex xs12 md3 class="step_item">
            <v-layout row wrap>
              <v-flex xs2 class="num_div">
                <p class="advantage_number">1</p>
              </v-flex>
              <v-flex xs10>
                <p class="step_title">{{$t('advantage1_title')}}</p>
                <p class="step_desc">{{$t('advantage1_desc1')}}</p>
                <p class="step_desc">{{$t('advantage1_desc2')}}</p>
                <p class="step_desc">{{$t('advantage1_desc3')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 md3 class="step_item">
            <v-layout row wrap>
              <v-flex xs2 class="num_div">
                <p class="advantage_number">2</p>
              </v-flex>
              <v-flex xs10>
                <p class="step_title">{{$t('advantage2_title')}}</p>
                <p class="step_desc">{{$t('advantage2_desc1')}}</p>
                <p class="step_desc">{{$t('advantage2_desc2')}}</p>
                <p class="step_desc">{{$t('advantage2_desc3')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 md3 class="step_item">
            <v-layout row wrap>
              <v-flex xs2 class="num_div">
                <p class="advantage_number">3</p>
              </v-flex>
              <v-flex xs10>
                <p class="step_title">{{$t('advantage3_title')}}</p>
                <p class="step_desc">{{$t('advantage3_desc1')}}</p>
                <p class="step_desc">{{$t('advantage3_desc2')}}</p>
                <p class="step_desc">{{$t('advantage3_desc3')}}</p>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <div class="user_steps">
        <div class="transparent_bg">
          <!-- role button -->
          <div class="role_div">
            <span
              id="customer_button"
              :class="user_role == 'customer' ? 'active btnRole' : 'btnRole'"
              @click="user_role = 'customer'"
            >{{$t('Customer')}}</span>

            <span
              id="vendor_button"
              :class="user_role == 'vendor' ? 'active btnRole' : 'btnRole'"
              @click="user_role = 'vendor'"
            >{{$t('Vendor')}}</span>
          </div>

          <!-- user explanation -->
          <v-layout v-if="user_role == 'customer'" row wrap justify-center>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">gps_fixed</v-icon>
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 1:</p>
                <p class="customer_step">{{$t('customer_step1')}}</p>
              </div>
            </v-flex>
            <v-flex md1 hidden-sm-and-down class="chevron_div">
              <v-icon class="chevron_right">chevron_right</v-icon>
            </v-flex>
            <v-flex md1 hidden-md-and-up class="chevron_div">
              <v-icon class="chevron_right">expand_more</v-icon>
            </v-flex>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">shopping_cart</v-icon>
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 2:</p>
                <p class="customer_step">{{$t('customer_step2')}}</p>
                <p class="customer_step">{{$t('Note')}}:</p>
                <p class="customer_step">{{$t('customer_step2_note')}}</p>
              </div>
            </v-flex>
            <v-flex md1 hidden-sm-and-down class="chevron_div">
              <v-icon class="chevron_right">chevron_right</v-icon>
            </v-flex>
            <v-flex md1 hidden-md-and-up class="chevron_div">
              <v-icon class="chevron_right">expand_more</v-icon>
            </v-flex>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">local_shipping</v-icon>
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 3:</p>
                <p class="customer_step">{{$t('customer_step3')}}</p>
              </div>
            </v-flex>
          </v-layout>

          <!-- vendor explanation -->
          <v-layout v-else row wrap justify-center>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">how_to_reg</v-icon>
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 1:</p>
                <p class="customer_step">{{$t('Vendor Signed up')}} meine.regionaleernte.de</p>
                <p class="customer_step">{{$t('Note')}}:</p>
                <p class="customer_step">{{$t('Gets automatically connected to his bank account')}}</p>
              </div>
            </v-flex>
            <v-flex md1 hidden-sm-and-down class="chevron_div">
              <v-icon class="chevron_right">chevron_right</v-icon>
            </v-flex>
            <v-flex md1 hidden-md-and-up class="chevron_div">
              <v-icon class="chevron_right">expand_more</v-icon>
            </v-flex>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">exposure_plus_1</v-icon>
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 2:</p>
                <p class="customer_step">{{$t('Vendor can add simgle products or product bundles')}}</p>
                <p class="customer_step">{{$t('Note')}}:</p>
                <p
                  class="customer_step"
                >{{$t('Vendor can choose out of three delivery services he likes to offer')}}</p>
                <br>
              </div>
            </v-flex>
            <v-flex md1 hidden-sm-and-down class="chevron_div">
              <v-icon class="chevron_right">chevron_right</v-icon>
            </v-flex>
            <v-flex md1 hidden-md-and-up class="chevron_div">
              <v-icon class="chevron_right">expand_more</v-icon>
            </v-flex>
            <v-flex xs12 md3>
              <div class="icon_wrapper">
                <v-icon class="step_icon">attach_money</v-icon>
                <!-- <div v-html="require(`./../assets/images/euro_symbol.svg`)"></div> -->
              </div>
              <div class="ex_desc">
                <p class="customer_step">{{$t('Step')}} 3:</p>
                <p
                  class="customer_step"
                >{{$t('Money from sold product will get automatically transferred to vendors account')}}</p>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import WineVendorSearch from "~/components/WineVendorSearch.vue";

export default {
  name: "Home",
  layout: "wine",
  data() {
    return {
      user_role: "customer"
    };
  },
  components: {
    WineVendorSearch
  }
};
</script>

<style scoped>
.bg-fbf9f2 {
  background-color: #fbf9f2 !important;
  color: #333;
}
.bg-005960 {
  background-color: #005960 !important;
  color: #fff !important;
}
.bg-image-8 {
  height: 100vh;
}
.advantage_number {
  font-size: 50px;
  text-align: center;
  vertical-align: middle;
}
.step_title {
  font-size: 22px;
}
.step_desc {
  font-size: 18px;
  color: white;
}
.why_regionale {
  text-align: center;
  font-size: 45px;
  margin: 30px 0 30px;
  text-shadow: 3px 3px 3px #333;
  color: white;
}
.status_german {
  font-size: 30px;
  margin: 20px 0;
}
.status_desc {
  font-size: 22px;
  margin: 10px;
}
.solution_desc {
  font-size: 22px;
  color: teal;
  margin: 10px;
}
.steps_wrapper {
  background: #464445;
  margin: 0;
  padding: 100px 0;
  border-bottom: 1px solid black;
}
.step_item {
  margin: 10px;
  padding: 20px 10px;
  background: #a4b2b2;
  border-radius: 10px;
  /* box-shadow: 5px 10px 10px #222; */
  border: 1px solid black;
}
.num_div {
  vertical-align: middle;
}

.icon_wrapper {
  text-align: center;
  margin-bottom: 20px;
}
.step_icon {
  font-size: 100px;
  color: rgb(218, 70, 70);
}
.customer_step {
  font-size: 20px;
}
.customer_step_sub {
  font-size: 18px;
  color: grey;
}
.customer_step_tip {
  font-size: 15px;
}
.chevron_div {
  padding-top: 20px;
  text-align: center;
}
.chevron_right {
  font-size: 50px;
  color: rgb(218, 70, 70);
  margin: auto;
}
.role_div {
  text-align: center;
  margin-bottom: 50px;
  padding-top: 10px;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
}
.btn_user_role {
  line-height: 30px;
  color: red;
  font-size: 30px;
}
.why_background {
  background: #a4b2b2;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
}
.user_steps {
  color: white;
  background: url("../assets/images/front_bg.jpg") no-repeat;
  background-size: cover;
  height: 100%;
  background-position-y: 50%;
  border-bottom: 1px solid black;
}

.transparent_bg {
  background: rgba(0, 0, 0, 0.3);
  height: 100%;
  padding-bottom: 80px;
}
.btnRole {
  color: grey;
  font-size: 25px;
  background: white;
  cursor: pointer;
  margin: 0;
  padding: 20px;
}
.btnRole.active {
  font-weight: bold;
  text-shadow: 3px 3px 3px #ddd;
  color: teal;
}
#customer_button {
  border-bottom-left-radius: 10px;
}
#vendor_button {
  border-bottom-right-radius: 10px;
}
.ex_desc {
  padding-left: 20px;
  padding-right: 10px;
}
</style>
