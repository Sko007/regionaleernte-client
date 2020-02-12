import { SocketService } from "@/service/socket";
let ss = new SocketService();
import { mapGetters } from 'vuex'
import { typingTimeout, recordsPerScroll } from '@/config'
export default {
  data: () => ({
    meta: { skip: 0, end: false, data: [], busy: false },
    data: [],
    r: {},
    showFilter: false,
    filterInput: '',
    typingTimer: null
  }),
  computed: {
    ...mapGetters(['error', 'loading']),
  },

  methods: {
    search(term) {
      clearTimeout(this.typingTimer)
      let vm = this
      this.typingTimer = setTimeout(function () {
        vm.filterText = term
        vm.flush()
        vm.meta.search = term
        vm.getData()
      }, typingTimeout)
    },
    flush() {
      this.meta.end = false
      this.meta.skip = 0
      this.data = [] // Reset query parameters        
    },
    scroll() {
      if (this.meta.busy || this.meta.end) return
      this.meta.busy = false
      let q = { skip: this.meta.skip, search: this.meta.search, sort: this.meta.sort }
      this.getData(q, true)
    },
    sort(predicate) {
      this.flush()
      this.pagination.descending = !this.pagination.descending
      this.sort.reverse = (this.sort.predicate === predicate) ? !this.sort.reverse : false
      this.sort.predicate = predicate
      this.pagination.sortBy = predicate
      let pr = predicate
      if (this.sort.reverse) { pr = '-' + pr }
      this.meta.sort = pr
      this.getData()
    },
    clone(item) {
      const vm = this
      if (!item) { return }
      this.item = item // Required for cloneConfirmed()
      const cloneConfirmTitle = 'Would you like to clone the ' + this.api + '?'
      this.$swal({
        title: cloneConfirmTitle,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, do it!"
      }).then(result => {
        if (result.value) {
          vm.cloneConfirmed(item);
        }
      });
    },
    async cloneConfirmed(item) {
      let itemCopy = { ...item }
      delete itemCopy._id
      await this.$axios.$post(this.api, itemCopy)
      this.flush()
      this.getData()
    },
    remove(id) {
      let vm = this
      if (!id) { return }
      this.$swal({
        title: "Are you sure to delete?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          vm.deleteConfirmed(id);
        }
      });
    },
    async deleteConfirmed(id) {
      try {
        let result = await this.$axios.$delete(this.api + '/' + id)
        if (result && result.msg === 'deleted') {
          this.flush()
          this.getData()
          this.filterText = ''
        }
      } catch (e) {

      }
    },
    async getData(q, scrolled) {
      q = q || {}
      this.meta.sort = this.meta.sort || '-updatedAt'
      let params = {}
      params.limit = this.meta.limit || recordsPerScroll
      params.skip = this.meta.skip || '0'
      // if (q.where) params.where = JSON.stringify(q.where)
      params.search = this.meta.search || ''
      params.sort = this.meta.sort || {}
      params.type = this.meta.type || {}
      if (this.meta.busy || this.meta.end)
        return
      this.meta.busy = true
      try {
        let items = await this.$axios.$get(this.apig || this.api, { params })
        this.meta.busy = false
        if (items) {
          this.meta.filtered = items.length + this.meta.skip
          this.data = scrolled ? this.data.concat(items) : items
          await ss.syncUpdates(this.model, this.data);
          if (items.length >= params.limit) {
            this.meta.skip = this.meta.filtered
            this.meta.end = false
          } else {
            this.meta.end = true
          }
        }
      }
      catch (e) {
      }
    }
  }
}