<template>
  <el-container>
<!--    头部区域-->
    <el-header style="height: 80px;">
      <div>
        <img src="../assets/images/buaalogoheader.png">
        <span>| 欢迎使用项目管理系统</span>
        <img class="headertopbg" src="../assets/images/headertopbg.png">
      </div>
    </el-header>
<!--    页面主体区域-->
    <el-container class="home-container">
<!--      左侧菜单-->
      <el-aside style="width: 308px;">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#D6E8F7"
          router
          unique-opened>
          <el-menu-item index="/projManager">
            <i class="el-icon-menu"></i>
            <span slot="title">项目管理</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>项目流程</span>
            </template>
              <el-menu-item index="/procManager">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">流程管理</span>
              </el-menu-item>
            <el-menu-item index="/procDev">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">流程编制</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/projOpt">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">项目优化</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>流程仿真</span>
            </template>
            <el-menu-item index="/procSimMode1">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">已固定流程</span>
            </el-menu-item>
            <el-menu-item index="/procSimMode2">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">自定义流程</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>资源管理</span>
            </template>
            <el-menu-item index="/humanManager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">人力资源</span>
            </el-menu-item>
            <el-menu-item index="/equipManager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">设备资源</span>
            </el-menu-item>
            <el-menu-item index="/placeManager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">场地资源</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/orgManager">
            <i class="el-icon-office-building"></i>
            <span slot="title">组织管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
<!--      主体-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
  .el-header {
    background: url("../assets/images/headerbg.png") repeat-x;
    background-size: 1px 80px;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    width: 100%;
    align-items: center;
    color: #ddd;
    font-size: 30px;
    > div {
      display: flex;
      align-items: center;
      margin-left: 10px;
      > .headertopbg {
        position: absolute;
        left: 70%;
      }
    }
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #D6E8F7;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    padding: 0;
  }
</style>
