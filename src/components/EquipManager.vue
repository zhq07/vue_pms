<template>
  <el-container>
    <!--    侧边-->
    <el-aside width="280px">
      <el-card>
        <span @click="getAllEquipClick">查看全部设备</span>
      </el-card>
      <el-tree :expand-on-click-node="false" node-key="orgUid" default-expand-all :data="orgListTree" :props="OrgTreeProps" @node-click="OrgTreeNodeClick"></el-tree>
    </el-aside>
    <!--    上半部分-->
    <el-container direction="vertical">
      <el-main>
        <el-table
          :data="equipList"
          height="100%"
          row-key="equipUid"
          :default-sort="{ prop: 'equipId' }"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="equipId" label="编号" align="center" sortable width="130"></el-table-column>
          <el-table-column prop="equipName" label="名称" align="center" width="220"></el-table-column>
          <el-table-column prop="equipOrgName" label="所属组织" align="center" width="220"></el-table-column>
          <el-table-column prop="equipCapType" label="类型" align="center" width="150"></el-table-column>
          <el-table-column prop="equipCapLevel" label="规格" align="center" width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;" @click="handleInsertRoot()">
                添加设备
              </div>
            </template>
            <template slot-scope="scope">
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
              <el-button
                type="primary" plain round
                icon="el-icon-view"
                size="mini"
                @click="handleView(scope.$index, scope.row)">
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="equipCapDesc" label="性能描述"></el-table-column>
        </el-table>
        <!--    弹出表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="设备名称">
                    <el-input clearable v-model="form.equipName"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="设备编号">
                    <el-input clearable v-model="form.equipId"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="所属组织">
              <el-select v-model="form.equipOrgUid" filterable clearable placeholder="请选择">
                <el-option
                  v-for="org in orgList"
                  :key="org.orgUid"
                  :label="org.orgName"
                  :value="org.orgUid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="设备类型">
                    <el-input clearable v-model="form.equipCapType"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="设备规格">
                    <el-input clearable v-model="form.equipCapLevel"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="性能描述">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.equipCapDesc"></el-input>
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
      <el-main>
        <el-tabs v-model="activeTagName" type="card">
          <el-tab-pane label="资源占用表" name="resTable">
            <el-table
              :data="arList"
              height="410px"
              row-key="pmsAllocateResource.arUid"
              :default-sort="{ prop: 'pmsAllocateResource.arResStartDateTime' }"
              :header-cell-style="{'text-align':'center', background:'#ddd'}"
              highlight-current-row
              border>
              <el-table-column prop="arResId" sortable label="资源编号" align="center" width="140"></el-table-column>
              <el-table-column prop="arResName" label="资源名称" align="center" width="160"></el-table-column>
              <el-table-column prop="arProjName" label="占用项目" align="center" width="200"></el-table-column>
              <el-table-column prop="arTaskName" label="占用任务" align="center" width="200"></el-table-column>
              <el-table-column prop="pmsAllocateResource.arResStartDateTime" label="开始时间" align="center" width="220">
                <template slot-scope="scope">
                  <span>{{ datetimeFormat(scope.row.pmsAllocateResource.arResStartDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="pmsAllocateResource.arResFinishDateTime" label="结束时间" align="center" width="220">
                <template slot-scope="scope">
                  <span>{{ datetimeFormat(scope.row.pmsAllocateResource.arResFinishDateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot="header">
                  <div style="background-color: #ddd; color: #909399;" @click="arInsert()">
                    预约
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="primary" plain round
                    icon="el-icon-edit"
                    size="mini"
                    @click="arEdit(scope.$index, scope.row)">
                  </el-button>
                  <el-button
                    type="danger" plain round
                    icon="el-icon-delete"
                    size="mini"
                    @click="arDelete(scope.$index, scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="资源占用图" name="resGantt">
            <div id="resGanttContainer" style="height: 400px; width: 100%"></div>
          </el-tab-pane>
        </el-tabs>
        <!--    弹出资源占用表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="arDialogFormVisible">
          <el-form ref="arForm" :model="arForm" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="设备名称">
                    <el-input clearable v-model="arForm.arResName"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="设备编号">
                    <el-input clearable v-model="arForm.arResId"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="占用项目">
                    <el-select v-model="arForm.arProjName" clearable filterable @change="selectArProjClick" @clear="selectArProjClear" placeholder="请选择">
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
                  <el-form-item label="占用任务">
                    <el-select v-model="arForm.arTaskName" clearable filterable @change="selectArTaskClick" @clear="selectArTaskClear" placeholder="请选择">
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
                  <el-form-item label="占用开始">
                    <el-date-picker
                      v-model="arForm.pmsAllocateResource.arResStartDateTime"
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
                  <el-form-item label="占用结束">
                    <el-date-picker
                      v-model="arForm.pmsAllocateResource.arResFinishDateTime"
                      type="datetime"
                      :default-time="'08:00:00'"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" plain @click="onArSubmit">保存</el-button>
              <el-button @click="arDialogFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      OrgTreeProps: {
        children: 'children',
        label: 'orgName'
      },
      dialogFormVisible: false,
      arDialogFormVisible: false,
      activeTagName: 'resTable',
      currOrg: {},
      currEquip: {},
      form: {
        equipUid: '',
        equipId: '',
        equipName: '',
        equipOrgUid: '',
        equipOrgName: '',
        equipCapType: '',
        equipCapLevel: '',
        equipCapDesc: ''
      },
      arForm: {
        pmsAllocateResource: {
          arUid: '',
          arResUid: '',
          arProjUid: '',
          arProcUid: '',
          arTaskUid: '',
          arResPlanUid: '',
          arResReqUid: '',
          arResStartDateTime: '',
          arResFinishDateTime: '',
          arResAmount: '',
          arResWork: '',
          arResWorkModel: '',
          arIsEffective: ''
        },
        arResName: '',
        arResId: '',
        arProjName: '',
        arTaskName: ''
      },
      orgListTree: [],
      orgList: [],
      equipList: [],
      arList: [],
      chartArList: [], // 资源管理甘特图数据
      projList: [],
      taskList: []
    }
  },
  created() {
    this.getOrgListTree()
    this.getOrgList()
    this.getEquipList()
    this.getProjList()
  },
  methods: {
    // 表格内时间格式化
    datetimeFormat(datetime) {
      if (datetime === undefined || datetime === null) {
        return ''
      }
      const moment = require('moment')
      return moment(datetime).format('YYYY-MM-DD HH:mm')
    },
    // 判断str是否为空或空字符串
    strIsEmpty(str) {
      if (str === undefined || str === null || str === '') {
        return true
      }
    },
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
    },
    // 请求全部设备列表
    async getEquipList() {
      const { data: res } = await this.$http.get('/equip/getEquipList')
      // 按id排序
      res.sort((a, b) => {
        return a.equipId.localeCompare(b.equipId)
      })
      this.equipList = res
      if (this.equipList.length > 0) {
        this.currEquip = this.equipList[0]
        this.getArList()
        this.getChartArList().then(() => {
          this.resGantt()
        })
      }
    },
    // 根据组织UID请求设备列表
    async getEquipListByOrgUid() {
      const { data: res } = await this.$http.get('/equip/getEquipListByOrgUid/' + this.currOrg.orgUid)
      // 按id排序
      res.sort((a, b) => {
        return a.equipId.localeCompare(b.equipId)
      })
      this.equipList = res
      if (this.equipList.length > 0) {
        this.currEquip = this.equipList[0]
        this.getArList()
        this.getChartArList().then(() => {
          this.resGantt()
        })
      }
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      this.orgList = res
    },
    // 请求资源占用情况列表
    async getArList() {
      const { data: res } = await this.$http.get('/ar/getAllocateResourceListByResUid/' + this.currEquip.equipUid)
      for (let i = 0, len = res.length; i < len; i++) {
        res[i].arResName = this.currEquip.equipName
        res[i].arResId = this.currEquip.equipId
      }
      this.arList = res
    },
    // 请求资源占用甘特图数据
    async getChartArList() {
      const resUids = []
      for (let i = 0, len = this.equipList.length; i < len; i++) {
        resUids.push(this.equipList[i].equipUid)
      }
      const resUidsResType = {
        resUids: resUids,
        resType: 1
      }
      const { data: res } = await this.$http.post('/ar/getChartAllocateResourceListByResUids', resUidsResType)
      this.chartArList = res
    },
    // 请求项目列表数据
    async getProjList() {
      const { data: res } = await this.$http.get('/proj/getPublished')
      this.projList = res
    },
    // 请求项目包含的已发布任务列表数据
    async getTaskList() {
      const { data: res } = await this.$http.get('/task/getPublishedByProjUid/' + this.arForm.pmsAllocateResource.arProjUid)
      this.taskList = res
    },
    // 查看全部设备按钮
    getAllEquipClick() {
      this.getEquipList()
      // 清空当前选中组织
      this.currOrg = {}
    },
    // 选择组织
    OrgTreeNodeClick(org) {
      this.currOrg = org
      // 更新设备表格信息
      this.getEquipListByOrgUid()
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.equipOrgUid = this.currOrg.orgUid
      this.form.equipOrgName = this.currOrg.orgName
      this.dialogFormVisible = true
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.form.equipUid = row.equipUid
      this.form.equipId = row.equipId
      this.form.equipName = row.equipName
      this.form.equipOrgUid = row.equipOrgUid
      this.form.equipOrgName = row.equipOrgName
      this.form.equipCapType = row.equipCapType
      this.form.equipCapLevel = row.equipCapLevel
      this.form.equipCapDesc = row.equipCapDesc
      this.dialogFormVisible = true
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/equip/deleteByUid/' + row.equipUid).then(() => {
        // 刷新设备列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getEquipList()
        } else {
          this.getEquipListByOrgUid()
        }
        this.$message.success('删除成功！')
      })
    },
    // 详情按钮函数
    handleView(index, row) {
      this.currEquip = row
      this.getArList()
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$http.post('/equip/saveOrUpdate', this.form).then(() => {
        // 刷新设备列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getEquipList()
        } else {
          this.getEquipListByOrgUid()
        }
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.dialogFormVisible = false
      })
    },

    // 资源占用表单
    // 添加/"预约"按钮函数
    arInsert() {
      // 初始化表单数据，清空部分属性值
      this.arForm.arProjName = ''
      this.arForm.arTaskName = ''
      this.arForm.pmsAllocateResource.arResStartDateTime = ''
      this.arForm.pmsAllocateResource.arResFinishDateTime = ''
      // 清空对应任务列表
      this.taskList = []
      // 默认资源名称及编号
      this.arForm.arResName = this.currEquip.equipName
      this.arForm.arResId = this.currEquip.equipId
      this.arForm.pmsAllocateResource.arResUid = this.currEquip.equipUid
      this.arForm.pmsAllocateResource.arIsEffective = 1 // 默认预约直接生效
      this.arDialogFormVisible = true
    },
    // 编辑按钮函数
    arEdit(index, row) {
      // 初始化表单数据
      this.taskList = []
      this.arForm.arResName = row.arResName
      this.arForm.arResId = row.arResId
      this.arForm.arProjName = row.arProjName
      this.arForm.arTaskName = row.arTaskName
      this.arForm.pmsAllocateResource.arUid = row.pmsAllocateResource.arUid
      this.arForm.pmsAllocateResource.arResUid = row.pmsAllocateResource.arResUid
      this.arForm.pmsAllocateResource.arProjUid = row.pmsAllocateResource.arProjUid
      this.arForm.pmsAllocateResource.arProcUid = row.pmsAllocateResource.arProcUid
      this.arForm.pmsAllocateResource.arTaskUid = row.pmsAllocateResource.arTaskUid
      this.arForm.pmsAllocateResource.arResPlanUid = row.pmsAllocateResource.arResPlanUid
      this.arForm.pmsAllocateResource.arResReqUid = row.pmsAllocateResource.arResReqUid
      this.arForm.pmsAllocateResource.arResStartDateTime = row.pmsAllocateResource.arResStartDateTime
      this.arForm.pmsAllocateResource.arResFinishDateTime = row.pmsAllocateResource.arResFinishDateTime
      this.arForm.pmsAllocateResource.arResAmount = row.pmsAllocateResource.arResAmount
      this.arForm.pmsAllocateResource.arResWork = row.pmsAllocateResource.arResWork
      this.arForm.pmsAllocateResource.arResWorkModel = row.pmsAllocateResource.arResWorkModel
      this.arForm.pmsAllocateResource.arIsEffective = row.pmsAllocateResource.arIsEffective

      if (!this.strIsEmpty(this.arForm.pmsAllocateResource.arProjUid)) {
        this.getTaskList()
      }
      this.arDialogFormVisible = true
    },
    // 删除按钮函数
    arDelete(index, row) {
      this.$http.delete('/ar/deleteByUid/' + row.pmsAllocateResource.arUid).then(() => {
        // 刷新资源占用表格数据
        this.getArList()
        this.$message.success('删除成功！')
      })
    },
    // 表单提交按钮函数
    onArSubmit() {
      const pmsAllocateResource = this.arForm.pmsAllocateResource
      this.$http.post('/ar/saveOrUpdate', pmsAllocateResource).then(() => {
        // 刷新资源占用表格数据
        this.getArList()
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.arDialogFormVisible = false
      })
    },
    // 选中占用项目备选列中的一个proj
    selectArProjClick(proj) {
      this.arForm.arProjName = proj.projName
      this.arForm.pmsAllocateResource.arProjUid = proj.projUid
      // 清空占用任务
      this.selectArTaskClear()
      // 更新任务列表
      this.getTaskList()
    },
    // 清空占用项目
    selectArProjClear() {
      this.arForm.arProjName = ''
      // 清空占用任务
      this.selectArTaskClear()
    },
    // 选中占用任务备选列中的一个task
    selectArTaskClick(task) {
      this.arForm.arTaskName = task.taskName
      this.arForm.pmsAllocateResource.arTaskUid = task.taskUid
      this.arForm.pmsAllocateResource.arProcUid = task.taskProcUid
    },
    // 清空占用任务
    selectArTaskClear() {
      this.arForm.projTaskName = ''
    },
    // 资源占用甘特图
    resGantt() {
      const map = this.$highcharts.map
      const timeDiff = 1000 * 3600 * 8
      // Parse car data into series.
      const series = this.chartArList.map(function (chartAr, i) {
        const data = chartAr.deals.map(function (deal) {
          return {
            id: 'deal-' + i,
            projName: deal.projName,
            taskName: deal.taskName,
            start: new Date(deal.startDateTime).getTime() + timeDiff,
            end: new Date(deal.finishDateTime).getTime() + timeDiff,
            y: i
          }
        })
        return {
          name: chartAr.resName,
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
        xAxis: {
          // type: 'datetime',
          // tickInterval: 7 * 24 * 3600 * 1000,
          // dateTimeLabelFormats: {
          //   day: '%m/%d',
          //   month: '%y年%m月',
          //   week: '%m/%d',
          //   year: '%Y年',
          //   millisecond: '%b/%e'
          // }
        },
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
    }
  }
}
</script>

<style lang="less" scoped>
  .el-select {
    width: 100%;
  }
  .el-aside {
    background: #ded;
    .el-card {
      height: 58px;
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
  .el-main {
    padding: 0;
    height: 50%;
  }
</style>
