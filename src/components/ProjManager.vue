<template>
  <el-container direction="vertical">
    <!--    上半部分-->
    <el-main class="up-main">
      <el-table
        :data="projTableData"
        row-key="projUid"
        height="100%"
        :header-cell-style="{'text-align': 'center', background: '#ddd'}"
        highlight-current-row
        border
        :expand-row-keys="expandRowKeys"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="projId" label="项目编号" sortable width="130"></el-table-column>
        <el-table-column prop="projName" label="项目名称" width="200"></el-table-column>
        <el-table-column prop="projOrgName" label="所属组织" width="200"></el-table-column>
  <!--      <el-table-column prop="projManager" label="负责人" align="center" width="100"></el-table-column>-->
        <el-table-column prop="projPriority" label="优先级" :formatter="priorityFormat" align="center" width="100"></el-table-column>
        <el-table-column prop="projPlanStartDateTime" :formatter="dateFormat" label="计划开始" align="center" width="150"></el-table-column>
        <el-table-column prop="projPlanFinishDateTime" :formatter="dateFormat" label="计划结束" align="center" width="150"></el-table-column>
        <el-table-column prop="projPlanDur" label="计划工期" align="center" width="105"></el-table-column>
        <el-table-column prop="projEarlyStartDateTime" :formatter="dateFormat" label="最早开始" align="center" width="150"></el-table-column>
        <el-table-column prop="projLateFinishDateTime" :formatter="dateFormat" label="最晚结束" align="center" width="150"></el-table-column>
