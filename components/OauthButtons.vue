<template>
<div>
  <div class="sb">
    <v-btn @click="loginOauth('facebook')" :loading="facebookLoading" :disabled="facebookLoading" class="btn btn-square facebook" style="background-color: #3B5998; color: rgb(255, 255, 255);" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M17 2v4h-2c-.69 0-1 .81-1 1.5V10h3v4h-3v8h-4v-8H7v-4h3V6a4 4 0 0 1 4-4h3z"></path>
      </svg>
      <span class="hidden-sm-and-down">{{$t('Signin with Facebook')}}</span>
    </v-btn>
    
<!-- <v-btn @click="loginOauth('twitter')" :disabled="twitterLoading" class="btn btn-square" style="background-color: #55ACEE;
    color: rgb(255, 255, 255);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="41" height="24">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
      </svg>
     <v-progress-circular v-if="twitterLoading" indeterminate color="primary"></v-progress-circular>
    <span class="hidden-sm-and-down">{{$t('Signin With Twitter')}}</span>
    </v-btn> -->

    <v-btn @click="loginOauth('google')" :disabled="googleLoading" class="btn btn-square" style="background-color:  #dd4b39;
    color: rgb(255, 255, 255);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="41" height="24">
        <path d="M13.3 13.45l-1.08-.85c-.36-.3-.82-.69-.82-1.42s.55-1.29.97-1.62c1.31-1.02 2.57-2.1 2.57-4.34 0-2.07-1.27-3.26-2.04-3.92h1.75L15.9.05H9.67c-4.36 0-6.6 2.71-6.6 5.72 0 2.33 1.79 4.83 4.98 4.83h.8c-.13.35-.35.84-.35 1.3 0 1.01.42 1.43.92 2-1.42.1-4.01.43-5.92 1.6-1.86 1.1-2.3 2.63-2.3 3.75 0 2.3 2.06 4.5 6.57 4.5 5.35 0 8.03-2.96 8.03-5.88 0-2.16-1.13-3.27-2.5-4.42M5.65 4.31c0-2.21 1.31-3.21 2.69-3.21 2.66 0 4.01 3.45 4.01 5.53 0 2.57-2.07 3.07-2.89 3.07C7 9.7 5.65 6.64 5.65 4.31M9.3 22.3c-3.33 0-5.45-1.49-5.45-3.7 0-2.2 1.96-2.91 2.65-3.16 1.3-.44 3-.49 3.27-.49.3 0 .46 0 .73.02 2.34 1.69 3.35 2.44 3.35 4.03 0 1.77-1.82 3.3-4.55 3.3"></path>
        <path d="M21 10V7h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
      </svg>
     <v-progress-circular v-if="googleLoading" indeterminate color="primary"></v-progress-circular>
    <span class="hidden-sm-and-down">{{$t('Signin With Google')}}</span>
    </v-btn>
    
  </div>
</div>
</template>

<script>
export default {
  data: () => ({
    googleLoading: false,
    facebookLoading: false,
    twitterLoading: false
  }),
  methods: {
    loginOauth(provider) {
      window.location.href = `/api/auth/${provider}`;
    },
    onClose() {
      this.$emit("dismissed");
    }
  }
};
</script>
<style scoped>
svg {
  fill: currentColor;
}
</style>
