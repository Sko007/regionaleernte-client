import { typingTimeout, db } from '@/config'
export default {
  data: () => ({
    meta: { after: 0, end: false, skip: 0, data: [] },
    data: [],
    r: {},
    loading: false,
    showFilter: false,
    filterInput: '',
    typingTimer: null
  }),
  methods: {
    search(term) {
      clearTimeout(this.typingTimer)
      let vm = this
      this.typingTimer = setTimeout(function () {
        vm.filterText = term
        vm.flush()
        vm.meta.search = term
        vm.getData({ search: term })
      }, typingTimeout)
    },
    flush() {
      this.meta.after = 0
      this.meta.end = false
      this.meta.skip = 0
      this.data = [] // Reset query parameters        
    },
    scroll() {
      if (this.meta.busy || this.meta.end) return
      this.meta.busy = false
      let q = { skip: this.meta.after }
      this.getData(q, true)
    },
    sort(predicate) {
      this.flush()
      this.sort.reverse = (this.sort.predicate === predicate) ? !this.sort.reverse : false
      this.sort.predicate = predicate
      let pr = predicate
      if (this.sort.reverse) { pr = '-' + pr }
      this.meta.sort = pr
      this.getData({ sort: pr })
    },
    clone(item) {
      if (!item) { return }
      this.item = item // Required for cloneConfirmed()
      this.$refs.cloneConfirm.open('Would you like to clone the ' + this.api + '?', null, item)
    },
    async cloneConfirmed(close) {
      if (close === 'ok') {
        let itemCopy = { ...this.item }
        delete itemCopy._id
        await this.$store.dispatch('crud/post', { api: this.api, data: itemCopy })
        this.flush()
        this.filterText = ''
        this.getData()
      }
    },

    async save(id, item) {
      try {
        let result = await this.$store.dispatch('save', { api: this.api, item: this.item, id: this.$route.params.id })
        this.$router.push('/' + path)
        // console.log("Document successfully updated!")
      } catch (e) {
        // console.log('Err: ' + e)
      }
    },
    remove(id) {
      db.collection(this.api).doc(id).delete()
    },
    async deleteConfirmed(close) {
      if (close === 'ok') {
        await this.$store.dispatch('crud/delete', this.api + '/' + this.item._id)
        this.flush()
        this.filterText = ''
        this.getData()
      }
    },
    async getData(params, scrolled) {
      this.meta = this.meta || {}
      params = params || {}
      this.meta.sort = this.meta.sort || 'name'
      if (this.meta.busy || this.meta.end) return
      this.meta.limit = params.limit // Required to preserve other params when callee change
      this.meta.busy = true
      let orderDirection = 'desc'
      if (this.meta.sort)
        orderDirection = this.meta.sort.charAt(0) || '' === '-' ? 'desc' : 'asc'

      // let result = await this.$store.dispatch('get', { api: this.api, params })
      // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', this.api, this.meta, this.meta.sort.substr(1), orderDirection, this.meta.limit)
      db.collection(this.api).orderBy(this.meta.sort.substr(1), orderDirection).limit(parseInt(this.meta.limit)).onSnapshot((docs) => {
        let d = []
        docs.forEach((doc) => {
          d.push({ id: doc.id, data: doc.data() })
        });
        // this.data = d
        this.items = d
      });
      this.meta.busy = false
    }
  }
}