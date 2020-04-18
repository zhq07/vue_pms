<template>
  <el-container>
<!--    侧边-->
    <el-aside width="280px">
      <el-card>
        <span @click="getAllHumClick">查看全体员工</span>
      </el-card>
      <el-tree :expand-on-click-node="false" node-key="orgUid" default-expand-all :data="orgListTree" :props="OrgTreeProps" @node-click="OrgTreeNodeClick"></el-tree>
    </el-aside>
<!--    上半部分-->
    <el-container direction="vertical">
      <el-main>
        <el-table
          :data="humList"
          height="100%"
          style="width: 100%; margin-bottom: 20px;"
          row-key="humUid"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="humId" label="编号" align="center" sortable width="110"></el-table-column>
          <el-table-column prop="humName" label="姓名" align="center" width="110"></el-table-column>
          <el-table-column prop="humOrgName" label="所属组织" align="center" width="220"></el-table-column>
          <el-table-column prop="humPosition" label="职位" align="center" width="110"></el-table-column>
          <el-table-column prop="humAbilityType" label="能力" align="center" width="110"></el-table-column>
          <el-table-column prop="humAbilityLevel" label="职称" align="center" width="110"></el-table-column>
          <el-table-column prop="humPhone" label="联系电话" align="center" width="110"></el-table-column>
          <el-table-column prop="humEmail" label="电子邮箱" align="center" width="110"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;" @click="handleInsertRoot()">
                添加人员
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
          <el-table-column prop="humAbilityDesc" label="能力描述"></el-table-column>
        </el-table>
        <!--    弹出表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="人员姓名">
                    <el-input clearable v-model="form.humName"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="员工编号">
                    <el-input clearable v-model="form.humId"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="所属组织">
                    <el-select v-model="form.humOrgUid" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="org in orgList"
                        :key="org.orgUid"
                        :label="org.orgName"
                        :value="org.orgUid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="所在职位">
                    <el-input clearable v-model="form.humPosition"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="联系电话">
                    <el-input clearable v-model="form.humPhone"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="电子邮箱">
                    <el-input clearable v-model="form.humEmail"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="能力类型">
                    <el-input clearable v-model="form.humAbilityType"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="职称评级">
                    <el-input clearable v-model="form.humAbilityLevel"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="能力描述">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.humAbilityDesc"></el-input>
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
      <el-main>资源使用情况</el-main>
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
      currOrg: {},
      form: {
        humUid: '',
        humId: '',
        humName: '',
        humOrgUid: '',
        humOrgName: '',
        humPosition: '',
        humPhone: '',
        humEmail: '',
        humAbilityType: '',
        humAbilityLevel: '',
        humAbilityDesc: ''
      },
      orgListTree: [],
      orgList: [],
      humList: []
    }
  },
  created() {
    this.getOrgListTree()
    this.getOrgList()
    this.getHumList()
  },
  methods: {
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
    },
    // 请求全体人员列表
    async getHumList() {
      const { data: res } = await this.$http.get('/hum/getHumList')
      this.humList = res
    },
    // 根据组织UID请求人员列表
    async getHumListByOrgUid() {
      const { data: res } = await this.$http.get('/hum/getHumListByOrgUid/' + this.currOrg.orgUid)
      this.humList = res
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      this.orgList = res
    },
    // 查看全体员工按钮
    getAllHumClick() {
      this.getHumList()
      // 清空当前选中组织
      this.currOrg = {}
    },
    // 选择组织
    OrgTreeNodeClick(org) {
      this.currOrg = org
      // 更新人员表格信息
      this.getHumListByOrgUid()
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.humOrgUid = this.currOrg.orgUid
      this.form.humOrgName = this.currOrg.orgName
      this.dialogFormVisible = true
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.form.humUid = row.humUid
      this.form.humId = row.humId
      this.form.humName = row.humName
      this.form.humOrgUid = row.humOrgUid
      this.form.humOrgName = row.humOrgName
      this.form.humPosition = row.humPosition
      this.form.humPhone = row.humPhone
      this.form.humEmail = row.humEmail
      this.form.humAbilityType = row.humAbilityType
      this.form.humAbilityLevel = row.humAbilityLevel
      this.form.humAbilityDesc = row.humAbilityDesc
      this.dialogFormVisible = true
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/hum/deleteByUid/' + row.humUid).then(() => {
        // 刷新人员列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getHumList()
        } else {
          this.getHumListByOrgUid()
        }
        this.$message.success('删除成功！')
      })
    },
    // 详情按钮函数
    handleView(index, row) {
      console.log(index, row)
    },
    // 表单提交按钮函数
    onSubmit() {
      this.$http.post('/hum/saveOrUpdate', this.form).then(() => {
        // 刷新人员列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getHumList()
        } else {
          this.getHumListByOrgUid()
        }
        this.$message.success('保存成功！')
        // 隐藏对话框
        this.dialogFormVisible = false
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
