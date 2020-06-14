<template>
  <el-container>
    <!--    侧边-->
    <el-aside width="280px">
      <el-card>
        <span>查看全部知识</span>
      </el-card>
      <el-tree :expand-on-click-node="false" node-key="orgUid" default-expand-all :data="orgListTree" :props="OrgTreeProps"></el-tree>
    </el-aside>
    <!--    上半部分-->
    <el-container direction="vertical">
      <el-main>
        <el-table
          :data="knowlList"
          height="100%"
          row-key="knowlUid"
          :header-cell-style="{'text-align':'center', background:'#ddd'}"
          highlight-current-row
          border>
          <el-table-column prop="knowlId" label="编号" align="center" sortable width="120"></el-table-column>
          <el-table-column prop="knowlName" label="名称" align="center" width="220"></el-table-column>
          <el-table-column prop="knowlOrgName" label="所属组织" align="center" width="220"></el-table-column>
          <el-table-column prop="knowlCapType" label="类型" align="center" width="150"></el-table-column>
          <el-table-column prop="knowlCapLevel" label="规格" align="center" width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot="header">
              <div style="background-color: #ddd; color: #909399;">
                添加知识
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="knowlCapDesc" label="详细描述"></el-table-column>
        </el-table>
        <!--    弹出表单-->
        <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible"></el-dialog>
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
        knowlUid: '',
        knowlId: '',
        knowlName: '',
        knowlOrgUid: '',
        knowlOrgName: '',
        knowlCapType: '',
        knowlCapLevel: '',
        knowlCapDesc: ''
      },
      orgListTree: [],
      orgList: [],
      knowlList: []
    }
  },
  created() {
    this.getOrgListTree()
  },
  methods: {
    // 请求组织树数据
    async getOrgListTree() {
      const { data: res } = await this.$http.get('/org/getOrgTableData')
      this.orgListTree = res
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
