import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_transition.css'
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import qs from 'qs'
import Swipe from 'components/Swipe.vue'

let { id } = qs.parse(location.search.substr(1))

let detailTab = ['商品详情', '本店成交']

new Vue({
	el: '#app',
	data: {
		id,
		details: null, // 商品详情
		detailTab,  //['商品详情', '本店成交']
		tabIndex: 0, // 商品详情和本店成交切换
		dealLists: null, // 商品交易列表。即本店成交
		loading: false, //加载中
		bannerLists: null, //轮播图
		skuType: 1, //1是点击规格弹出相对应的阴影层和弹窗。2是加入购物车。3是立即购买
		showSku: false, //是否弹出阴影层和弹窗
		skuNum: 1, //购买数量
		isCartAdd: false, //购物车是否有东西，显示购物车图片
		showAddMessage: false //添加成功的提示信息
	},
	created() {
		this.getDetails()
	},
	methods: {
		getDetails() {
			axios.get(url.details, { id }).then(res => {
				// 商品详情
				this.details = res.data.data
				this.bannerLists = []
				this.details.imgs.forEach(item => {
					this.bannerLists.push({
						clickUrl: '',
						img: item
					})
				});
			})
		},
		changeTab(index) {
			// 商品详情和本店成交切换
			this.tabIndex = index
			if (index) {
				this.getDeal()
			}
		},
		getDeal() {
			axios.get(url.deal, { id }).then(res => {
				// 商品交易列表即本店成交
				this.loading = true
				this.dealLists = res.data.data.lists
				this.loading = false
			})
		},
		chooseSku(type) {
			this.skuType = type
			this.showSku = true
		},
		changeSkuNum(num) {
			if (num < 0 && this.skuNum === 1) return
			this.skuNum += num
		},
		addCart() {
			axios.post(url.cartAdd, {
				//!!!用get还是post记得看后台的类型!!!
				//此处{}里面的是需要传递到后台的数据
				id, //在上面已经通过url获取了。 let {id} = qs.parse(location.search.substr(1))
				number: this.sukNum
			}).then(res => {
				if (res.data.status == 200) {
					this.showSku = false
					this.isCartAdd = true
					this.showAddMessage = true

					setTimeout(() => {
						this.showAddMessage = false
					}, 1000)
				}
			})
		}
	},
	components: {
		Swipe
	},
	watch: {
		showSku(val, oldVal) {
			document.body.style.overflow = val ? 'hidden' : 'auto'
			document.querySelector('html').style.overflow = val ? 'hidden' : 'auto'
			document.body.style.height = val ? '100%' : 'auto'
			document.querySelector('html').style.height = val ? '100%' : 'auto'
		}
	},
	mixins: [mixin]
})
