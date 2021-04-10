import commonPagination from '../components/common/commonPagination'
function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component(commonPagination.name, commonPagination)
  /**
   * 时间日期格式化
   * @param format
   * @returns {*}
   */
  Vue.prototype.dateFormat = function dateFormat (dateObj, format) {
    if (!(dateObj instanceof Date)) {
      dateObj = new Date(dateObj * 1)
    }
    let date = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S+': dateObj.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
      }
    }
    return format
  }

  // 时间格式化过滤器
  Vue.filter('dateFormat', function (dateObj, format) {
    if (!dateObj) return ''
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj)
      // dateObj = new Date(dateObj.getTime() - 8 * 60 * 60000)
    }
    let date = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S+': dateObj.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
      }
    }
    return format
  })
  // 时间格式化过滤器
  Vue.filter('dateFormatSpecial', function (dateObj, format) {
    if (!dateObj) return ''
    dateObj = new Date(new Date(dateObj).getTime() + 24 * 60 * 60 * 1000 + 1)
    let date = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S+': dateObj.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
      }
    }
    return format
  })
}
export default plugin
