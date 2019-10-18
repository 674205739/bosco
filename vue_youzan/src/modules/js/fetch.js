import axios from 'axios'

function fetchPost(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      let status = res.data.status
      if(status === 200) {
        resolve(res)
      }
      //如果没有登录就购买，返回状态码为300 然后跳转到登录页
      //根据实际业务情况
      if(status === 300) {
        location.href = 'login.html'
        resolve(res)
      }
      rejects(res)
    }).catch(error => {
      reject(error)
    })
  })
}

function fetchGet(url, data) {
  return new Promise((resolve, reject) => {
    axios.get(url, data).then(res => {
      let status = res.data.status
      // if(status === 200) {
      //   resolve(res)
      // }
      // //如果没有登录就购买，返回状态码为300 然后跳转到登录页
      // //根据实际业务情况
      // if(status === 300) {
      //   location.href = 'login.html'
      //   resolve(res)
      // }
      // rejects(res)
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export {fetchPost, fetchGet}