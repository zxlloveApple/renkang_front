const optionInstance = {
  getPieOption (color, legendName, seriesName, backgroundColor, seriesLabelFormatter, data, isFullscreen) {
    let fontColor = isFullscreen ? '#fff' : '#353535'
    let borderColor = isFullscreen ? '#0A1825' : '#fff'

    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      color: color,
      legend: {
        orient: 'vertical',
        bottom: 0,
        data: legendName,
        icon: 'circle',
        formatter: function (name) {
          let target
          for (let i = 0; i < option.series[0].data.length; i++) {
            if (option.series[0].data[i].name === name) {
              target = option.series[0].data[i].value
            }
          }
          let arr = [name + '： ' + target]
          return arr.join('\n')
        },
        textStyle: {
          color: fontColor,
          fontSize: 14
        }
      },
      series: [
        {
          name: seriesName,
          type: 'pie',
          center: ['50%', '41%'],
          radius: ['40%', '65%'],
          avoidLabelOverlap: false,
          label: {
            // normal: {
            //   show: false,
            //   position: 'center'
            // },
            backgroundColor: backgroundColor,
            borderRadius: 2,
            padding: [7, 7],
            color: '#fff',
            // formatter: '{c} 家',
            formatter: seriesLabelFormatter,
            position: 'top'
          },
          labelLine: {
            normal: {
              show: true,
              length: 0,
              length2: 40,
              lineStyle: {
                color: '#BFBFBF'
              }
            }
          },
          emphasis: {
            label: {
              fontSize: '14',
              fontWeight: 'normal'
            }
            // itemStyle: {
            //   color: '#54CB7E'
            // }
          },
          itemStyle: {
            borderColor: borderColor,
            borderWidth: 10
          },
          data: data
        }
      ]
    }
    return option
  },
  getBarOption (xAxisData, seriesName, seriesColor, seriesData, rotate, isFullscreen) {
    let xAsisLabelColor = isFullscreen ? '#fff' : '#353535'
    let yAsisLabelColor = isFullscreen ? '#fff' : '#bfbfbf'
    let itemTextColor = isFullscreen ? '#fff' : '#666'

    let option = {
      title: {
        text: ''
      },
      grid: {
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
        containLabel: true
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        axisTick: false,
        triggerEvent: true,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 12,
          color: xAsisLabelColor,
          // rotate: 45
          rotate: rotate,
          formatter: function (params) {
            var newParamsName = '' // 最终拼接成的字符串
            var paramsNameNumber = params.length // 实际标签的个数
            var provideNumber = 5 // 每行能显示的字的个数
            // var rowNumber = Math.ceil(paramssNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
              newParamsName = params.substring(0, 5) + '...'
            } else {
              // 将旧标签的值赋给新标签
              newParamsName = params
            }
            // 将最终的字符串返回
            return newParamsName
          }
        }
      },
      yAxis: {
        show: true,
        splitLine: false,
        axisTick: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 12,
          color: yAsisLabelColor
        }
      },
      series: [{
        name: seriesName,
        type: 'bar',
        color: seriesColor,
        data: seriesData,
        barWidth: '12',
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: itemTextColor,
                fontSize: 12
              }
            },
            barBorderRadius: 3
          }
        }
      }]
    }
    return option
  },
  getDoubleBarOption (legendName, xAxisData, seriesData, seriesColor, rotate, isFullscreen) {
    let xAsisLabelColor = isFullscreen ? '#fff' : '#353535'
    let yAsisLabelColor = isFullscreen ? '#fff' : '#bfbfbf'
    let itemTextColor = isFullscreen ? '#fff' : '#666'
    let option = {
      grid: {
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
        containLabel: true
      },
      textStyle: {
        fontSize: 14
      },
      legend: {
        x: 'right',
        icon: 'circle',
        itemHeight: '10',
        textStyle: {
          fontSize: 12,
          color: xAsisLabelColor
        },
        data: legendName
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: false,
        triggerEvent: true,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 12,
          color: xAsisLabelColor,
          // rotate: 45
          rotate: rotate,
          formatter: function (params) {
            var newParamsName = '' // 最终拼接成的字符串
            var paramsNameNumber = params.length // 实际标签的个数
            var provideNumber = 5 // 每行能显示的字的个数
            // var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
              newParamsName = params.substring(0, 5) + '...'
            } else {
              // 将旧标签的值赋给新标签
              newParamsName = params
            }
            // 将最终的字符串返回
            return newParamsName
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          show: true,
          splitLine: false,
          axisTick: false,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            color: yAsisLabelColor
          }
        }
      ],
      series: [
        {
          name: legendName[0],
          barWidth: '14',
          type: 'bar',
          data: seriesData[0],
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              color: seriesColor[0],
              label: {
                show: true,
                position: 'right',
                textStyle: {
                  color: itemTextColor,
                  fontSize: 12
                }
              },
              barBorderRadius: 2
            }
          }
        },
        {
          name: legendName[1],
          barWidth: '14',
          type: 'bar',
          data: seriesData[1],
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              color: seriesColor[1],
              label: {
                show: true,
                position: 'right',
                textStyle: {
                  color: itemTextColor,
                  fontSize: 12
                }
              },
              barBorderRadius: 2
            }
          }
        }

      ]
    }
    return option
  },
  parseEchartData (data, seriesColor, rotate, isFullscreen) {
    let xAxisData = data.xAxis
    let type = data.type
    if (type === 'bar' && data.series.length === 1) { // todo 一跟柱子的柱状图
      let seriesData = []
      let seriesName = data.series[0].name
      data.series[0].data.forEach(item => {
        seriesData.push(item.value)
      })
      return optionInstance.getBarOption(xAxisData, seriesName, seriesColor, seriesData, rotate, isFullscreen)
    }
    if (type === 'bar' && data.series.length > 1) { // todo 两个柱子的柱状图
      let seriesName = [data.series[0].name, data.series[1].name]
      let seriesData1 = []
      let seriesData2 = []
      data.series[0].data.forEach(item => {
        seriesData1.push(parseFloat(item.value.replace('%', '')))
      })
      data.series[1].data.forEach(item => {
        seriesData2.push(parseFloat(item.value.replace('%', '')))
      })
      let seriesData = [seriesData1, seriesData2]
      return optionInstance.getDoubleBarOption(seriesName, xAxisData, seriesData, seriesColor, 45, isFullscreen)
    }
    if (type === 'table') {
      let tableData = []
      data.series[0].data.forEach(val => {
        let item = {
          name: val.name,
          value: val.value
        }
        tableData.push(item)
      })
      return tableData
    }
  }
}
export default optionInstance
