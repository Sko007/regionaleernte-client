<template>
  <div>
    <v-container>
      <v-layout align-center>
        <v-flex text-xs-center v-if="error.statusCode === 404">
          <h5 class="display-1">
            <v-icon size="72">warning</v-icon>
            <br>
            {{$t('not_found_msg')}}
          </h5>
          <p>
            <v-btn round nuxt to="/" class="primary">
              <v-icon>home</v-icon>Home page
            </v-btn>
          </p>
        </v-flex>
        <v-flex class="security_err" text-xs-center v-else>
          <h5 class="display-1">
            <v-icon size="60">warning</v-icon>
            <br>
            {{$t('err_msg')}}
          </h5>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["error"]
};
</script>

<style>
.security_err {
  margin-top: 80px;
  text-align: center;
}
</style>