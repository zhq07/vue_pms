<template>
  <el-container>
    <!--    侧边-->
    <el-aside width="280px">
      <el-card>
        <span @click="getAllProcClick" style="cursor: pointer;">查看全部流程</span>
      </el-card>
      <el-tree :expand-on-click-node="false" node-key="projUid" default-expand-all :data="projListTree" :props="ProjTreeProps" @node-click="ProjTreeNodeClick"></el-tree>
    </el-aside>
    <el-container direction="vertical">
      <!--    上半部分-->
      <el-main class="up-main">
        <el-table
          :data="procList"
          height="100%"
          row-key="procUid"
          :default-sort="{ prop: 'procId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="procId" label="流程编号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="procName" label="流程名称" align="center" width="200"></el-table-column>
          <el-table-column prop="procProjName" label="对应项目" align="center" width="200"></el-table-column>
          <el-table-column prop="procPlanStartDateTime" :formatter="datetimeFormat" label="计划开始" align="center" width="160"></el-table-column>
          <el-table-column prop="procPlanFinishDateTime" :formatter="datetimeFormat" label="计划结束" align="center" width="160"></el-table-column>
          <el-table-column prop="procPlanDur" label="计划工期" align="center" width="100"></el-table-column>
          <el-table-column prop="procState" label="状态" :formatter="procStateFormat" align="center" width="120"></el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399; cursor: pointer;" @click="handleInsertRoot()">
                添加流程
              </div>
            </template>
            <template slot-scope="scope">
              <span class="el-tag el-tag--plain el-tag--info el-tag--mini" style="cursor: pointer;" @click="handleEdit(scope.$index, scope.row)">
                修改
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="handleView(scope.$index, scope.row)">
                查看
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="handleDev(scope.$index, scope.row)">
                编制
              </span>
              <span class="el-tag el-tag--plain el-tag--mini" style="cursor: pointer;" @click="handlePublish(scope.$index, scope.row)">
                发布
              </span>
              <span class="el-tag el-tag--plain el-tag--danger el-tag--mini" style="cursor: pointer;" @click="handleDelete(scope.$index, scope.row)">
                删除
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="procDescription" label="详细描述"></el-table-column>
        </el-table>
        <!--    弹出表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="流程名称" prop="procName">
                    <el-input clearable v-model="form.procName" :validate-event="false"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="流程编号" prop="procId">
                    <el-input clearable v-model="form.procId" :validate-event="false"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="对应项目" prop="procProjName">
                    <el-select v-model="form.procProjName" :validate-event="false" @change="selectProjClick" clearable @clear="selectProjClear" filterable placeholder="请选择">
                      <el-option
                        v-for="proj in projList"
                        :key="proj.projUid"
                        :label="proj.projName"
                        :value="proj">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="编制作者">
                    <el-input clearable v-model="form.procAuthor"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="计划开始">
                    <el-date-picker
                      v-model="form.procPlanStartDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="计划结束">
                    <el-date-picker
                      v-model="form.procPlanFinishDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="计划工期">
                    <el-input clearable v-model="form.procPlanDur" placeholder="计划工期"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="当前状态" prop="procState">
                    <el-select v-model="form.procState" clearable filterable placeholder="请选择" :validate-event="false">
                      <el-option
                        v-for="state in procStateOptions"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="详细描述">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.procDesc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="onSubmit">保存</el-button>
              <el-button @click="dialogFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
      <!--    分割-->
      <div style="width: 100%; height: 10px; background-color: #ded"></div>
      <!--      下半部分-->
      <el-main class="down-main">
        <div class="el-table-up-head" style="width: 100%;"><span>{{ this.currProc.procName }}</span></div>
        <el-table
          :data="taskList"
          height="93%"
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
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
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
      dialogFormVisible: false,
      form: {
        procUid: '',
        procId: '',
        procName: '',
        procProjUid: '',
        procProjName: '',
        procPlanStartDateTime: '',
        procPlanFinishDateTime: '',
        procPlanDur: '',
        procState: '',
        procAuthor: '',
        procDescription: ''
      },
      rules: {
        procName: [
          { required: true, message: '不能为空' }
        ],
        procId: [
          { required: true, message: '不能为空' }
        ],
        procProjName: [
          { required: true, message: '不能为空' }
        ],
        procState: [
          { required: true, message: '不能为空' }
        ]
      },
      projListTree: [],
      projList: [],
      procList: [],
      taskList: []
    }
  },
  created() {
    this.getProjListTree()
    this.getProjList()
    this.getProcList().then(() => {
      if (this.procList.length > 0) {
        this.currProc = this.procList[0]
        this.getTaskListByProcUid()
      }
    })
  },
  watch: {
    'form.procPlanStartDateTime'() {
      this.planStartChange()
    },
    'form.procPlanFinishDateTime'() {
      this.planFinishChange()
    },
    'form.procPlanDur'() {
      this.planDurChange()
    }
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
    // 表单中计划时间变化时
    planStartChange() {
      if (!this.strIsEmpty(this.form.procPlanStartDateTime) && !this.strIsEmpty(this.form.procPlanFinishDateTime)) {
        const start = new Date(this.form.procPlanStartDateTime).getTime()
        const finish = new Date(this.form.procPlanFinishDateTime).getTime()
        const dur = Math.floor((finish - start) / (1000 * 3600 * 24))
        this.form.procPlanDur = dur
      } else if (!this.strIsEmpty(this.form.procPlanStartDateTime) && !this.strIsEmpty(this.form.procPlanDur)) {
        const start = new Date(this.form.procPlanStartDateTime).getTime()
        const dur = this.form.procPlanDur * (1000 * 3600 * 24)
        const finish = new Date(start + dur)
        this.form.procPlanFinishDateTime = finish
      }
    },
    planFinishChange() {
      if (!this.strIsEmpty(this.form.procPlanStartDateTime) && !this.strIsEmpty(this.form.procPlanFinishDateTime)) {
        const start = new Date(this.form.procPlanStartDateTime).getTime()
        const finish = new Date(this.form.procPlanFinishDateTime).getTime()
        const dur = Math.floor((finish - start) / (1000 * 3600 * 24))
        this.form.procPlanDur = dur
      } else if (!this.strIsEmpty(this.form.procPlanFinishDateTime) && !this.strIsEmpty(this.form.procPlanDur)) {
        const finish = new Date(this.form.procPlanFinishDateTime).getTime()
        const dur = this.form.procPlanDur * (1000 * 3600 * 24)
        const start = new Date(finish - dur)
        this.form.procPlanFinishDateTime = start
      }
    },
    planDurChange() {
      const regPos = /^\d+(\.\d+)?$/
      if (!regPos.test(this.form.procPlanDur)) {
        return
      }
      if (!this.strIsEmpty(this.form.procPlanStartDateTime) && !this.strIsEmpty(this.form.procPlanDur)) {
        const start = new Date(this.form.procPlanStartDateTime).getTime()
        const dur = this.form.procPlanDur * (1000 * 3600 * 24)
        const finish = new Date(start + dur)
        this.form.procPlanFinishDateTime = finish
      } else if (!this.strIsEmpty(this.form.procPlanFinishDateTime) && !this.strIsEmpty(this.form.procPlanDur)) {
        const finish = new Date(this.form.procPlanFinishDateTime).getTime()
        const dur = this.form.procPlanDur * (1000 * 3600 * 24)
        const start = new Date(finish - dur)
        this.form.procPlanFinishDateTime = start
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
    // 请求表单中对应项目的备选数据
    async getProjList() {
      const { data: res } = await this.$http.get('/proj/getAll')
      this.projList = res
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
          this.getTaskListByProcUid()
        } else {
          this.taskList = []
          this.currProc = {}
        }
      })
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.procProjUid = this.currProj.projUid
      this.form.procProjName = this.currProj.projName
      // this.form.procPlanDur = this.currProj.projPlanDur
      if (!this.strIsEmpty(this.currProj.projName)) {
        this.form.procName = this.currProj.projName + '流程'
      }
      // 新添流程状态默认0-"编制中"
      this.form.procState = 0
      this.dialogFormVisible = true
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.form.procUid = row.procUid
      this.form.procId = row.procId
      this.form.procName = row.procName
      this.form.procProjUid = row.procProjUid
      this.form.procProjName = row.procProjName
      this.form.procPlanStartDateTime = row.procPlanStartDateTime
      this.form.procPlanFinishDateTime = row.procPlanFinishDateTime
      this.form.procPlanDur = row.procPlanDur
      this.form.procAuthor = row.procAuthor
      this.form.procState = row.procState
      this.form.procDescription = row.procDescription
      this.dialogFormVisible = true
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/proc/deleteByUid/' + row.procUid).then(() => {
        // 刷新流程列表数据
        if (Object.keys(this.currProj).length === 0) {
          this.getProcList()
        } else {
          this.getProcListByProjUid()
        }
        this.$message.success('删除成功！')
      })
    },
    // 详情按钮函数
    handleView(index, row) {
      this.currProc = row
      this.getTaskListByProcUid()
    },
    // 编制按钮函数
    handleDev(index, row) {
      this.$router.push({ path: '/procDev', query: { procUid: row.procUid } })
    },
    // 发布按钮函数
    async handlePublish(index, row) {
      const { data: res } = await this.$http.post('/proc/publishProc', row)
      if (res === 'success') {
        this.$message.success('发布成功!')
        await this.$router.push({ path: '/projManager' })
      } else {
        this.$message.error('发布失败!')
      }
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        this.$http.post('/proc/saveOrUpdate', this.form).then(() => {
          // 刷新流程列表数据
          if (Object.keys(this.currProj).length === 0) {
            this.getProcList()
          } else {
            this.getProcListByProjUid()
          }
          this.$message.success('保存成功！')
          // 隐藏对话框
          this.dialogFormVisible = false
        })
      })
    },
    // 选中对应项目备选列中的一个proj
    selectProjClick(proj) {
      if (!this.strIsEmpty(proj.projName)) {
        this.form.procName = proj.projName + '流程'
      }
      this.form.procProjUid = proj.projUid
      this.form.procProjName = proj.projName
    },
    // 清空对应项目
    selectProjClear() {
      this.form.procName = ''
      this.form.procProjUid = ''
      this.form.procProjName = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .up-main {
    padding: 0;
    height: 30%;
  }
  .down-main {
    padding: 0;
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
  .el-aside {
    background: #ded;
    .el-card {
      height: 57px;
      background: #ddd;
      color: #909399;
      font: 14px"Microsoft YaHei";
      font-weight: bold;
      text-align: center;
      vertical-align: middle
    }
    .el-tree {
      background: #ded;
    }
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
</style>