<!--        <el-table-column prop="projActStartDateTime" :formatter="dateFormat" label="实际开始" align="center" width="100"></el-table-column>-->
<!--        <el-table-column prop="projActFinishDateTime" :formatter="dateFormat" label="实际结束" align="center" width="100"></el-table-column>-->
        <el-table-column prop="projPctWork" label="完成比例" align="center" width="90"></el-table-column>
        <el-table-column prop="projState" label="状态" :formatter="stateFormat" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot="header">
            <div style="background-color: #ddd; color: #909399; cursor: pointer;" @click="handleInsertRoot()">
              添加项目
            </div>
          </template>
          <template slot-scope="scope">
            <el-button
              plain round
              icon="el-icon-plus"
              size="mini"
              @click="handleInsert(scope.$index, scope.row)">
            </el-button>
            <el-button
              type="primary" plain round
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">
            </el-button>
            <el-button
              type="danger" plain round
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="projDescription" label="详细描述"></el-table-column>
      </el-table>
      <!--    弹出表单-->
      <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="项目名称" prop="projName">
                  <el-input clearable v-model="form.projName" :validate-event="false"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="项目编号" prop="projId">
                  <el-input clearable v-model="form.projId" :validate-event="false"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="所属组织" prop="projOrgName">
                  <el-select v-model="form.projOrgName" clearable filterable @change="selectProjOrgClick" @clear="selectProjOrgClear" placeholder="请选择">
                    <el-option
                      v-for="org in orgList"
                      :key="org.orgUid"
                      :label="org.orgName"
                      :value="org">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="负责领导">
                  <el-input clearable v-model="form.projManager"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="上级项目">
                  <el-select v-model="form.projParName" clearable filterable @change="selectProjParClick" @clear="selectProjParClear" placeholder="请选择">
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
                <el-form-item label="对应任务">
                  <el-select v-model="form.projTaskName" clearable filterable @change="selectProjTaskClick" @clear="selectProjTaskClear" placeholder="请选择">
                    <el-option
                      v-for="task in taskList"
                      :key="task.taskUid"
                      :label="task.taskName"
                      :value="task">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="计划开始">
                  <el-date-picker
                    v-model="form.projPlanStartDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="计划结束">
                  <el-date-picker
                    v-model="form.projPlanFinishDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="计划工期" prop="projPlanDur">
                  <el-input clearable v-model="form.projPlanDur" placeholder="计划工期/天" :validate-event="false"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="优先级" prop="projPriority">
                  <el-select v-model="form.projPriority" clearable placeholder="请选择" :validate-event="false">
                    <el-option
                      v-for="priority in projPriorityOptions"
                      :key="priority.value"
                      :label="priority.label"
                      :value="priority.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="最早开始" prop="projEarlyStartDateTime">
                  <el-date-picker
                    v-model="form.projEarlyStartDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间"
                    :validate-event="false">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="最晚结束" prop="projLateFinishDateTime">
                  <el-date-picker
                    v-model="form.projLateFinishDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间"
                    :validate-event="false">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="实际开始">
                  <el-date-picker
                    v-model="form.projActStartDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="实际结束">
                  <el-date-picker
                    v-model="form.projActFinishDateTime"
                    type="datetime"
                    :default-time="'08:00:00'"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="完成比例">
                  <el-input clearable v-model="form.projPctWork"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="当前状态" prop="projState">
                  <el-select v-model="form.projState" clearable filterable placeholder="请选择" :validate-event="false">
                    <el-option
                      v-for="state in projStateOptions"
                      :key="state.value"
                      :label="state.label"
                      :value="state.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item label="详情描述">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.projDescription"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="onSubmit">保存</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <!--    分割-->
    <div style="width: 100%; height: 10px; background-color: #D6E8F7"></div>
    <!--      下半部分-->
    <el-main class="down-main">
      <div id="projEcharts" class="echarts" style="margin: 0; padding: 0; height: 100%; width: 100%"></div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        projUid: '',
        projId: '',
        projName: '',
        projOrgUid: '',
        projOrgName: '',
        projManager: '',
        projParUid: '',
        projParName: '',
        projTaskUid: '',
        projTaskName: '',
        projPlanStartDateTime: '',
        projPlanFinishDateTime: '',
        projPlanDur: '',
        projPriority: '',
        projEarlyStartDateTime: '',
        projLateFinishDateTime: '',
        projActStartDateTime: '',
        projActFinishDateTime: '',
        projPctWork: '',
        projState: '',
        projDescription: ''
      },
      rules: {
        projName: [
          { required: true, message: '不能为空' }
        ],
        projId: [
          { required: true, message: '不能为空' }
        ],
        projPlanDur: [
          { required: true, message: '不能为空' }
        ],
        projPriority: [
          { required: true, message: '不能为空' }
        ],
        projEarlyStartDateTime: [
          { required: true, message: '不能为空' }
        ],
        projLateFinishDateTime: [
          { required: true, message: '不能为空' }
        ],
        projState: [
          { required: true, message: '不能为空' }
        ]
      },
      projPriorityOptions: [{
        value: 1,
        label: '普通'
      }, {
        value: 2,
        label: '重要'
      }, {
        value: 4,
        label: '关键'
      }],
      projStateOptions: [{
        value: 0,
        label: '编制中'
      }, {
        value: 1,
        label: '已发布'
      }, {
        value: 2,
        label: '进行中'
      }, {
        value: 3,
        label: '逾期进行中'
      }, {
        value: 4,
        label: '已完成'
      }],
      expandRowKeys: [],
      dialogFormVisible: false,
      projTableData: [],
      projList: [],
      taskList: [],
      orgList: []
    }
  },
  created() {
    this.getProjTableData()
    this.getProjList()
    this.getOrgList()
  },
  watch: {
    'form.projPlanStartDateTime'() {
      this.planStartChange()
    },
    'form.projPlanFinishDateTime'() {
      this.planFinishChange()
    },
    'form.projPlanDur'() {
      this.planDurChange()
    }
  },
  methods: {
    // 表格内时间格式化
    dateFormat(row, column) {
      const datetime = row[column.property]
      if (datetime === undefined || datetime === null) {
        return ''
      }
      const moment = require('moment')
      return moment(datetime).format('YYYY-MM-DD HH:mm')
    },
    // 格式化优先级列
    priorityFormat(row, column, cellValue) {
      switch (cellValue) {
        case 1: return '普通'
        case 2: return '重要'
        case 4: return '关键'
        default: return '未知'
      }
    },
    // 格式化状态列
    stateFormat(row, column, cellValue) {
      switch (cellValue) {
        case 0: return '编制中'
        case 1: return '已发布'
        case 2: return '进行中'
        case 3: return '逾期进行中'
        case 4: return '已完成'
      }
    },
    // 判断str是否为空或空字符串
    strIsEmpty(str) {
      if (str === undefined || str === null || str === '') {
        return true
      }
    },
    // 表单中计划时间变化时
    planStartChange() {
      if (!this.strIsEmpty(this.form.projPlanStartDateTime) && !this.strIsEmpty(this.form.projPlanFinishDateTime)) {
        const start = new Date(this.form.projPlanStartDateTime).getTime()
        const finish = new Date(this.form.projPlanFinishDateTime).getTime()
        const dur = Math.floor((finish - start) / (1000 * 3600 * 24))
        this.form.projPlanDur = dur
      } else if (!this.strIsEmpty(this.form.projPlanStartDateTime) && !this.strIsEmpty(this.form.projPlanDur)) {
        const start = new Date(this.form.projPlanStartDateTime).getTime()
        const dur = this.form.projPlanDur * (1000 * 3600 * 24)
        const finish = new Date(start + dur)
        this.form.projPlanFinishDateTime = finish
      }
    },
    planFinishChange() {
      if (!this.strIsEmpty(this.form.projPlanStartDateTime) && !this.strIsEmpty(this.form.projPlanFinishDateTime)) {
        const start = new Date(this.form.projPlanStartDateTime).getTime()
        const finish = new Date(this.form.projPlanFinishDateTime).getTime()
        const dur = Math.floor((finish - start) / (1000 * 3600 * 24))
        this.form.projPlanDur = dur
      } else if (!this.strIsEmpty(this.form.projPlanFinishDateTime) && !this.strIsEmpty(this.form.projPlanDur)) {
        const finish = new Date(this.form.projPlanFinishDateTime).getTime()
        const dur = this.form.projPlanDur * (1000 * 3600 * 24)
        const start = new Date(finish - dur)
        this.form.projPlanFinishDateTime = start
      }
    },
    planDurChange() {
      const regPos = /^\d+(\.\d+)?$/
      if (!regPos.test(this.form.projPlanDur)) {
        return
      }
      if (!this.strIsEmpty(this.form.projPlanStartDateTime) && !this.strIsEmpty(this.form.projPlanDur)) {
        const start = new Date(this.form.projPlanStartDateTime).getTime()
        const dur = this.form.projPlanDur * (1000 * 3600 * 24)
        const finish = new Date(start + dur)
        this.form.projPlanFinishDateTime = finish
      } else if (!this.strIsEmpty(this.form.projPlanFinishDateTime) && !this.strIsEmpty(this.form.projPlanDur)) {
        const finish = new Date(this.form.projPlanFinishDateTime).getTime()
        const dur = this.form.projPlanDur * (1000 * 3600 * 24)
        const start = new Date(finish - dur)
        this.form.projPlanFinishDateTime = start
      }
    },
    // 请求项目表格数据
    async getProjTableData() {
      const { data: res } = await this.$http.get('/proj/getProjTableData')
      this.projTableData = res
      // 默认展开第一层
      for (let i = 0; i < res.length; i++) {
        this.expandRowKeys.push(res[i].projUid)
      }
      this.projEcharts()
    },
    // 请求项目列表数据
    async getProjList() {
      const { data: res } = await this.$http.get('/proj/getPublished')
      this.projList = res
    },
    // 请求项目包含的已发布任务列表数据
    async getTaskList() {
      const { data: res } = await this.$http.get('/task/getPublishedByProjUid/' + this.form.projParUid)
      this.taskList = res
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      this.orgList = res
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据，清空属性值
      for (const key in this.form) {
        this.form[key] = ''
      }
      // 清空对应任务列表
      this.taskList = []
      // 项目优先级默认0-“普通”，状态默认0-"编制中"
      this.form.projPriority = 0
      this.form.projState = 0
      this.form.projPctWork = 0
      this.dialogFormVisible = true
    },
    // 添加按钮函数
    handleInsert(index, row) {
      if (row.projState === 0) {
        this.$message.error('项目尚未发布')
        return
      }
      this.dialogFormVisible = true
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.projParUid = row.projUid
      this.form.projParName = row.projName
      // 项目状态默认0-"编制中"
      this.form.projState = 0
      this.form.projPriority = row.projPriority
      this.form.projState = 0
      this.form.projPctWork = 0
      // 初始化对应任务列表
      this.getTaskList()
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.taskList = []
      this.form.projUid = row.projUid
      this.form.projId = row.projId
      this.form.projName = row.projName
      this.form.projOrgUid = row.projOrgUid
      this.form.projOrgName = row.projOrgName
      this.form.projManager = row.projManager
      this.form.projParUid = row.projParUid
      this.form.projParName = row.projParName
      this.form.projTaskUid = row.projTaskUid
      this.form.projTaskName = row.projTaskName
      this.form.projPlanStartDateTime = row.projPlanStartDateTime
      this.form.projPlanFinishDateTime = row.projPlanFinishDateTime
      this.form.projPlanDur = row.projPlanDur
      this.form.projPriority = row.projPriority
      this.form.projEarlyStartDateTime = row.projEarlyStartDateTime
      this.form.projLateFinishDateTime = row.projLateFinishDateTime
      this.form.projActStartDateTime = row.projActStartDateTime
      this.form.projActFinishDateTime = row.projActFinishDateTime
      this.form.projPctWork = row.projPctWork
      this.form.projState = row.projState
      this.form.projDescription = row.projDescription

      if (this.form.projParUid !== '') {
        this.getTaskList()
      }
      this.dialogFormVisible = true
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/proj/deleteByUid/' + row.projUid).then(() => {
        // 刷新项目表格数据
        this.getProjTableData()
        this.$message.success('删除成功！')
        // 刷新项目列表数据
        this.getProjList()
      })
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        this.$http.post('/proj/saveOrUpdate', this.form).then(() => {
          // 刷新项目表格数据
          this.getProjTableData()
          this.$message.success('保存成功！')
          // 隐藏对话框
          this.dialogFormVisible = false
          // 刷新项目列表数据
          this.getProjList()
        })
      })
    },
    // 选中所属组织备选列中的一个org
    selectProjOrgClick(org) {
      this.form.projOrgUid = org.orgUid
      this.form.projOrgName = org.orgName
    },
    // 清空所属组织
    selectProjOrgClear() {
      this.form.projOrgUid = ''
      this.form.projOrgName = ''
    },
    // 选中上级项目备选列中的一个proj
    selectProjParClick(proj) {
      this.form.projParUid = proj.projUid
      this.form.projParName = proj.projName
      // 清空对应任务
      this.selectProjTaskClear()
      // 更新任务列表
      this.getTaskList()
    },
    // 清空上级项目
    selectProjParClear() {
      this.form.projParUid = ''
      this.form.projParName = ''
      // 清空对应任务
      this.selectProjTaskClear()
    },
    // 选中对应任务备选列中的一个task
    selectProjTaskClick(task) {
      this.form.projTaskUid = task.taskUid
      this.form.projTaskName = task.taskName
      this.form.projName = task.taskName
      this.form.projEarlyStartDateTime = task.taskEarlyStartDateTime
      this.form.projLateFinishDateTime = task.taskLateFinishDateTime
    },
    // 清空对应任务
    selectProjTaskClear() {
      this.form.projTaskUid = ''
      this.form.projTaskName = ''
    },
    // echarts图表
    projEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('projEcharts'))
      const data = []
      for (let i = 0, len = this.projTableData.length; i < len; i++) {
        data.push(this.projTableData[i])
      }
      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          data: [{
            name: data[0].name,
            icon: 'rectangle'
          },
          {
            name: data[1].name,
            icon: 'rectangle'
          }],
          borderColor: '#c23531'
        },
        series: [
          {
            type: 'tree',

            name: data[0].name,

            data: [data[0]],

            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',

            symbolSize: 7,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 16
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
                fontSize: 16
              }
            },

            expandAndCollapse: true,

            animationDuration: 550,
            animationDurationUpdate: 750

          },
          {
            type: 'tree',
            name: data[1].name,
            data: [data[1]],

            top: '5%',
            left: '60%',
            bottom: '2%',
            right: '16%',

            symbolSize: 7,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 16
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
                fontSize: 16
              }
            },

            expandAndCollapse: true,

            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
  .up-main {
    padding: 0;
    height: 50%;
  }
  .down-main {
    padding: 0;
    height: 50%;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
</style>
