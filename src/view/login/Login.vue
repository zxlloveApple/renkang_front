<template>
  <div id="login" class="index-login-page">
    <div class="formbox">
        <img src="../../assets/login/denglu_left_img.png" style="width: 550px;height: 350px">
        <form>
          <div style="display: flex;height: 60px;justify-content: center">
            <img src="../../assets/login/renkang_logo.jpg" class="login-fire-logo">
            <div style="color: #353535;margin: auto 0;font-size: 20px;font-weight: 600;letter-spacing: 2px">
              <div>仁康医药管理系统</div>
            </div>
          </div>
            <div class="psd-login-container">
                <div class="psd-welcome-content">
                    <div style="margin: auto 0">
                        <div style="float: left">Hi, 欢迎登录</div>
                    </div>
                </div>
                <div style="margin: 0 auto;width: 80%">
                    <el-input size="medium" v-model="username" @keyup.enter.native="login" placeholder="用户名/手机号" style="margin-bottom: 20px">
                        <div style="margin: auto" slot="prefix" >
                            <img src="../../assets/login/login_user.png" style="width: 18px;">
                        </div>
                    </el-input>
                    <el-input type="password" v-model="password" @keyup.enter.native="login" placeholder="请输入登陆密码" style="margin-bottom: 20px">
                        <div style="margin: auto" slot="prefix" >
                            <img src="../../assets/login/login_password.png" style="width: 18px;">
                        </div>
                    </el-input>
                    <div class="btngroup" style="width: 100%">
                        <el-button @click="resetPsd" size="medium" style="width: 45%">重置</el-button>
                        <el-button type="primary" @click="login" size="medium" style="width: 45%">登录</el-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: null,
      password: null,
      data: []
    }
  },
  methods: {
    trim (s) {
      return s.replace(/(^\s*)|(\s*$)/g, '')
    },
    login () {
      let data = {
        username: this.trim(this.username ? this.username : ''),
        password: this.trim(this.password ? this.password : '')
      }
      if (!data.username) {
        this.$message.error('请输入账号！')
        return
      }
      if (!data.password) {
        this.$message.error('请输入密码！')
        return
      }
      let url = '/base/sysUser/login'
      this.$http.post(url, data,
        res => {
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          sessionStorage.setItem('$renkang-access-token', res.data.token)
          this.$router.push({path: '/renkang/workbench'})
        })
    },
    resetPsd () {
      this.username = ''
      this.password = ''
    }
  }
}
</script>

<style lang="stylus">

  #login {
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/login/denglu_bg.jpg") no-repeat;
    background-size: 100% 100%;
    display: flex;
    form {
      border-radius: 0px 14px 14px 0px;
      display: block;
      background: #fbfbfb;
      color: #fff;
      position: relative;
      width: 450px;
      height: 350px;
      .qr-svg-container{
          position: absolute;top:0;right: 0;display: flex;
          .triangle{
              margin: 12px auto;
              width: 0;
              height: 0;
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent transparent #DCEEFF;
          }
          .qr-svg-left{
              color:#418BFF;
              border-radius: 3px;
              margin-top: 5px;
              background: #DCEEFF;
              height: 24px;
              width:100px;
              display: flex;
          }
          .qr-svg{
              height: 50px;
              width: 50px;
              cursor: pointer;
          }
      }
      .psd-login-container{
          height: 200px;padding: 0 40px;box-sizing: border-box;width: 100%;
          .psd-welcome-content{
              color: #303030;display: flex;width: 80%;font-weight: bold;height: 40px;margin-left: 10%;margin-bottom: 20px;
          }
      }
      .qr-login-container{
        padding: 20px 40px 40px;box-sizing: border-box;display: flex;flex-direction: column;
      }
      .login-fire-logo{
        width:40px;
        height: 40px;
        margin auto 10px auto 0
      }
      .common-style{
          width: 50%;
          height: 40px;
          display: flex;
          cursor: pointer;
          border-bottom: 1px solid #252525;
      }
      .el-input__prefix{
          display: flex;
      }

      .btngroup {
        overflow: hidden;
        display: flex;
        justify-content: space-between;

        .forget {
          height: 60px;
          line-height: 60px;
          display: flex;
        }

        .el-button {
          margin: auto 0;
        }
      }
    }
  }

  .formbox {
    text-align: center;
    display: flex;
    margin: auto;

    .content {
      margin: auto;

    }
  }

</style>
