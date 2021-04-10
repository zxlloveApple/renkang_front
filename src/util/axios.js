import {Message, MessageBox, Loading} from 'element-ui'
import axios from 'axios'
import Qs from 'qs'

let loading
let http = axios.create({
  baseURL: '/renkang-api-new',
  withCredentials: true,
  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
})
let ignore = ['/medicine/verify/name', '/verify', '/region']
// 配置发送请求前的拦截器 可以设置token信息
http.interceptors.request.use(config => {
  let flag = ignore.filter(item => config.url.indexOf(item) !== -1).length === 0
  if (flag) {
    loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  if (sessionStorage.getItem('$renkang-access-token')) {
    config.headers.common['renkang-access-token'] = `${sessionStorage.getItem('$renkang-access-token')}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 配置响应拦截器
http.interceptors.response.use(res => {
  loading.close()
  if (res.headers['renkang-access-token']) {
    let token = res.headers['renkang-access-token']
    sessionStorage.removeItem('$renkang-access-token')
    sessionStorage.setItem('$renkang-access-token', token)
  }
  if (res.config.url.indexOf('/export') > -1) {
    return Promise.resolve(res)
  }
  if (res.status !== 200) {
    Message.error(res.data.message)
    return Promise.reject(res)
  } else if (res.data.code === 401) {
    MessageBox.alert('登陆失效，请重新登陆！', '警告', {
      confirmButtonText: '确定',
      callback: action => {
        sessionStorage.removeItem('$renkang-access-token')
        let url = window.location.origin
        url = process.env.NODE_ENV === 'production' ? url + '/projectRenkang' : url + '/login'
        top.window.location.href = url
      }
    })
  } else if (res.data.code !== 200) {
    Message.error(res.data.message)
    return
  }
  if (res.headers['user_role']) {
    return Promise.resolve(res)
  } else {
    return Promise.resolve(res.data)
  }
}, error => {
  if (error.response.status === 401) {
    MessageBox.alert('登陆失效，请重新登陆！', '警告', {
      confirmButtonText: '确定',
      callback: action => {
        sessionStorage.removeItem('$renkang-access-token')
        let url = window.location.origin
        url = process.env.NODE_ENV === 'production' ? url + '/projectRenkang' : url + '/login'
        top.window.location.href = url
      }
    })
  } else if (error.response.status === 500) {
    if (error.response.data.code) {
      Message.error(error.response.data.msg)
    } else {
      Message.error('服务器错误')
    }
  } else {
    Message.error('服务器错误')
  }
})

function apiAxios (method, url, params, isJson, response, catchMethod, isDownload) {
  let config = {
    method: method,
    url: url,
    headers: isJson ? {'Content-Type': 'application/json;charset=utf-8'} : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    data: method === 'POST' || method === 'PUT' ? isJson ? JSON.stringify(params) : Qs.stringify(params) : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }
  if (isDownload) config.responseType = 'arraybuffer'
  http(config).then(function (res) {
    if (res.data && res.data.hasOwnProperty('code')) {
      if (res.data.code === 'E1001') {
        MessageBox.alert('登陆失效，请重新登陆！', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            sessionStorage.removeItem('$renkang-access-token')
            let url = window.location.origin
            url = process.env.NODE_ENV === 'production' ? url + '/projectRenkang' : url + '/login'
            top.window.location.href = url
          }
        })
        return
      }
    }
    response(res)
  }).catch((err) => {
    loading.close()
    if (catchMethod) {
      catchMethod(err.response)
    } else {
      if (err.response) {
        let status = err.response.status
        switch (status) {
          case 404:
            Message.error('资源没有找到')
            break
          case 500:
            console.log(err.response)
            Message.error('服务器错误')
        }
      }
    }
  })
}

export default {
  get: function (url, params, response, catchMethod) {
    return apiAxios('GET', url, params, false, response, catchMethod, false)
  },
  post: function (url, params, response, catchMethod) {
    return apiAxios('POST', url, params, false, response, catchMethod, false)
  },
  postJson: function (url, params, response, catchMethod) {
    return apiAxios('POST', url, params, true, response, catchMethod, false)
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, false, response)
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, false, response)
  },
  postDownload: function (url, params, response, catchMethod) {
    return apiAxios('POST', url, params, false, response, catchMethod, true)
  }
}
