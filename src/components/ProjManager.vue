<template>
  <div>
    <el-table
      :data="projTableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="projUid"
      :header-cell-style="{'text-align': 'center', background: '#ddd'}"
      highlight-current-row
      border
      :expand-row-keys="expandRowKeys"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="projId" label="编号" sortable width="120"></el-table-column>
      <el-table-column prop="projName" label="名称" width="200"></el-table-column>
      <el-table-column prop="projOrgName" label="所属组织" width="200"></el-table-column>
<!--      <el-table-column prop="projManager" label="负责人" align="center" width="100"></el-table-column>-->
      <el-table-column prop="projPlanStartDate" label="计划开始" align="center" width="100"></el-table-column>
      <el-table-column prop="projPlanFinishDate" label="计划结束" align="center" width="100"></el-table-column>
      <el-table-column prop="projPlanDur" label="计划工期" align="center" width="105"></el-table-column>
      <el-table-column prop="projEarlyStartDate" label="最早开始" align="center" width="100"></el-table-column>
      <el-table-column prop="projLateFinishDate" label="最晚结束" align="center" width="100"></el-table-column>
      <el-table-column prop="projActStartDate" label="实际开始" align="center" width="100"></el-table-column>
      <el-table-column prop="projActFinishDate" label="实际结束" align="center" width="100"></el-table-column>
      <el-table-column prop="projPctWork" label="完成比例" align="center" width="100"></el-table-column>
      <el-table-column prop="projState" label="状态" :formatter="stateFormat" align="center" width="100"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header">
          <div style="background-color: #ddd; color: #909399;" @click="handleInsertRoot()">
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
    </el-table>
    <!--    弹出表单-->
    <el-dialog width="720px" title="请正确填写表单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="项目名称">
                <el-input clearable v-model="form.projName"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="项目编号">
                <el-input clearable v-model="form.projId"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="所属组织">
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
                  v-model="form.projPlanStartDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="计划结束">
                <el-date-picker
                  v-model="form.projPlanFinishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="最早开始">
                <el-date-picker
                  v-model="form.projEarlyStartDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="最晚结束">
                <el-date-picker
                  v-model="form.projLateFinishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
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
                  v-model="form.projActStartDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="实际结束">
                <el-date-picker
                  v-model="form.projActFinishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
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
              <el-form-item label="当前状态">
                <el-select v-model="projStateLabel" clearable filterable @change="selectProjStateClick" @clear="selectProjStateClear" placeholder="请选择">
                  <el-option
                    v-for="state in projStateOptions"
                    :key="state.value"
                    :label="state.label"
                    :value="state">
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
  </div>
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
        projPlanStartDate: '',
        projPlanFinishDate: '',
        projEarlyStartDate: '',
        projLateFinishDate: '',
        projActStartDate: '',
        projActFinishDate: '',
        projPctWork: '',
        projState: '',
        projDescription: ''
      },
      projStateLabel: '',
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
  },
  methods: {
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
    // 根据数字得到状态
    getStateLabelFromStateValue() {
      switch (this.form.projState) {
        case 0: return '编制中'
        case 1: return '已发布'
        case 2: return '进行中'
        case 3: return '逾期进行中'
        case 4: return '已完成'
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
    },
    // 请求项目列表数据
    async getProjList() {
      const { data: res } = await this.$http.get('/proj/getPublished')
      this.projList = res
    },
    // 请求项目包含的任务列表数据
    async getTaskList() {
      const { data: res } = await this.$http.get('/task/getByProjUid/' + this.form.projParUid)
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
      // 项目状态默认0-"编制中"
      this.form.projState = 0
      this.projStateLabel = this.getStateLabelFromStateValue()
      this.dialogFormVisible = true
    },
    // 添加按钮函数
    handleInsert(index, row) {
      this.dialogFormVisible = true
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.projParUid = row.projUid
      this.form.projParName = row.projName
      // 项目状态默认0-"编制中"
      this.form.projState = 0
      this.projStateLabel = this.getStateLabelFromStateValue()
      // 初始化对应任务列表
      this.getTaskList()
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
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
      this.form.projPlanStartDate = row.projPlanStartDate
      this.form.projPlanFinishDate = row.projPlanFinishDate
      this.form.projPlanDur = row.projPlanDur
      this.form.projEarlyStartDate = row.projEarlyStartDate
      this.form.projLateFinishDate = row.projLateFinishDate
      this.form.projActStartDate = row.projActStartDate
      this.form.projActFinishDate = row.projActFinishDate
      this.form.projPctWork = row.projPctWork
      this.form.projState = row.projState
      this.projStateLabel = this.getStateLabelFromStateValue() // 表单中显示的状态
      this.form.projDescription = row.projDescription

      this.getTaskList()
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
      this.$http.post('/proj/saveOrUpdate', this.form).then(() => {
        // 刷新项目表格数据
        this.getProjTableData()
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.dialogFormVisible = false
        // 刷新项目列表数据
        this.getProjList()
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
    },
    // 清空对应任务
    selectProjTaskClear() {
      this.form.projTaskUid = ''
      this.form.projTaskName = ''
    },
    // 选中项目状态备选列中的一个option
    selectProjStateClick(state) {
      this.form.projState = state.value
      this.projStateLabel = state.label
    },
    // 清空项目状态
    selectProjStateClear() {
      this.form.projState = ''
      this.projStateLabel = ''
    }
  },
  mounted() {
    this.getProjList()
    this.getOrgList()
  }
}
</script>

<style lang="less" scoped>
  .el-select {
    width: 100%;
  }
</style>
