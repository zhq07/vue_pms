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
          style="width: 100%; margin-bottom: 20px;"
          row-key="equipUid"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="equipId" label="编号" align="center" sortable width="120"></el-table-column>
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
        equipUid: '',
        equipId: '',
        equipName: '',
        equipOrgUid: '',
        equipOrgName: '',
        equipCapType: '',
        equipCapLevel: '',
        equipCapDesc: ''
      },
      orgListTree: [],
      orgList: [],
      equipList: []
    }
  },
  created() {
    this.getOrgListTree()
    this.getOrgList()
    this.getEquipList()
  },
  methods: {
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
    },
    // 请求全部设备列表
    async getEquipList() {
      const { data: res } = await this.$http.get('/equip/getEquipList')
      this.equipList = res
    },
    // 根据组织UID请求设备列表
    async getEquipListByOrgUid() {
      const { data: res } = await this.$http.get('/equip/getEquipListByOrgUid/' + this.currOrg.orgUid)
      this.equipList = res
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      this.orgList = res
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
      console.log(index, row)
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
