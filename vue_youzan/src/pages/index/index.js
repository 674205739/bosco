import 'css/common.css'
import './index.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import Foot from 'components/Foot.vue'
import Swipe from 'components/Swipe.vue'

import { InfiniteScroll } from 'mint-ui'
Vue.use(InfiniteScroll)


new Vue({
  el: '.vue-el',
  data: {
    pageNum: 1,
    pageSize: 6,
    lists: null,
    loading: false,
    allLoaded: false,
    bannerLists: null,
    obj: {
      age: 20
    }
  },
  created() {
    this.getLists()
    this.getBanner()
  },
  methods: {
    changeAge(age) {
      console.log(age);
      this.obj.age = age;
    },
    getLists() {
      //    如果没有数据可以加载了，就rerun
      if(this.allLoaded) return
      //    是否在加载中
      this.loading = true
      axios.get(url.hotLists, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        let curLists = res.data.lists 
        //lists是后台数据的名称
        if(curLists.length < this.pageSize) {
        //如果获取的数据长度<pageSize即小于6，allLoaded为真即全部显示完毕。判断所有数据是否加载完毕
          this.allLoaded = true
        }
        if (this.lists) {
          //如果lists存在，把新获取到的数据curLists数组和已有lists数组连接在一起，赋值给this.lists
          this.lists = this.lists.concat(curLists)
          // console.log(Array.isArray(this.lists))  判断是否为数组，结果为true
        } else {
          //如果lists不存在，把获取到的数据curLists数组赋值给lists数组。第一次请求数据
          this.lists = curLists
        }
        this.loading = false
        this.pageNum++
      })
    },
    getBanner() {
      axios.get(url.banner).then(res => {
        this.bannerLists = res.data.lists
      })
    }
  },
  components: {
    Foot,
    Swipe
  }
})