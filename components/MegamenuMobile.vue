<template>
<div>
    <div class="megamenu category-slider">
        <div v-for="c in $store.state.categories" :key="c._id">
          <router-link :to="'/category/parent/'+c.slug">
            <div class="category-slider__category-block">
              <img class="category-slider__category-img" alt="" :src="c.img"/>
              <div class="category-slider__category-text">
                {{c.name}}
              </div>
            </div>
          </router-link>
        </div>
    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style scoped>
.megamenu {
  overflow-x: auto;
  white-space: nowrap;
  width: auto;
  margin: 0 auto;
  padding: 10px 0;
  position: relative;
  display: flex;
  border-bottom: 1px solid eee;
  background-color: #fff;
  margin-bottom: 10px;
}

.category-slider__category-block {
  display: inline-block;
  line-height: normal;
  max-width: 80px;
  padding: 0 4px;
  text-align: center;
  vertical-align: top;
  white-space: normal;
}
.category-slider__category-img {
  height: 60px;
  margin: 2px auto;
  width: 60px;
}
.category-slider__category-text {
  font-size: 12px;
  text-align: center;
  color: #333;
}
</style>
