<template>
  <div class="login_container">
    <img class="header_logo" src="../assets/images/buaalogoheader.png">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/images/buaalogo.jpg">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login_form">
        <!-- 账号-->
        <el-form-item prop="username" label="账号">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'buaa',
        password: '0000'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res !== 'success') {
          return this.$message.error('登录失败！')
        }
        this.$message.success('登录成功！')
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .header_logo{
    position: absolute;
    transform: translate(10%, 50%);
  }
  .login_container{
    background: url("../assets/images/loginbg.jpg");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
  }
  .login_box{
    width: 550px;
    height: 300px;
    background-color: #fff;
    border-radius: 6px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
      height: 150px;
      width: 150px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 15px;
    width: 90%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
