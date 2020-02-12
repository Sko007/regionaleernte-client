<template>
<div>
    <div class="navbar row">
        <div class="dropdown" v-for="c in $store.state.categories"
            :key="c._id">
            <button class="dropbtn">{{c.name}}
                <v-icon>arrow_drop_down</v-icon>
            </button>
            <div class="dropdown-content">
                <v-layout row wrap>
                    <v-flex xs6 sm3 md3 v-for="h in c.children" :key="h._id" >
                        <router-link :to="'/category/'+h.slug">{{h.name}} </router-link>
                    </v-flex>
                </v-layout>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //   categories: []
    };
  }
  //   async created() {
  //     this.categories = await this.$axios.$get("categories");
  //   }
};
</script>
<style scoped>
.navbar {
  overflow: hidden;
  /* background-color: #f3f3f3; */
}

.navbar a {
  float: left;
  font-size: 16px;
  text-align: center;
  padding: 4px 16px;
  text-decoration: none;
}

/* .navbar a:hover,
.dropdown:hover .dropbtn {
  background-color: rgb(245, 240, 240);
} */

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  width: 100%;
  left: 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content .header {
  background: whitesmoke;
  padding: 16px;
  color: white;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* Create three equal columns that floats next to each other */

.column {
  float: left;
  width: 33.33%;
  padding: 10px;
}

.dropdown .dropbtn {
  display: flex;
  font-size: 22px;
  border: none;
  outline: none;
  color: black;
  padding: 8px 16px;
  background-color: inherit;
  font: inherit;
  margin: 0;
}

.black {
  color: rgb(110, 107, 107);
}

.navbar a:hover,
.dropdown:hover .dropbtn {
  background-color: rgb(230, 234, 235);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  width: 95%;
  left: 30px;
  box-shadow: 0px 8px 16px 0px rgba(216, 167, 167, 0.2);
  z-index: 1;
}

.dropdown-content .header {
  background: white;
  padding: 16px;
  color: white;
}

.dropdown:hover .dropdown-content {
  display: inherit;
}

/* Create three equal columns that floats next to each other */

.column {
  float: right;
  width: 33.33%;
  padding: 10px;
  background-color: white;
  height: 250px;
}

.column a {
  float: none;
  color: black;
  padding: 16px;
  text-decoration: initial;
  display: block;
  text-align: left;
}

.column a {
  float: none;
  color: black;
  padding: 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.column a:hover {
  background-color: rgb(248, 246, 246);
}

/* Clear floats after the columns */

.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive layout - makes the three columns stack on top of each other instead of next to each other */

@media screen and (max-width: 600px) {
  .column {
    width: 100%;
    height: auto;
  }
}

.row {
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.menu-sub {
  position: fixed;
  /* background: rgb(245, 241, 241); */
  width: 100%;
  color: rgb(17, 17, 17);
  font-size: 14px;
  display: none;
}

/* .text {
            font-size: 16px;
        } */

.right {
  padding-right: 10rem;
}

.margin {
  padding-top: 18px;
}

.size {
  height: 5px;
  width: 40rem;
  padding-bottom: 40px;
}
</style>
