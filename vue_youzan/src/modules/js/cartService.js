import {fetchPost, fetchGet} from 'js/fetch.js'
import url from 'js/api.js'

class Cart {
  static get() {
    return fetchGet(url.cartLists)
  }

  static add(id) {
    return fetchPost(url.cartAdd, {
      id,
      number: 1
    })
  }

  static reduce(id) {
    return fetchPost(url.cartReduce, {
      id,
      number: 1
    })
  }

}

export default Cart