import Foot from 'components/Foot.vue'

let mixin = {
  components: {
    Foot
  },
  filters: {
    currency(price) {
      let priceStr = '' + price//将数据转换成字符串类型
      if (priceStr.indexOf('.') > -1) {//如果要检索的字符串值没有出现，则该方法返回 -1,判断是否有小数点
        let arr = priceStr.split('.')
        return arr[0] + '.' + (arr[1] + '0').substr(0, 2)
      } else {
        return priceStr + '.00'
      }
    }
  }
}

export default mixin