<template>
  <el-container direction="vertical">
    <!--    上半部分-->
    <el-container class="up-container">
      <div id="procChartContainer" style="height: 100%;width: 1780px"></div>
    </el-container>
    <!--    分割上下-->
    <div style="width: 100%; height: 10px; background-color: #D6E8F7"></div>
    <!--    下半部分-->
    <el-container class="down-container">
      <el-main class="down-main">
        <el-tabs v-model="activeTagName" type="card">
          <el-tab-pane label="任务列表" name="resultTaskList">
            <el-table
              :data="taskList"
              height="480px"
              row-key="taskUid"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="pmsTask.taskId" label="编号" align="center" sortable width="90"></el-table-column>
              <el-table-column prop="pmsTask.taskName" label="任务名称" align="center" width="220"></el-table-column>
              <el-table-column prop="pmsTask.taskPlanStartDateTime" :formatter="datetimeFormat" label="计划开始" align="center"></el-table-column>
              <el-table-column prop="pmsTask.taskPlanFinishDateTime" :formatter="datetimeFormat" label="计划结束" align="center"></el-table-column>
              <el-table-column prop="pmsTask.taskPlanDur" label="计划工期" align="center"></el-table-column>
              <el-table-column prop="taskNormalPreTasks" :formatter="taskNormalPreTasksFormat" label="紧前任务" align="center"></el-table-column>
              <el-table-column prop="taskRealPreTasks" :formatter="taskRealPreTasksFormat" label="真紧前任务" align="center"></el-table-column>
              <el-table-column prop="pmsTask.taskInType" :formatter="taskInTypeFormat" label="输入类型" align="center"></el-table-column>
              <el-table-column prop="pmsTask.taskOutType" :formatter="taskOutTypeFormat" label="输出类型" align="center"></el-table-column>
              <el-table-column prop="pmsTask.taskType" :formatter="taskTypeFormat" label="任务类型" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="项目甘特图" name="resultGantt">
            <div id="taskGanttContainer" style="width: 1780px"></div>
          </el-tab-pane>
          <el-tab-pane label="任务等待统计" name="taskWait">
            <div id="taskWaitContainer" style="height: 450px; width: 1780px"></div>
          </el-tab-pane>
          <el-tab-pane label="资源占用" name="resArChart">
            <el-tabs v-model="activeResChartName" type="card">
              <el-tab-pane label="人力资源" name="humAr">
                <div id="humResGanttContainer" style="width: 1780px"></div>
              </el-tab-pane>
              <el-tab-pane label="设备资源" name="equipAr">
                <div id="equipResGanttContainer" style="width: 1780px"></div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="资源统计" name="resultRes">
            <el-tabs v-model="activeResChartName" type="card">
              <el-tab-pane label="人力资源" name="humAr">
                <div id="humArCountContainer" style="height: 450px; width: 1780px"></div>
              </el-tab-pane>
              <el-tab-pane label="设备资源" name="equipAr">
                <div id="equipArCountContainer" style="height: 450px; width: 1780px"></div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
