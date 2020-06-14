<template>
  <el-container direction="vertical">
    <!--    上半部分-->
    <el-container class="up-container">
      <!--    侧边-->
      <el-aside class="el-aside-left" width="280px">
        <el-card>
          <span @click="getAllProcClick" style="cursor: pointer;">查看全部流程</span>
        </el-card>
        <el-tree :expand-on-click-node="false" node-key="projUid" default-expand-all :data="projListTree" :props="ProjTreeProps" @node-click="ProjTreeNodeClick"></el-tree>
      </el-aside>
      <!--    上半部分主体-->
      <el-main class="up-main">
        <div class="el-table-up-head" style="width: 100%;">
          <span>{{ this.currProj.projName }}</span>
        </div>
        <el-table
          :data="procList"
          height="90%"
          row-key="procUid"
          :default-sort="{ prop: 'procId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="procId" label="流程编号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="procName" label="流程名称" align="center" width="200"></el-table-column>
          <el-table-column prop="procProjName" label="对应项目" align="center" width="200"></el-table-column>
          <el-table-column prop="procPlanDur" label="计划工期" align="center" width="100"></el-table-column>
          <el-table-column prop="procState" label="状态" :formatter="procStateFormat" align="center" width="120"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399; cursor: pointer;">添加</div>
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary" plain round
                icon="el-icon-plus"
                size="mini"
                @click="addOptProc(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!--    分割中右-->
      <div style="width: 10px; height: 100%; background-color: #D6E8F7"></div>
      <el-aside width="36%">
        <div class="el-table-up-head" style="width: 100%;">
          <span @click="optStart" style="cursor: pointer;">开始优化</span>
        </div>
        <el-table
          :data="optProcList"
          height="90%"
          row-key="procUid"
          :default-sort="{ prop: 'procId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="procId" label="流程编号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="procName" label="流程名称" align="center" width="200"></el-table-column>
          <el-table-column prop="procProjName" label="对应项目" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399; cursor: pointer;">操作</div>
            </template>
            <template slot-scope="scope">
              <el-button
                type="primary" plain round
                icon="el-icon-delete"
                size="mini"
                @click="deleteOptProc(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
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
            <div id="taskGanttContainer" style="width: 100%"></div>
          </el-tab-pane>
          <el-tab-pane label="资源甘特图" name="resGantt">
            <div id="resGanttContainer" style="width: 1780px"></div>
          </el-tab-pane>
          <el-tab-pane label="资源统计" name="resultRes">
            <div id="humanAr" style="height: 450px; width: 1780px"></div>
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
      taskList: [],
      arList: [],
      humanArList: [],
      equipArList: []
    }
  },
  created() {
    this.getProjListTree()
    this.getProcList().then(() => {
      if (this.procList.length > 0) {
        this.currProc = this.procList[0]
        // this.getTaskListByProcUid()
      }
    })
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
    // 请求项目树数据
    async getProjListTree() {
      const { data: res } = await this.$http.get('/proj/getProjTableData')
      this.projListTree = res
    },
    // 请求全部流程列表
    async getProcList() {
      const { data: res } = await this.$http.get('/proc/getProcList')
      this.procList = res
      this.currProj.projName = '全部流程'
    },
    // 根据项目UID请求流程列表
    async getProcListByProjUid() {
      const { data: res } = await this.$http.get('/proc/getProcListByProjUid/' + this.currProj.projUid)
      this.procList = res
    },
    // 根据流程UID请求任务列表
    async getTaskListByProcUid() {
      const { data: res } = await this.$http.get('/task/getTaskListByProcUid/' + this.currProc.procUid)
      this.taskList = res
    },
    // 查看全部流程按钮
    getAllProcClick() {
      this.getProcList()
      // 清空当前选中项目
      this.currProj = {}
    },
    // 选择项目
    ProjTreeNodeClick(proj) {
      this.currProj = proj
      // 更新流程表格信息
      this.getProcListByProjUid().then(() => {
        if (this.procList.length > 0) {
          this.currProc = this.procList[0]
          // this.getTaskListByProcUid()
        } else {
          this.taskList = []
          this.currProc = {}
        }
      })
    },
    addOptProc(row) {
      this.optProcList.push(row)
    },
    deleteOptProc(row) {
      const targetProcUid = row.procUid
      for (let i = 0, len = this.optProcList.length; i < len; i++) {
        if (targetProcUid === this.optProcList[i].procUid) {
          this.optProcList.splice(i, 1)
          return
        }
      }
    },
    optStart() {
      this.optProcUidList = []
      for (let i = 0, len = this.optProcList.length; i < len; i++) {
        this.optProcUidList.push(this.optProcList[i].procUid)
      }
      this.$http.post('/projOpt/getOptResult', this.optProcUidList).then(res => {
        // 刷新任务列表数据
        this.optResult = res.data
        this.taskList = this.optResult.taskList
        this.taskList.sort((a, b) => {
          return a.pmsTask.taskProcUid.localeCompare(b.pmsTask.taskProcUid)
        })
        // 给任务增加紧前任务名称数组属性
        for (let i = 0, len = this.taskList.length; i < len; i++) {
          let preTasks = []
          let preTaskUids = []
          if (this.taskList[i].taskRealPreTasks !== undefined && this.taskList[i].taskRealPreTasks !== null && this.taskList[i].taskRealPreTasks.length > 0) {
            preTasks = this.taskList[i].taskRealPreTasks
          } else {
            if (this.taskList[i].taskNormalPreTasks !== undefined && this.taskList[i].taskNormalPreTasks !== null && this.taskList[i].taskNormalPreTasks.length > 0) {
              preTasks = this.taskList[i].taskNormalPreTasks
            }
          }
          preTaskUids = preTasks.map((pmsTask) => {
            return pmsTask.taskUid
          })
          this.taskList[i].preTaskUids = preTaskUids
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
        this.$message.success('优化结束！')
        this.taskGantt()
        this.humanArEcharts()
        this.resGantt()
      })
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
    // 资源占用甘特图
    resGantt() {
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
      this.$highcharts.ganttChart('resGanttContainer', {
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
    // 人力echarts图表
    humanArEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('humanAr'))
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
          text: '资源使用情况'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            // inside: true,
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
            // data: dataShadow,
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
    height: 30%;
  }
  .down-container {
    height: 70%;
  }
  .el-table-up-head {
    margin: 0;
    width: 100%;
    height: 46px;
    /*border: 1px dashed #c1c1cd;*/
    /*border-radius: 3px;*/
    /*cursor: pointer;*/
    justify-content: center;
    display: flex;
    line-height: 46px
  }
  .el-aside-left {
    background: #ded;
    .el-card {
      padding: 0;
      height: 45px;
      background: #ddd;
      color: #909399;
      font: 14px"Microsoft YaHei";
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
    }
    .el-tree {
      height: 350px;
      background: #ded;
    }
  }
</style>
