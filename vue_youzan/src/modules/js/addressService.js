import {fetchPost, fetchGet} from 'js/fetch.js'
import url from 'js/api.js'

class Address {
  static list() {
    return fetchGet(url.addressList)
  }

  static add(data) {
    return fetchPost(url.addressAdd, data)
  }

  static remove(id) {
    return fetchPost(url.addressRemove, id)
  }

  static update(data) {
    return fetchPost(url.addressUpdate, data)
  }

  static setDefault(id) {
    return fetchPost(url.setDefault, id)
  }
}

export default Address