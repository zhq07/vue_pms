<!-- 树形下拉框  -->
<template>
  <el-form :v-model="form">
    <el-form-item label="选择菜单分类" >
      <el-input
        placeholder="请选择菜单分类"
        class="selectTree-input"
        auto-complete="off"
        v-model="form.input1"
        @click.native="changeSelectTree()">
      </el-input>
      <el-tree v-show="isShowSelect"
               empty-text="暂无数据"
               :highlight-current = true
               :default-expand-all = false
               :expand-on-click-node="true"
               :data="data"
               :filter-node-method="filterNode"
               @node-click="selectClassfy"
               class="selectTree-input objectTree"
               ref="selectTree">
      </el-tree>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1',
            children: []
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1',
            children: []
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1',
            children: []
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1',
            children: []
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1',
            children: []
          }]
        }]
      }],
      isShowSelect: false,
      form: { input1: '' }
    }
  },
  watch: {
    form: {
      handler(form) {
        if (this.isShowSelect) {
          this.$refs.selectTree.filter(form.input1)
        }
      },
      deep: true // 深度监听，重要
    }
  },
  methods: {
    selectClassfy(data) {
      this.form.input1 = data.label
      this.isShowSelect = false
      console.log(data)
    },
    changeSelectTree() {
      this.isShowSelect = true
    },
    // 选择器的树节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style>
  /*下拉框选择树*/
  .objectTree {
    /*margin-left: 10px;*/
    position: absolute;
    overflow: auto;
    /*z-index: 100;*/
    height: 200px;
    border: 1px solid #ddd;
    line-height: normal;
    /*z-index: 204;*/
  }
  .selectTree-input{
    width: 300px
  }
</style>
