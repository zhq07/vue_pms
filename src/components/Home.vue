<template>
  <el-container>
<!--    头部区域-->
    <el-header style="height: 80px;">
      <div>
        <img src="../assets/images/buaalogoheader.png">
        |&nbsp;欢迎使用流程优化系统
        <img class="headertopbg" src="../assets/images/headertopbg.png">
      </div>
    </el-header>
<!--    页面主体区域-->
    <el-container class="home-container">
<!--      左侧菜单-->
      <el-aside style="width: 308px;">
        <el-menu
          default-active="/projmanager"
          class="el-menu-vertical-demo"
          background-color="#D6E8F7"
          router
          unique-opened>
          <el-menu-item index="/projmanager">
            <i class="el-icon-menu"></i>
            <span slot="title">项目管理</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>流程管理</span>
            </template>
              <el-menu-item index="/procmanager">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">流程管理</span>
              </el-menu-item>
            <el-menu-item index="/procdev">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">流程编制</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/projopt">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">流程优化</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>流程仿真</span>
            </template>
            <el-menu-item index="procsimmode1">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">固定流程</span>
            </el-menu-item>
            <el-menu-item index="procsimmode2">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">不定流程</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>资源管理</span>
            </template>
            <el-menu-item index="/humanmanager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">人力资源</span>
            </el-menu-item>
            <el-menu-item index="/equmanager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">设备资源</span>
            </el-menu-item>
            <el-menu-item index="/placemanager">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">场地资源</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/orgmanager">
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
      .headertopbg {
        margin-left: 1000px;
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
