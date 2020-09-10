<!--
 * @Description: 
 * @Author: Zjc
 * @Date: 2020-07-13 22:31:15
 * @LastEditTime: 2020-07-15 14:08:35
 * @LastEditors: Do not edit
--> 
<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex"
               class="el-menu-demo"
               mode="horizontal"
               background-color="#545c64"
               text-color="#fff"
               @select="handleSelect"
               :router="true"
               active-text-color="#ffd04b">
        <el-menu-item index="/index/prescribe"><i class="el-icon-edit-outline"></i> 开具处方</el-menu-item>
        <el-menu-item index="/index/charge"><i class="el-icon-s-order"></i> 收费表单</el-menu-item>
        <el-menu-item index="/index/refund"><i class="el-icon-coin"></i> 处方退款 </el-menu-item>
        <el-menu-item index="/index/search"><i class="el-icon-search"></i> 收费查询</el-menu-item>
        <el-menu-item index="/index/fetchmedicine"><i class="el-icon-s-shop"></i> 取药窗口</el-menu-item>
      </el-menu>
      <el-button type="danger"
                 title="退出登录"
                 @click="logoutShow"
                 round
                 size="mini"
                 style="float: right;position: absolute;right: 15px;top:15px">退出</el-button>
    </el-header>
    <el-main>
      <router-view></router-view>

    </el-main>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      activeIndex: '/index/prescribe'
    };
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex = key;
    },
    logoutShow () {
      this.$confirm('是否确认退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('update', { username: undefined })
        localStorage.JWT_TOKEN = undefined
        CookieUtil.setCookie('JWT_TOKEN', undefined)
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.el-header,
.el-main {
  padding: 0;
  height: calc(100vh - 61px);
}

.outpatient-fees {
  background-color: #bfa;
}
.outpatient-fees > div {
  float: left;
  margin: 5px 7px;
}
</style>