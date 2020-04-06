<template>
  <div>
    <el-table
      :data="orgTableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="orgUid"
      :header-cell-style="{'text-align':'center', background:'#ddd'}"
      highlight-current-row
      border
      :expand-row-keys="expandRowKeys"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="orgId" label="编号" sortable width="120"></el-table-column>
      <el-table-column prop="orgName" label="名称" width="220"></el-table-column>
      <el-table-column prop="orgPhone" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="orgEmail" label="电子邮箱" width="220"></el-table-column>
      <el-table-column prop="orgAddress" label="地址" width="300"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot="header">
          <div style="background-color: #ddd; color: #909399;" @click="handleInsertRoot()">
            添加组织
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
      <el-table-column prop="orgDescription" label="描述"></el-table-column>
    </el-table>
<!--    弹出表单-->
    <el-dialog width="30%" title="请正确填写表单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="组织名称">
          <el-input clearable v-model="form.orgName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="组织编号">
                <el-input clearable v-model="form.orgId"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="组织领导">
                <el-input clearable v-model="form.orgManager"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="上级组织">
          <el-select v-model="form.orgParUid" clearable filterable placeholder="请选择">
            <el-option
              v-for="org in orgList"
              :key="org.orgUid"
              :label="org.orgName"
              :value="org.orgUid"
              @change="selectClick">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="联系电话">
                <el-input clearable v-model="form.orgPhone"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="电子邮箱">
                <el-input clearable v-model="form.orgEmail"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="组织地址">
          <el-input clearable v-model="form.orgAddress"></el-input>
        </el-form-item>
        <el-form-item label="详情描述">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.orgDescription"></el-input>
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
      orgTableData: [],
      expandRowKeys: [],
      dialogFormVisible: false,
      form: {
        orgUid: '',
        orgId: '',
        orgName: '',
        orgParUid: '',
        orgParName: '',
        orgManager: '',
        orgPhone: '',
        orgEmail: '',
        orgAddress: '',
        orgDescription: ''
      },
      orgList: []
    }
  },
  created() {
    this.getOrgTableData()
    this.getOrgList()
  },
  methods: {
    // 请求组织表格数据
    async getOrgTableData() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgTableData = res
      // 默认展开第一层
      for (let i = 0; i < res.length; i++) {
        this.expandRowKeys.push(res[i].orgUid)
      }
    },
    // 请求表单中上级组织的备选数据
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
      this.dialogFormVisible = true
    },
    // 添加按钮函数
    handleInsert(index, row) {
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.orgParUid = row.orgUid
      this.form.orgParName = row.orgName
      this.dialogFormVisible = true
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.form.orgUid = row.orgUid
      this.form.orgId = row.orgId
      this.form.orgName = row.orgName
      this.form.orgParUid = row.orgParUid
      this.form.orgParName = row.orgParName
      this.form.orgManager = row.orgManager
      this.form.orgPhone = row.orgPhone
      this.form.orgEmail = row.orgEmail
      this.form.orgDescription = row.orgDescription
      this.dialogFormVisible = true
      console.log(row)
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/org/deleteByUid/' + row.orgUid).then(() => {
        // 刷新上级组织列表数据
        this.getOrgList()
        // 刷新表格数据
        this.getOrgTableData()
        this.$message.success('删除成功！')
      })
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$http.post('/org/saveOrUpdate', this.form).then(() => {
        // 刷新上级组织列表数据
        this.getOrgList()
        // 刷新表格数据
        this.getOrgTableData()
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.dialogFormVisible = false
      })
    },
    // 选中上级组织备选列中的一个org
    selectClick(org) {
      this.form.orgParUid = org.orgUid
      this.form.orgParName = org.orgName
    }
  }
}
</script>

<style lang="less" scoped>
  .el-autocomplete {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
</style>
