<template>
  <el-container>
    <!--    侧边-->
    <el-aside width="280px">
      <el-card>
        <span @click="getAllPlaceClick">查看全部场地</span>
      </el-card>
      <el-tree :expand-on-click-node="false" node-key="orgUid" default-expand-all :data="orgListTree" :props="OrgTreeProps" @node-click="OrgTreeNodeClick"></el-tree>
    </el-aside>
    <!--    上半部分-->
    <el-container direction="vertical">
      <el-main>
        <el-table
          :data="placeList"
          row-key="placeUid"
          :default-sort="{ prop: 'placeId' }"
          height="100%"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="placeId" label="编号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="placeName" label="名称" align="center" width="220"></el-table-column>
          <el-table-column prop="placeOrgName" label="所属组织" align="center" width="220"></el-table-column>
          <el-table-column prop="placeType" :formatter="placeTypeFormat" label="类型" align="center" width="150"></el-table-column>
          <el-table-column prop="placeArea" label="面积" align="center" width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;" @click="handleInsertRoot()">
                添加场地
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
          <el-table-column prop="placeDesc" label="场地描述"></el-table-column>
        </el-table>
        <!--    弹出表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="场地名称">
                    <el-input clearable v-model="form.placeName"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="场地编号">
                    <el-input clearable v-model="form.placeId"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="所属组织">
              <el-select v-model="form.placeOrgUid" clearable filterable placeholder="请选择">
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
                  <el-form-item label="场地类型">
                    <el-select v-model="form.placeType" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="type in placeTypeOptions"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="场地面积">
                    <el-input clearable v-model="form.placeArea"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="场地描述">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="form.placeDesc"></el-input>
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
        placeUid: '',
        placeId: '',
        placeName: '',
        placeOrgUid: '',
        placeOrgName: '',
        placeType: '',
        placeArea: '',
        placeDesc: ''
      },
      placeTypeOptions: [{
        value: 0,
        label: '仓库'
      }, {
        value: 1,
        label: '露天场地'
      }, {
        value: 2,
        label: '会议室'
      }],
      orgListTree: [],
      orgList: [],
      placeList: []
    }
  },
  created() {
    this.getOrgListTree()
    this.getOrgList()
    this.getPlaceList()
  },
  methods: {
    // 格式化场地类型列
    placeTypeFormat(row) {
      switch (row.placeType) {
        case 0: return '仓库'
        case 1: return '露天场地'
        case 2: return '会议室'
      }
    },
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
    },
    // 请求全部场地列表
    async getPlaceList() {
      const { data: res } = await this.$http.get('/place/getPlaceList')
      this.placeList = res
    },
    // 根据组织UID请求场地列表
    async getPlaceListByOrgUid() {
      const { data: res } = await this.$http.get('/place/getPlaceListByOrgUid/' + this.currOrg.orgUid)
      this.placeList = res
    },
    // 请求表单中所属组织的备选数据
    async getOrgList() {
      const { data: res } = await this.$http.get('/org/getAll')
      this.orgList = res
    },
    // 查看全部场地按钮
    getAllPlaceClick() {
      this.getPlaceList()
      // 清空当前选中组织
      this.currOrg = {}
    },
    // 选择组织
    OrgTreeNodeClick(org) {
      this.currOrg = org
      // 更新场地表格信息
      this.getPlaceListByOrgUid()
    },
    // 表头添加按钮函数
    handleInsertRoot() {
      // 初始化表单数据
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.placeOrgUid = this.currOrg.orgUid
      this.form.placeOrgName = this.currOrg.orgName
      this.dialogFormVisible = true
    },
    // 编辑按钮函数
    handleEdit(index, row) {
      // 初始化表单数据
      this.form.placeUid = row.placeUid
      this.form.placeId = row.placeId
      this.form.placeName = row.placeName
      this.form.placeOrgUid = row.placeOrgUid
      this.form.placeOrgName = row.placeOrgName
      this.form.placeType = row.placeType
      this.form.placeArea = row.placeArea
      this.form.placeDesc = row.placeDesc
      this.dialogFormVisible = true
    },
    // 删除按钮函数
    handleDelete(index, row) {
      this.$http.delete('/place/deleteByUid/' + row.placeUid).then(() => {
        // 刷新场地列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getPlaceList()
        } else {
          this.getPlaceListByOrgUid()
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
      this.$http.post('/place/saveOrUpdate', this.form).then(() => {
        // 刷新场地列表数据
        if (Object.keys(this.currOrg).length === 0) {
          this.getPlaceList()
        } else {
          this.getPlaceListByOrgUid()
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
