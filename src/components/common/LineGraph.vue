<template>
  <div v-bind:id='id' v-bind:data='data' class='no-drag'></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/lib/chart/bar')// 柱状图
require('echarts/lib/chart/line')// 折线图
require('echarts/lib/chart/pie')// 饼图
// 下面的是需要的提示框
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'line-graph',
  data () {
    return {
      charLineGraph: null
    }
  },
  props: ['id', 'data'],
  watch: {
    data: {
      // 深度监听父组件值的变化
      handler (newValue, oldValue) {
        this.drawLineGraph(this.id, newValue)
      },
      deep: true
    }
  },
  mounted () {
    this.drawLineGraph(this.id, this.data)
    this.initLoad()
    this.observerResize() // DOM加载完毕后给图表的DOM添加监听事件，监听div大小变化，使布局元素大小变化时图表重新初始化
  },
  methods: {
    // 初始化图表方法
    drawLineGraph (id, data) {
      if (id !== 100) {
        let doc = document.getElementById(id)
        this.charLineGraph = echarts.init(doc, 'light')
        this.charLineGraph.setOption(data)
        // this.charLineGraph.hideLoading()
        // window.addEventListener('resize', function () {
        //   _this.charLineGraph.resize()
        // })
      }
    },
    observerResize () {
      setTimeout(this.initLoad, 100)
    },
    // DOM大小变化的监听事件
    initLoad () {
      try {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        let doc = document.getElementById(this.id).parentElement.parentElement.parentElement
        this.observer = new MutationObserver(() => {
          this.charLineGraph.resize()
        })
        this.observer.observe(doc, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped>

</style>
