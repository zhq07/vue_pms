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
      <el-table-column prop="projName" label="名称" width="220"></el-table-column>
      <el-table-column prop="projOrg" label="所属组织" width="220"></el-table-column>
      <el-table-column prop="projPlanStartDate" label="计划开始日期" width="130"></el-table-column>
      <el-table-column prop="projPlanFinishDate" label="计划结束日期" width="130"></el-table-column>
      <el-table-column prop="projPlanDur" label="计划工期/天" width="130"></el-table-column>
      <el-table-column prop="projActStartDate" label="实际开始日期" width="130"></el-table-column>
      <el-table-column prop="projActFinishDate" label="实际结束日期" width="130"></el-table-column>
      <el-table-column prop="projActsDur" label="实际工期/天" width="130"></el-table-column>
      <el-table-column prop="projPctWork" label="完成比例" width="130"></el-table-column>
      <el-table-column prop="projStatus" label="状态" width="130"></el-table-column>
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
    <el-dialog width="30%" title="请正确填写表单" :visible.sync="dialogFormVisible">
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
                <el-input clearable v-model="form.projOrgName"></el-input>
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
                <el-input clearable v-model="form.projParName"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="对应任务">
                <el-input clearable v-model="form.projTaskName"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="计划开始">
                <el-input clearable v-model="form.projPlanStartDate"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="计划结束">
                <el-input clearable v-model="form.projPlanFinishDate"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="最早开始">
                <el-input clearable v-model="form.projEarlyStartDate"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="最晚结束">
                <el-input clearable v-model="form.projLateFinishDate"></el-input>
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
      projTableData: [],
      expandRowKeys: [],
      dialogFormVisible: false,
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
        projPlanDur: '',
        projEarlyStartDate: '',
        projLateFinishDate: '',
        projDescription: ''
      },
      orgList: [],
      projList: [],
      taskList: []
    }
  },
  created() {
    this.getProjTableData()
  },
  methods: {
    // 请求项目表格数据
    async getProjTableData() {
      const { data: res } = await this.$http.get('/proj/getProjTableData')
      this.projTableData = res
      // 默认展开第一层
      for (let i = 0; i < res.length; i++) {
        this.expandRowKeys.push(res[i].projUid)
      }
      console.log(res)
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      // 先清空数组,对象中必须用value关键字属性作为备选数据的名称
      this.projList.splice(0)
      for (let i = 0; i < res.length; i++) {
        this.projList.push(
          { value: res[i].projName, projUid: res[i].projUid }
        )
      }
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据，清空属性值
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.dialogFormVisible = true
      console.log(this.form)
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
      console.log(index, row)
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      this.dialogFormVisible = true
      // 初始化表单数据
      this.form = row
      console.log(index, row)
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/proj/deleteByUid/' + row.projUid).then(() => {
        // 刷新上级组织列表数据
        this.getOrgList()
        // 刷新表格数据
        this.getOrgTableData()
        this.$message.success('删除成功！')
      })
      console.log(index, row)
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$http.post('/proj/saveOrUpdate', this.form).then(() => {
        // 刷新上级组织列表数据
        this.getOrgList()
        // 刷新表格数据
        this.getOrgTableData()
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.dialogFormVisible = false
      })
    },
    // 表单中上级组织带提示的输入方法,搜索和过滤
    querySearch(queryString, cb) {
      const projList = this.projList
      const results = queryString ? projList.filter(this.createFilter(queryString)) : projList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (projList) => {
        return (projList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 初始化组件数据，在mounted()中被调用
    loadAll() {
      // 初始化projTempList，用作选择上级组织时的备选列表,
      this.getOrgList()
    },
    // 选中上级组织备选列中的一个item
    handleSelect(item) {
      console.log(item)
    }
  },
  mounted() {
    this.loadAll()
  }
}
</script>

<style lang="less" scoped>
  .el-autocomplete {
    width: 100%;
  }
</style>
