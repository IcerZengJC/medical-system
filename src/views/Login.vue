<!--
 * @Description: 
 * @Author: Zjc
 * @Date: 2020-07-13 22:31:15
 * @LastEditTime: 2020-07-21 08:07:39
 * @LastEditors: Do not edit
--> 
<template>
  <div class="login-contain">
    <el-row>
      <el-col>
        <i class="el-icon-document-copy"></i>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <h2>医生开单系统</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14"
              :offset="5">
        <el-input placeholder="请输入内容"
                  v-model="account.username"
                  clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14"
              :offset="5">
        <el-input type="password"
                  placeholder="请输入密码"
                  v-model="account.password"
                  show-password
                  clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row class="login-btn">
      <el-col :span="4"
              :offset="6">
        <el-button @click="signUp"
                   type="primary">登录</el-button>
      </el-col>
      <el-col :span="4"
              :offset="4">
        <el-button @click="clear"
                   type="info">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data () {
    return {
      account: {
        username: "admin",
        password: "123456",
      },
    };
  },
  methods: {
    clear () {
      this.account = {
        username: "",
        password: "",
      };
    },
    signUp () {
      this.$axios.post('/pub/login', this.account)
        .then(res => {
          // 存储账户信息
          this.$store.commit('setData', this.account);
          // 存储 token
          sessionStorage.setItem('token', res.headers["access-token"])
          // 路由跳转
          this.$router.push({ path: '/index' })
        })
    },
  },
};
</script>

<style>
.login-contain {
  width: 400px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.login-contain .el-icon-document-copy {
  font-size: 100px;
  margin-top: 40px;
}
.login-contain .el-row {
  margin-top: 20px;
}
.login-contain .login-btn {
  padding-bottom: 20px;
}
</style>