<!--        <div class="el-table-up-head" style="width: 100%;"><span>优化结果</span></div>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeTagName: 'resultTaskList',
      activeResChartName: 'humAr',
      ProjTreeProps: {
        children: 'children',
        label: 'projName'
      },
      currProj: {},
      currProc: {},
      procStateOptions: [{
        value: 0,
        label: '编制中'
      }, {
        value: 1,
        label: '已发布'
      }],
      projListTree: [],
      procList: [],
      optProcUidList: [],
      optProcList: [],
      optResult: {},
      procChartTaskList: [],
      procChartData: {
        procChartChartData: [],
        procChartLinks: []
      },
      zoneTime: 0,
      taskList: [],
      arList: [],
      humanArList: [],
      equipArList: []
    }
  },
  created() {},
  mounted() {
    setTimeout(this.handleResult, 500)
  },
  methods: {
    // 格式化时间
    datetimeFormat(row, column, cellValue) {
      const datetime = cellValue
      if (datetime === undefined || datetime === null) {
        return ''
      }
      const moment = require('moment')
      return moment(datetime).format('YYYY-MM-DD HH:mm')
    },
    // 格式化流程状态列
    procStateFormat(row) {
      switch (row.procState) {
        case 0: return '编制中'
        case 1: return '已发布'
      }
    },
    // 格式化任务类型列
    taskTypeFormat(row) {
      switch (row.pmsTask.taskType) {
        case 0: return '普通'
        case 1: return '节点'
        case 2: return '黑盒'
      }
    },
    // 格式化任务输入类型列
    taskInTypeFormat(row) {
      switch (row.pmsTask.taskInType) {
        case 0: return '普通'
        case 1: return '或输入'
      }
    },
    // 格式化任务输出类型列
    taskOutTypeFormat(row) {
      switch (row.pmsTask.taskOutType) {
        case 0: return '普通'
        case 1: return '或输出'
      }
    },
    // 格式化普通紧前任务列
    taskNormalPreTasksFormat(row) {
      const preTasks = row.taskNormalPreTasks
      const preTaskIds = []
      for (let i = 0, len = preTasks.length; i < len; i++) {
        preTaskIds.push(preTasks[i].taskId)
      }
      return preTaskIds.join(',')
    },
    // 格式化真紧前任务列
    taskRealPreTasksFormat(row) {
      const preTasks = row.taskRealPreTasks
      const preTaskIds = []
      for (let i = 0, len = preTasks.length; i < len; i++) {
        preTaskIds.push(preTasks[i].taskId)
      }
      return preTaskIds.join(',')
    },
    // 判断str是否为空或空字符串
    strIsEmpty(str) {
      if (str === undefined || str === null || str === '') {
        return true
      }
    },
    handleResult() {
      // 获取页面参数，刷新任务列表数据
      this.optResult = JSON.parse(this.$route.query.optResult)
      this.optProcList = JSON.parse(this.$route.query.optProcList)
      this.procChartTaskList = this.optResult.procChartTaskList
      this.optResult.taskList.sort((a, b) => {
        return a.pmsTask.taskProcUid.localeCompare(b.pmsTask.taskProcUid)
      })
      this.taskList = this.optResult.taskList
      // 给任务增加紧前任务UID数组属性以及等待时间taskWait属性
      const Day = 1000 * 3600 * 24
      for (let i = 0, len = this.taskList.length; i < len; i++) {
        let preTasks = []
        const preTaskUids = []
        let taskWait = 0
        let lastFinish = 0
        if (this.taskList[i].taskRealPreTasks !== undefined && this.taskList[i].taskRealPreTasks !== null && this.taskList[i].taskRealPreTasks.length > 0) {
          preTasks = this.taskList[i].taskRealPreTasks
        } else {
          if (this.taskList[i].taskNormalPreTasks !== undefined && this.taskList[i].taskNormalPreTasks !== null && this.taskList[i].taskNormalPreTasks.length > 0) {
            preTasks = this.taskList[i].taskNormalPreTasks
          }
        }
        for (let i = 0, len = preTasks.length; i < len; i++) {
          const pmsTask = preTasks[i]
          const preTaskFinish = new Date(pmsTask.taskPlanFinishDateTime).getTime()
          if (preTaskFinish > lastFinish) {
            lastFinish = preTaskFinish
          }
          preTaskUids.push(pmsTask.taskUid)
        }
        if (lastFinish !== 0) {
          taskWait = (new Date(this.taskList[i].pmsTask.taskPlanStartDateTime).getTime() - lastFinish) / Day
        }
        this.taskList[i].preTaskUids = preTaskUids
        this.taskList[i].taskWait = taskWait
        taskWait = 0
        lastFinish = 0
      }
      this.arList = this.optResult.resOcpyNodesList
      this.arList.sort((a, b) => {
        return a[0].resName.localeCompare(b[0].resName)
      })
      this.humanArList = []
      this.equipArList = []
      for (let i = 0, len = this.arList.length; i < len; i++) {
        const resAr = this.arList[i]
        if (resAr[0].resType === 0) {
          this.humanArList.push(resAr)
        }
        if (resAr[0].resType === 1) {
          this.equipArList.push(resAr)
        }
      }
      const procChartData = []
      const procChartLinks = []
      this.zoneTime = 9007199254740992
      // console.log('this.procChartTaskList', this.procChartTaskList)
      for (let i = 0, ilen = this.procChartTaskList.length; i < ilen; i++) {
        const tasks = this.procChartTaskList[i]
        const jlen = tasks.length
        const interval = 1000 / (jlen + 1)
        for (let j = 0; j < jlen; j++) {
          const task = {}
          task.name = tasks[j].pmsTask.taskName
          task.start = new Date(tasks[j].pmsTask.taskPlanStartDateTime).getTime()
          task.finish = new Date(tasks[j].pmsTask.taskPlanFinishDateTime).getTime()
          task.y = interval * (j + 1)
          task.x = 300 * (i + 1)
          task.itemStyle = {
            color: '#C23531'
          }
          // console.log('task.start', task.start)
          if (this.zoneTime > task.start) {
            this.zoneTime = task.start
          }
          procChartData.push(task)
          const sucTasks = tasks[j].taskRealSucTasks
          const klen = sucTasks.length
          for (let k = 0; k < klen; k++) {
            const link = {}
            link.source = task.name
            link.target = sucTasks[k].taskName
            procChartLinks.push(link)
          }
        }
      }
      this.procChartData.procChartData = procChartData
      this.procChartData.procChartLinks = procChartLinks
      this.procChart()
      this.taskGantt()
      this.taskWaitEchart()
      this.humArCountEchart()
      this.equipArCountEchart()
      this.humResGantt()
      this.equipResGantt()
    },
    // 计划流程图
    procChart() {
      this.$message.success('仿真开始！')
      const myChart = this.$echarts.init(document.getElementById('procChartContainer'))
      const data = this.procChartData.procChartData
      const links = this.procChartData.procChartLinks
      const option = {
        title: {
          text: '流程计划仿真',
          subtext: '红色：未开始；橙色：进行中；绿色：已完成'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 30,
            roam: true,
            label: {
              show: true,
              textStyle: {
                // color: 'black'
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            symbol: 'rectangle',
            data: data,
            // links: [],
            links: links,
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      }
      myChart.setOption(option)
      const Day = 3600 * 24
      const updateData = option.series[0].data
      setTimeout(() => {
        for (let i = 0, len = updateData.length; i < len; i++) {
          const task = updateData[i]
          const start = (task.start - this.zoneTime) / (Day * 8)
          const finish = (task.finish - this.zoneTime) / (Day * 8)
          setTimeout(() => {
            task.itemStyle.color = '#F96'
            myChart.setOption(option)
          }, start)
          setTimeout(() => {
            task.itemStyle.color = 'green'
            myChart.setOption(option)
          }, finish)
        }
      }, 3000)
    },
    // 任务甘特图
    taskGantt() {
      const Highcharts = this.$highcharts
      const timeDiff = 1000 * 3600 * 8
      // Utility functions
      const dateFormat = Highcharts.dateFormat
      const defined = Highcharts.defined
      const reduce = Highcharts.reduce
      const series = []
      for (let i = 0, len = this.optProcList.length; i < len; i++) {
        const proc = this.optProcList[i]
        const s = {
          name: proc.procName,
          data: [{
            name: proc.procName,
            id: proc.procUid
          }]
        }
        const procUid = proc.procUid
        for (let j = 0, tlen = this.taskList.length; j < tlen; j++) {
          const pmsTask = this.taskList[j].pmsTask
          const preTaskUids = this.taskList[j].preTaskUids
          if (pmsTask.taskProcUid === procUid) {
            const start = new Date(pmsTask.taskPlanStartDateTime)
            const end = new Date(pmsTask.taskPlanFinishDateTime)
            const t = {
              name: pmsTask.taskName,
              id: pmsTask.taskUid,
              parent: procUid,
              dependency: preTaskUids,
              start: start.getTime() + timeDiff,
              end: end.getTime() + timeDiff
              // start: Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes()),
              // end: Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes())
            }
            s.data.push(t)
          }
        }
        series.push(s)
      }
      Highcharts.ganttChart('taskGanttContainer', {
        navigator: {
          enabled: true,
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
          }
        },
        scrollbar: {
          enabled: true
        },
        series: series,
        tooltip: {
          pointFormatter: function () {
            const point = this
            const format = '%Y-%m-%e, %H:%M'
            // const options = point.options
            const lines = [{
              value: point.name,
              style: 'font-weight: bold; font-size: 16;'
            }, {
              title: '开始',
              value: dateFormat(format, point.start),
              style: 'font-size: 16;'
            }, {
              // visible: !options.milestone,
              title: '结束',
              value: dateFormat(format, point.end),
              style: 'font-size: 16;'
            }]
            return reduce(lines, function (str, line) {
              let s = ''
              const style = (
                defined(line.style) ? line.style : 'font-size: 0.8em;'
              )
              if (line.visible !== false) {
                s = (
                  '<span style="' + style + '">' +
                  (defined(line.title) ? line.title + ': ' : '') +
                  (defined(line.value) ? line.value : '') +
                  '</span><br/>'
                )
              }
              return str + s
            }, '')
          }
        }
      })
    },
    // 任务等待时间统计图
    taskWaitEchart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('taskWaitContainer'))
      const dataAxis = []
      const data = []
      for (let i = 0, len = this.taskList.length; i < len; i++) {
        const task = this.taskList[i]
        if (task.taskWait > 0) {
          dataAxis.push(task.pmsTask.taskName)
          data.push(task.taskWait)
        }
      }

      const option = {
        title: {
          text: '任务等待时间统计'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 16
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: '#666',
                    fontSize: 16
                  }
                }
              }
            },
            data: data
          }
        ]
      }

      // Enable data zoom when user click bar.
      const zoomSize = 6
      myChart.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)])
        myChart.dispatchAction({
          type: 'dataZoom',
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        })
      })
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    // 人力资源占用甘特图
    humResGantt() {
      const map = this.$highcharts.map
      const timeDiff = 1000 * 3600 * 8
      // Parse car data into series.
      const series = this.humanArList.map(function (resAr, i) {
        const data = resAr.map(function (deal) {
          return {
            id: 'deal-' + i,
            projName: deal.projName,
            taskName: deal.taskName,
            start: new Date(deal.resStartDateTime).getTime() + timeDiff,
            end: new Date(deal.resFinishDateTime).getTime() + timeDiff,
            y: i
          }
        })
        return {
          name: resAr[0].resName,
          data: data
        }
      })
      this.$highcharts.ganttChart('humResGanttContainer', {
        navigator: {
          enabled: true,
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
          }
        },
        scrollbar: {
          enabled: true
        },
        series: series,
        tooltip: {
          xDateFormat: '%Y %m %d, %H:%M',
          pointFormat: '<span>项目: {point.projName}</span>' +
            '<br/><span>任务: {point.taskName}</span>' +
            '<br/><span>开始: {point.start:%Y-%m-%d, %H:%M}</span>' +
            '<br/><span>结束: {point.end:%Y-%m-%d, %H:%M}</span>'
        },
        // xAxis: {
        //   type: 'datetime',
        //   // tickInterval: 7 * 24 * 3600 * 1000,
        //   dateTimeLabelFormats: {
        //     day: '%m/%d',
        //     month: '%y年%m月',
        //     week: '%m/%d',
        //     year: '%Y年',
        //     millisecond: '%b/%e'
        //   }
        // },
        yAxis: {
          type: 'category',
          grid: {
            columns: [{
              title: {
                text: '名称'
              },
              categories: map(series, function (s) {
                return s.name
              })
            }]
          }
        }
      })
    },
    // 人力资源统计图表
    humArCountEchart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('humArCountContainer'))
      const dataAxis = []
      const data = []
      for (let i = 0, len = this.humanArList.length; i < len; i++) {
        const resAr = this.humanArList[i]
        dataAxis.push(resAr[0].resName)
        let work = 0
        for (let j = 0, rlen = resAr.length; j < rlen; j++) {
          work = work + resAr[j].resWork
        }
        data.push(work)
      }

      const option = {
        title: {
          text: '人力资源统计'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 16
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: '#666',
                    fontSize: 16
                  }
                }
              }
            },
            data: data
          }
        ]
      }

      // Enable data zoom when user click bar.
      const zoomSize = 6
      myChart.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)])
        myChart.dispatchAction({
          type: 'dataZoom',
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        })
      })
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    // 设备资源占用甘特图
    equipResGantt() {
      const map = this.$highcharts.map
      const timeDiff = 1000 * 3600 * 8
      // Parse car data into series.
      const series = this.equipArList.map(function (resAr, i) {
        const data = resAr.map(function (deal) {
          return {
            id: 'deal-' + i,
            projName: deal.projName,
            taskName: deal.taskName,
            start: new Date(deal.resStartDateTime).getTime() + timeDiff,
            end: new Date(deal.resFinishDateTime).getTime() + timeDiff,
            y: i
          }
        })
        return {
          name: resAr[0].resName,
          data: data
        }
      })
      this.$highcharts.ganttChart('equipResGanttContainer', {
        navigator: {
          enabled: true,
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
          }
        },
        scrollbar: {
          enabled: true
        },
        series: series,
        tooltip: {
          xDateFormat: '%Y %m %d, %H:%M',
          pointFormat: '<span>项目: {point.projName}</span>' +
            '<br/><span>任务: {point.taskName}</span>' +
            '<br/><span>开始: {point.start:%Y-%m-%d, %H:%M}</span>' +
            '<br/><span>结束: {point.end:%Y-%m-%d, %H:%M}</span>'
        },
        // xAxis: {
        //   type: 'datetime',
        //   // tickInterval: 7 * 24 * 3600 * 1000,
        //   dateTimeLabelFormats: {
        //     day: '%m/%d',
        //     month: '%y年%m月',
        //     week: '%m/%d',
        //     year: '%Y年',
        //     millisecond: '%b/%e'
        //   }
        // },
        yAxis: {
          type: 'category',
          grid: {
            columns: [{
              title: {
                text: '名称'
              },
              categories: map(series, function (s) {
                return s.name
              })
            }]
          }
        }
      })
    },
    // 设备资源统计图表
    equipArCountEchart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('equipArCountContainer'))
      const dataAxis = []
      const data = []
      for (let i = 0, len = this.equipArList.length; i < len; i++) {
        const resAr = this.equipArList[i]
        dataAxis.push(resAr[0].resName)
        let work = 0
        for (let j = 0, rlen = resAr.length; j < rlen; j++) {
          work = work + resAr[j].resWork
        }
        data.push(work)
      }

      const option = {
        title: {
          text: '设备资源统计'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: 16
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: '#666',
                    fontSize: 16
                  }
                }
              }
            },
            data: data
          }
        ]
      }

      // Enable data zoom when user click bar.
      const zoomSize = 6
      myChart.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)])
        myChart.dispatchAction({
          type: 'dataZoom',
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        })
      })
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-main {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  .up-container {
    height: 40%;
  }
  .down-container {
    height: 60%;
  }
</style>
