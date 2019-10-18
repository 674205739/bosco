import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'

new Vue({
	el: '#app',
	data: {
		topLists: null,
		topIndex: 0,
		subData: null,
    rankData: null,
    obj: {
      age: 20
    }
	},
	created() {
		this.getTopList(),
		this.getSubList(0, 0)
	},
	methods: {
    changeAge(age) {
      console.log(age);
      this.obj.age = age;
    },
		getTopList() {//获取一级分类数据(左边导航栏)
			axios.get(url.topList).then(res => {
				this.topLists = res.data.lists
			})
		},
		getSubList(id, index) {//获取普通分类数据
			this.topIndex = index
			if (index === 0) {
				this.getRank()
			} else {
				axios.get(url.subList).then(res => {
					this.subData = res.data.data
				})
			}
		},
		getRank() {//获取综合排行数据
			axios.get(url.rank).then(res => {
				this.rankData = res.data.data
			})
		},
		toSearch(list) {//跳转
			location.href = `search.html?keyword=${list.name}&id=${list.id}`
			//地址改为http://localhost:8080/${list.href}?index=${index} 
			//例如category页 http://localhost:8080/category.html?index=1
		}
	},
	mixins: [mixin]
})
