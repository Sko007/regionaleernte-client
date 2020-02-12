<template>
  <picture :style="{width: width, 'font-size': fontSize}">
    <source type="image/svg+xml" srcset="~/assets/images/white_logo.png">
    <!-- fallback -->
    <img src="/logo.png" alt="logo" :width="width">
  </picture>
</template>

<script>
export default {
  name: "WineLogo",
  props: {
    width: {
      default: 110
    },
    label: {
      default: false
    },
    fontSize: {
      default: "11px"
    }
  }
};
</script>

<style scoped>
picture {
  display: block;
}
.label:after {
  content: "REGIONALE-ERNTE";
  color: #fff;
  font-family: "Elegant Garamond";
  font-size: inherit;
  display: block;
}
</style>
