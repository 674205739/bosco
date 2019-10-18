import './cart.css'
import './cart_base.css'
import './cart_trade.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'

// 封装axios
import Cart from 'js/cartService.js'

new Vue({
	el: '.container',
	data: {
		lists: null, //购物车列表
    total: 0, // 总价
    editingShop: null, // 处于编辑状态的商铺
    editingShopIndex: -1, // 处于编辑状态的商铺的下标
    removePopup: false, // 删除商品遮罩层，true显示，false隐藏
    removeData: null, // 删除商品的详细信息，包括{商铺、商铺下标、商品、商品下标}
    removeMsg: '' // 点击删除按钮弹出的提示内容
	},
	computed: {
		allSelected: {
			//绑定在全选按钮的class checked
			get() {
				if (this.lists && this.lists.length) {
					//当购物车列表存在时
					return this.lists.every(shop => {
						return shop.checked
						//查看shop.checked,每一个店铺是不是一样的状态，如果是就return
						//注意全部没选返回false，全选返回true
					})
				}
				return false
			},
			set(newVal) {
				this.lists.forEach(shop => {
					shop.checked = newVal
					shop.goodsList.forEach(good => {
						good.checked = newVal
					})
				})
			}
    },
    allRemoveSelected: {
      get() {
        if(this.editingShop) {
          return this.editingShop.removeChecked
        }
        return false
      },
      set(newVal) {
        if(this.editingShop) {
          this.editingShop.removeChecked = newVal
          this.editingShop.goodsList.forEach(good => {
            good.removeChecked = newVal
          })
        }
      }
    },
		selectLists() {
			if(this.lists && this.lists.length) {
				let arr = []
				let total = 0
				this.lists.forEach(shop => {
					shop.goodsList.forEach(good => {
						if (good.checked) {
							arr.push(good)
							total += good.price * good.number
						}
					})
				})
				this.total = total
				return arr
			}
			return []
    },
    removeLists() {
      if(this.editingShop) {
        // 如果有商铺处于编辑状态
        let arr = []
        this.editingShop.goodsList.forEach(good => {
          // 遍历此商铺中每一个商品
          if(good.removeChecked) {
            // 如果商品removeChecked为true，即勾选删除，将商品插入数组arr
            arr.push(good)
          }
        })
        return arr
        // 返回arr，即removeLists = arr
      }
      // 如果没有商铺处于编辑状态，返回一个空数组，即removeLists为空
      return []
    }
	},
	created() {
		this.getLists()
	},
	methods: {
    // 获取数据
		getLists() {
      // axios.get(url.cartLists).then(res => {
			// 	let lists = res.data.cartList
			// 	lists.forEach(shop => {
			// 		// console.log(shop)
			// 		shop.checked = true // 勾选
      //     // console.log(shop) 两次输出的结果可以看出数据已经添加checked属性
      //     shop.removeChecked = false
			// 		shop.editing = false // 商品时候处于编辑状态
			// 		shop.editingMsg = '编辑'
			// 		shop.goodsList.forEach(good => {
      //       good.checked = true
      //       good.removeChecked = false
			// 		})
			// 	})
			// 	//先数据处理，再赋值。 先对原始数据操作，再赋值给this.lists。  响应式原理
			// 	//因为checked动态添加，不能直接赋值
			// 	//所以先用变量lists接收获得原始的数据，然后对原始数据进行操作，每一个都添加checked属性
			// 	//处理完再赋值给this.lists
			// 	this.lists = lists
      // })
      
      Cart.get().then(res => {
				let lists = res.data.cartList
				lists.forEach(shop => {
					// console.log(shop)
					shop.checked = true // 勾选
          // console.log(shop) 两次输出的结果可以看出数据已经添加checked属性
          shop.removeChecked = false
					shop.editing = false // 商品时候处于编辑状态
					shop.editingMsg = '编辑'
					shop.goodsList.forEach(good => {
            good.checked = true
            good.removeChecked = false
					})
				})
				//先数据处理，再赋值。 先对原始数据操作，再赋值给this.lists。  响应式原理
				//因为checked动态添加，不能直接赋值
				//所以先用变量lists接收获得原始的数据，然后对原始数据进行操作，每一个都添加checked属性
				//处理完再赋值给this.lists
				this.lists = lists
      })      
    },
    // 商品勾选按钮
		selectGood(shop, good) {
			// console.log(good)
			// good.checked = !good.checked
			// //取反
			// shop.checked = shop.goodsList.every(good => {
			// 	//every查看shop.goodsList里面的商品的checek，如果一致就返回
			// 	//所有商品checked为true，返回的good.checked为true，反之为false
			// 	//然后返回值赋值给shop.checked。
			// 	//即所有商品已选，返回true，shop.checked也变为true
      //   return good.checked
        
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      // 如果有商铺进入编辑状态就用removeChecked,没有就用checked
      if(this.editingShop) {
        // 通过editingShop判断页面是否处于编辑状态
        if(shop.editing) {
          // 如果页面处于编辑状态，那么只有editing为true，即在编辑状态下的店铺才能实现勾选
          good[attr] = !good[attr]
          shop[attr] = shop.goodsList.every(good =>{
            return good[attr]
          }) 
        }
      }
      else if(this.editingShop === null){
        // 通过editingShop判断页面是否处于编辑状态，如果页面不处于编辑状态，那么所有都可以实现勾选
        good[attr] = !good[attr]
        shop[attr] = shop.goodsList.every(good =>{
          return good[attr]
        }) 
      } 
    },
    // 商铺勾选按钮
		selectShop(shop) {
			// shop.checked = !shop.checked
			// console.log(shop)
			// shop.goodsList.forEach(good => {
			// 	//循环遍历goodsList里面的商品，把shop.checked赋值给所有商品的checked，做到店铺和商品一致
			// 	good.checked = shop.checked
      // })
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      if(this.editingShop) {
        if(shop.editing) {
          shop[attr] = !shop[attr]
          shop.goodsList.forEach(good =>{
            good[attr] = shop[attr] 
          })
        }
      }
      else if(this.editingShop === null){
        shop[attr] = !shop[attr]
        shop.goodsList.forEach(good =>{
          good[attr] = shop[attr] 
        })
       }
    },
    // 全选按钮
		selectAll() {
      let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
			this[attr] = !this[attr]
    },
    // 编辑按钮
    edit(shop,shopIndex) {
      shop.editing  = !shop.editing 
      shop.editingMsg = shop.editing  ? '完成' : '编辑'
      this.lists.forEach((item,i) => {
        if(shopIndex !== i) {
          item.editing = false
          item.editingMsg =  shop.editing ? '' : '编辑'
        }
      })
      this.editingShop = shop.editing ? shop : null // 处于编辑状态的商店
      this.editingShopIndex = shop.editing ? shopIndex : -1
    },
    // 编辑状态减少按钮
    reduce(good) {
      if(good.number === 1) return
      // axios.post(url.cartReduce, {
      //   id: good.id,
      //   number: 1
      // }).then(res => {
      //   good.number--
      // })

      Cart.reduce(good.id).then(res => {
        good.number--
      })

    },
    // 编辑状态增加按钮
    add(good) {
      // axios.post(url.cartAdd, {
      //   id: good.id,
      //   number: 1
      // }).then(res => {
      //   good.number++
      // })

      Cart.add(good.id).then(res => {
        good.number++
      })
    },
    // 商品删除按钮
    remove(shop,shopIndex,good,goodIndex) {
      this.removePopup = true
      // 显示删除提示
      this.removeData = {shop,shopIndex,good,goodIndex}
      this.removeMsg = '确定要删除该商品吗?'
    },
    // 批量删除按钮
    removeList() {
      this.removePopup = true;
      this.removeMsg = '确定将所选' + this.removeLists.length + ' 个商品删除？'
    },
    // 商品删除确认按钮
    removeConfirm(){
            if(this.removeMsg === '确定删除商品吗？'){
                let {shop,shopIndex,good,goodIndex} = this.removeData
                axios.post(url.cartRemove,{
                    id:good.id,
                }).then(res => {
                    shop.goodsList.splice(goodIndex, 1)
                    if(!shop.goodsList.length){
                        this.lists.splice(shopIndex, 1)
                        this.removeShop()
                    }
                    this.removePopup = false;
                    // Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
                    //     left : '0px'
                    // })
                    good.touch = false
                })
             }else{
                 let ids =[]
                 this.removeLists.forEach(good => {
                     ids.push(good)
                 })
                 axios.post(url.cartMrremove, {
                     ids
                 }).then(res => {
                     let arr =[]
                    //  因为如果一个一个找到要删除的商品下标，再一个一个删除，
                    //  那么数组里面的商品下标就会产生变化，所以要从后往前的删除商品才可行，
                    //  因为太复杂，所以使用第二种方法：
                    //  把不在删除列表的商品找出来，放在一个新数组里面。
                    //  然后再判断，如果这个数组存在，就将它赋值给商铺的商品列表，渲染到页面上
                    //  这样页面一样是没有了被删除了的商品
                    //  如果数组不存在 就说明商店的商品已经被删除没了，所以可以将商店删掉了
                     this.editingShop.goodsList.forEach(good => {
                         let index = this.removeLists.findIndex(item => {
                             return item.id ==good.id
                         })
                         if(index === -1){
                             arr.push(good)
                         }
                     })
                     if(arr.length) {
                         this.editingShop.goodsList = arr
                     }else{
                         this.lists.splice(this.editingShopIndex, 1)
                         this.removeShop()
                     }
                     this.removePopup =false
                 })
             }
        },
    // 退出编辑状态，回到正常状态
    removeShop() {
      this.editingShop = null
      this.editingShopIndex = -1
      this.lists.forEach(shop => {
        shop.editing = false
        shop.editingMsg = '编辑'
      })
    },
    start(e,good) {
      good.startX = e.changedTouches[0].clientX
    },
    end(e,shopIndex,good,goodIndex){
      let endX = e.changedTouches[0].clientX
      let left = '0'
      console.log(good.startX, endX)
      if(good.startX - endX > 100){
          left = '-60px'
          
          console.log(good.startX, endX,good.startX - endX)
      }
      if(endX - good.startX > 100){
          left = '0px'
          
          console.log(good.startX, endX, endX - good.startX)
      }
      Velocity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
          left
      })
      
  },

	},
	mixins: [mixin]
})