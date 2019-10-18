import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'

let { keyword, id } = qs.parse(location.search.substr(1))
//用到了解构赋值{keyword,id}相当于{keyword:keyword, id:id}
//location.search方法是截取当前url中“?”后面的字符串（包括“?”）
//qs.parse(location.search.substr(1))就是把url后面的参数提取出来，变成对象的形式。
//例如：keyword=1,password=2这些，  {keyword:1, password:2}
//此处qs得出的结果为{keyword:'水果', id:'10'}
//因此此表达式为 let {keyword:keyword, id:id} = {keyword:'水果', id:'10'}
console.log(keyword)

new Vue({
	el: '.container',
	data: {
		searchList: null,
		isShow: false,
		keyword//没有这句会报错，但是依旧可以console.log
	},
	created() {
		this.getSearchList()
	},
	methods: {
		getSearchList() {
			axios.get(url.searchList, { keyword, id }).then(res => {
				this.searchList = res.data.lists
			})
		},
		move() {
			if (document.documentElement.scrollTop > 100) {
				this.isShow = true
				return this.isShow
			} else {
				this.isShow = false
				return this.isShow
			}
		},
		toTop() {
			Velocity(document.body, 'scroll', { duration: 1000 })//Velocity的回顶动画,滚动浏览器内容到 <body> 的顶部,时间1秒
		}
	},
	mixins: [mixin],
	mounted() {
		window.addEventListener('scroll', this.move)
	}//没有这句的话监测不到scrollTop
})