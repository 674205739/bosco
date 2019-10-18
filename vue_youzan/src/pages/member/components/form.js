import Address from 'js/addressService.js'

export default {
  data() {
    return {
      name: '',
      tel: '',
      provinceValue: -1, // 省
      cityValue: -1, // 市
      districtValue: -1,  // 区
      address: '', // 详细地址
      id: '',
      type: '',
      instance: '',
      addressData: require('js/address.json'),
      cityList: null,
      districtList: null
    }
  },
  computed: {
    lists() {
      return this.$store.state.lists
    }
  },
  created () {
    let query = this.$route.query
    this.type = query.type
    this.instance = query.instance

    if(this.type === 'edit') {
      let ad = this.instance
      this.name = ad.name
      this.tel = ad. tel
      this.id = ad.id
      this.address = ad.address
      this.provinceValue = parseInt(ad.provinceValue)

    }
  },
  methods: {
    add() {
      // 需要做非空和合法性测试
      let {name, tel, provinceValue, cityValue, districtValue, address} = this
      let data = {name, tel, provinceValue, cityValue, districtValue, address}
      if(this.type === 'add') {
        // Address.add(data).then(res => {
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('addAction', data)
      }
      if(this.type === 'edit') {
        data.id = this.id
        // Address.update(data).then(res => {
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('updateAction', data.id)
      }
    },
    remove() {
      if(window.confirm('确认删除?')) {
        // Address.remove(id).then(res => {
        //   this.$router.go(-1)
        // })
        this.$store.dispatch('removeAction', this.id)
      }
    },
    setDefault() {
      // Addres.setDefault(this.id).then(res => {
      //     this.$router.go(-1)
      // })
      this.$store.dispatch('setDefaultAction', this.id)
  }
  },
  watch: {
    // lists() {
    //   this.$router.go(-1)
    // },  setDefault的时候，因为没有添加或删除，监听不到，没有实施跳转，需要深度监听
    lists: {
      handler() {
        this.$router.go(-1)
      },
      deep: true
    },
    provinceValue(val) {
      if(val === -1) return
      let list = this.addressData.list
      let index = list.findIndex(item => {
        return item.value == val
      })
      this.cityList = list[index].children
      this.cityValue = -1
      this.districtValue = -1

      if(this.type === 'edit') {
        this.cityValue = parseInt(this.instance.cityValue)
      }
    },
    cityValue(val) {
      if(val === -1) return
      let list = this.cityList
      let index = list.findIndex(item => {
        return item.value == val
      })
      this.districtList = list[index].children
      this.districtValue = -1

      if(this.type === 'edit') {
        this.districtValue = parseInt(this.instance.districtValue)
      }
    }
  }
}