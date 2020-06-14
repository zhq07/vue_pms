<template>
  <el-container direction="vertical">
    <!--    上半部分-->
    <el-main class="up-main">
      <el-table
        :data="orgTableData"
        row-key="orgUid"
        height="100%"
        :header-cell-style="{'text-align':'center', background:'#ddd'}"
        highlight-current-row
        border
        :default-expand-all="true"
        :expand-row-keys="expandRowKeys"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="orgId" label="编号" sortable width="150"></el-table-column>
        <el-table-column prop="orgName" label="名称" width="220"></el-table-column>
        <el-table-column prop="orgPhone" label="联系电话" width="180"></el-table-column>
        <el-table-column prop="orgEmail" label="电子邮箱" width="220"></el-table-column>
        <el-table-column prop="orgAddress" label="地址" width="300"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
      <el-dialog width="40%" title="请正确填写表单" :visible.sync="dialogFormVisible">
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
            <el-select v-model="form.orgParUid" filterable clearable placeholder="请选择">
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
    </el-main>
    <!--    分割-->
    <div style="width: 100%; height: 10px; background-color: #D6E8F7"></div>
    <!--    下半部分-->
    <el-main class="down-main">
      <div id="orgEcharts" class="echarts" style="margin: 0; padding: 0; height: 100%; width: 100%"></div>
    </el-main>
  </el-container>
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
      console.log('res', res)
      // 默认展开第一层
      // for (let i = 0; i < res.length; i++) {
      //   this.expandRowKeys.push(res[i].orgUid)
      // }
      this.orgEcharts()
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
    // echarts图表
    orgEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('orgEcharts'))
      const data = this.orgTableData[0]
      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: [data],

            top: '10%',
            left: '12%',
            bottom: '22%',
            right: '20%',

            symbolSize: 10,

            edgeShape: 'polyline',
            edgeForkPosition: '63%',
            initialTreeDepth: 4,

            lineStyle: {
              width: 2
            },

            label: {
              backgroundColor: '#fff',
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
</style>
