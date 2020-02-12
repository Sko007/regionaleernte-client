<template>
	<div class="cards-grid row">
		<div class="col-sm-4" v-for="d in data" :key="d._id">
			<div class="card-grid-col">
				<article class="card-typical">
					<div class="card-typical-section">
						<div class="user-card-row">
							<div class="tbl-row">
								<div class="tbl-cell">
									<p class="user-card-row-name">
										<a href="#">{{d.product.name}}</a>
									</p>
									<p class="color-blue-grey-lighter">{{d.upadatedAt}}</p>
								</div>
							</div>
						</div>
					</div>
					<div class="card-typical-content">
						<div class="fancybox">
							<img v-if="d.variant.image" :src="'/uploads/'+d.variant.image" alt="" style="width:100%">
						</div>
					</div>
					<div class="card-typical-section tbl">
						<div class="tbl-row">
							<div class="tbl-cell chat-list-item">
								<div class="chat-list-item-photo">
									<img v-if="d.uid.avatar" :src="'/uploads/'+d.uid.avatar" alt="">
									<img v-else src="/250x250.svg" alt="">
								</div>
								<p class="user-card-row-name">
									<a>{{d.uid.name}} </a>
								</p>
								<p class="user-card-row-mail">
									<a>{{d.uid.email}}</a>
								</p>
							</div>
							<div class="tbl-cell tbl-cell-status">
								<a @click="moderateWish(d)" class="checkbox-bird pull-left">
									<input type="checkbox" v-model="d.status" :checked="false">
									<label for="check-bird-2"></label>
								</a>&nbsp;
								<a @click="deleteWish(d)" class="font-icon font-icon-trash"></a>
							</div>
						</div>
					</div>

				</article>
				<!--.card-typical-->
			</div>
			<!--.card-grid-col-->
		</div>
	</div>
</template>
  <script>
export default {
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    async moderateWish(w) {
      w.status = !w.status;
      await this.$axios.$put("wishlists/" + w._id, w);
    },
    deleteWish(w) {
      let vm = this;
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          vm.deleteConfirmed(w);
        }
      });
    },
    async deleteConfirmed(item) {
      await this.$axios.$delete("wishlists/" + item._id);
      // this.getMyAddress();
    }
  }
};
</script>
  