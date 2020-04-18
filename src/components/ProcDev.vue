<template>
  <el-container direction="vertical">
    <el-page-header @back="goBack" :content="currProc.procName" style="margin: 10px 0px"></el-page-header>
    <!--    上半部分-->
    <el-container class="up-container">
      <el-main class="up-main">
        <el-table
          :data="taskList"
          height="100%"
          row-key="taskUid"
          :default-sort="{ prop: 'pmsTask.taskId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column type="index" prop="pmsTask.taskId" label="编号" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="编号" v-model="currTask.pmsTask.taskId"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskName" label="任务名称" align="center" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="任务名称" v-model="currTask.pmsTask.taskName"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanStartDate" label="计划开始" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker size="mini" v-model="currTask.pmsTask.taskPlanStartDate" type="date" value-format="yyyy-MM-dd" placeholder="计划开始"></el-date-picker>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskPlanStartDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanFinishDate" label="计划结束" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker size="mini" v-model="currTask.pmsTask.taskPlanFinishDate" type="date" value-format="yyyy-MM-dd" placeholder="计划结束"></el-date-picker>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskPlanFinishDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskPlanDur" label="工期" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="工期" v-model="currTask.pmsTask.taskPlanDur"></el-input>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskPlanDur }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskEarlyStartDate" label="最早开始" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker size="mini" v-model="currTask.pmsTask.taskEarlyStartDate" type="date" value-format="yyyy-MM-dd" placeholder="最早开始"></el-date-picker>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskEarlyStartDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskLateFinishDate" label="最晚结束" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker size="mini" v-model="currTask.pmsTask.taskLateFinishDate" type="date" value-format="yyyy-MM-dd" placeholder="最晚结束"></el-date-picker>
              </span>
              <span v-else>{{ scope.row.pmsTask.taskLateFinishDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskNormalPreTasks" :formatter="taskNormalPreTasksFormat" label="紧前任务" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" value-key="taskUid" v-model="currTask.taskNormalPreTasks" multiple clearable filterable placeholder="紧前任务">
                  <el-option
                    v-for="preTask in taskList"
                    :key="preTask.pmsTask.taskUid"
                    :label="preTask.pmsTask.taskName"
                    :value="preTask.pmsTask">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskNormalPreTasksFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="taskRealPreTasks" :formatter="taskRealPreTasksFormat" label="真紧前任务" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" value-key="taskUid" v-model="currTask.taskRealPreTasks" multiple clearable filterable placeholder="真紧前任务">
                  <el-option
                    v-for="preTask in taskList"
                    :key="preTask.pmsTask.taskUid"
                    :label="preTask.pmsTask.taskName"
                    :value="preTask.pmsTask">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskRealPreTasksFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskInType" :formatter="taskInTypeFormat" label="输入类型" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskInType" clearable filterable placeholder="输入类型">
                  <el-option
                    v-for="inType in taskInTypeOptions"
                    :key="inType.value"
                    :label="inType.label"
                    :value="inType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskInTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskOutType" :formatter="taskOutTypeFormat" label="输出类型" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskOutType" clearable filterable placeholder="输出类型">
                  <el-option
                    v-for="outType in taskOutTypeOptions"
                    :key="outType.value"
                    :label="outType.label"
                    :value="outType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskOutTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pmsTask.taskType" :formatter="taskTypeFormat" label="任务类型" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select size="mini" v-model="currTask.pmsTask.taskType" clearable filterable placeholder="任务类型">
                  <el-option
                    v-for="taskType in taskTypeOptions"
                    :key="taskType.value"
                    :label="taskType.label"
                    :value="taskType.value">
                  </el-option>
                </el-select>
              </span>
              <span v-else>{{ taskTypeFormat(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;">
                <span @click="addTask()">添加 </span><span @click="updatePmsTaskIds()">/ 排序</span>
              </div>
            </template>
            <template slot-scope="scope">
              <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editTask(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="resPlan(scope.row)">资源</span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteTask(scope.row)">删除</span>
              <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editTask(scope.row, scope.$index, false)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!--    分割左右-->
      <div style="width: 10px; height: 100%; background-color: #D6E8F7"></div>
      <el-aside width="25%">
        <el-table
          :data="taskResPlanList"
          height="100%"
          row-key="resPlanUid"
          :default-sort="{ prop: 'resPlanId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column type="index" prop="resPlanId" label="编号" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="编号" v-model="currTaskResPlan.resPlanId"></el-input>
              </span>
              <span v-else>{{ scope.row.resPlanId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属任务" align="center">
            <template>
              <span v-if="Object.keys(currTask).length !== 0">{{ this.currTask.pmsTask.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="resPlanPriority" label="优先级" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="优先级" v-model="currTaskResPlan.resPlanPriority"></el-input>
              </span>
              <span v-else>{{ scope.row.resPlanPriority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;">
                <span @click="addTaskResPlan()">添加资源方案</span>
              </div>
            </template>
            <template slot-scope="scope">
              <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="editTaskResPlan(scope.row, scope.$index, true)">
                {{ scope.row.isSet ? '保存' : '修改' }}
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="devTaskResPlan(scope.row)">编制</span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteTaskResPlan(scope.row)">删除</span>
              <span v-else class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="editTaskResPlan(scope.row, scope.$index, false)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
    </el-container>
    <!--    分割上下-->
    <div style="width: 100%; height: 10px; background-color: #D6E8F7"></div>
    <!--    下半部分-->
    <el-container class="down-container">
      <el-main class="down-main">downMain</el-main>
      <!--    分割左右-->
      <div style="width: 10px; height: 100%; background-color: #D6E8F7"></div>
      <el-aside width="25%">Aside</el-aside>
    </el-container>
  </el-container>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      taskList: [],
      taskResPlanList: [],
      currProc: {},
      currTask: {},
      currTaskResPlan: {},
      taskInTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '或输入'
      }],
      taskOutTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '或输出'
      }],
      taskTypeOptions: [{
        value: 0,
        label: '普通'
      }, {
        value: 1,
        label: '节点'
      }, {
        value: 2,
        label: '黑盒'
      }]
    }
  },
  created() {
    this.getCurrProc().then(this.getTaskList)
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = this.taskList.splice(oldIndex, 1)[0]
          this.taskList.splice(newIndex, 0, currRow)
        }
      })
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
    async getCurrProc() {
      const { data: res } = await this.$http.get('/proc/getByUid/' + this.$route.query.procUid)
      this.currProc = res
    },
    // 请求任务表格数据
    async getTaskList() {
      const { data: res } = await this.$http.get('/task/getTaskListByProcUid/' + this.currProc.procUid)
      res.map(task => {
        task.isSet = false // 给后台返回数据添加`isSet`标识
        return task
      })
      this.taskList = res
    },
    // 请求资源计划表格数据
    async getTaskResPlanList() {
      const { data: res } = await this.$http.get('/taskResPlan/getByTaskUid/' + this.currTask.pmsTask.taskUid)
      res.map(resPlan => {
        resPlan.isSet = false // 给后台返回数据添加`isSet`标识
        // resPlan.resPlanTaskName = this.currTask.pmsTask.taskName // 给后台返回数据添加所属任务属性
        return resPlan
      })
      this.taskResPlanList = res
    },
    // 添加任务
    addTask() {
      for (const task of this.taskList) {
        if (task.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const tempTask = {
        pmsTask: {
          taskUid: '',
          taskId: this.taskList.length + 1 + '',
          taskName: '',
          taskPlanStartDate: '',
          taskPlanFinishDate: '',
          taskPlanDur: '',
          taskEarlyStartDate: '',
          taskLateFinishDate: '',
          taskInType: 0,
          taskOutType: 0,
          taskType: 0,
          taskProcUid: this.currProc.procUid,
          taskProjUid: this.currProc.procProjUid
        },
        taskNormalPreTasks: [],
        taskRealPreTasks: [],
        isSet: true
      }
      this.taskList.push(tempTask)
      this.currTask = tempTask
    },
    // 修改
    editTask(row, index, cg) {
      // 点击修改，判断是否已经保存所有操作
      for (const task of this.taskList) {
        if (task.isSet && task.pmsTask.taskUid !== row.pmsTask.taskUid) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否取消操作
      if (!cg) {
        if (this.currTask.pmsTask.taskUid.length === 0) {
          this.taskList.splice(index, 1)
        }
        return (row.isSet = !row.isSet)
      }
      // 提交数据
      if (row.isSet) {
        this.$http.post('/task/saveOrUpdateTask', this.currTask).then(() => {
          // 刷新任务列表数据
          this.getTaskList().then(() => {
            // 刷新资源方案列表
            if (this.currTask.pmsTask.taskUid.length === 0) {
              // 如果是添加任务
              this.currTask = this.taskList[this.taskList.length - 1]
              this.taskResPlanList = []
            } else {
              // 如果是编辑任务
              this.getTaskResPlanList()
            }
          })
          this.$message.success('保存成功！')
        })
      } else {
        this.currTask = JSON.parse(JSON.stringify(row))
        // 刷新资源方案列表
        this.getTaskResPlanList()
        row.isSet = true
      }
    },
    // 删除任务
    deleteTask(row) {
      this.$http.delete('/task/deleteByUid/' + row.pmsTask.taskUid).then(() => {
        // 刷新任务列表数据
        this.getTaskList()
        // 如果删除的是currTask所指的一行，则资源列表置空
        if (this.currTask.pmsTask.taskUid === row.pmsTask.taskUid) {
          this.taskResPlanList = []
        }
        this.$message.success('删除成功！')
      })
    },
    // 更新任务编号
    updatePmsTaskIds() {
      const pmsTasks = []
      const tasks = this.taskList
      for (let i = 0, len = tasks.length; i < len; i++) {
        const pmsTask = tasks[i].pmsTask
        pmsTask.taskId = i + 1
        pmsTasks.push(pmsTask)
      }
      this.$http.put('/task/updatePmsTaskIds', pmsTasks).then(() => {
        // 刷新任务表格数据
        this.taskList = [] // 加这句才没问题
        this.getTaskList()
        this.$message.success('更新成功！')
      })
    },
    // 点击资源按钮
    resPlan(row) {
      this.currTask = row
      this.getTaskResPlanList()
    },
    // 添加任务资源方案
    addTaskResPlan() {
      for (const resPlan of this.taskResPlanList) {
        if (resPlan.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const tempResPlan = {
        resPlanUid: '',
        resPlanId: this.taskResPlanList.length + 1 + '',
        resPlanTaskUid: this.currTask.pmsTask.taskUid,
        resPlanProcUid: this.currTask.pmsTask.taskProcUid,
        resPlanProjUid: this.currTask.pmsTask.taskProjUid,
        resPlanPriority: this.taskResPlanList.length + 1 + '',
        isSet: true
      }
      this.taskResPlanList.push(tempResPlan)
      this.currTaskResPlan = tempResPlan
    },
    // 修改任务资源方案
    editTaskResPlan(row, index, cg) {
      // 点击修改，判断是否已经保存所有操作
      for (const resPlan of this.taskResPlanList) {
        if (resPlan.isSet && resPlan.resPlanUid !== row.resPlanUid) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否取消操作
      if (!cg) {
        if (this.currTaskResPlan.resPlanUid.length === 0) {
          this.taskResPlanList.splice(index, 1)
        }
        return (row.isSet = !row.isSet)
      }
      // 保存
      if (row.isSet) {
        this.$http.post('/taskResPlan/saveOrUpdate', this.currTaskResPlan).then(() => {
          // 刷新任务列表数据
          this.getTaskResPlanList()
          this.$message.success('保存成功！')
        })
      } else {
        this.currTaskResPlan = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    // 删除任务资源方案
    deleteTaskResPlan(row) {
      this.$http.delete('/taskResPlan/deleteByUid/' + row.resPlanUid).then(() => {
        // 刷新任务列表数据
        this.getTaskResPlanList()
        this.$message.success('删除成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-main {
    padding: 0;
    height: 100%;
  }
  up-container {
    height: 50%;
  }
  .down-container {
    height: 50%;
  }
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px
  }
</style>
