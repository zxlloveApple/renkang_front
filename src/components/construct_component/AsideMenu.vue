<template>
  <div class="aside-container">
    <div class="aside-top">
      <div class="logo-container">
        <img class="logo" src="@/assets/img/logo.jpg">
        <div class="company-name">宁波海曙仁康</div>
      </div>
    </div>
    <el-menu
      :default-active="$route.path"
      :unique-opened="true"
      :router="true">
      <div v-for="(menu, index) in menus" :key="index" :index="menu.url">
        <el-menu-item class="custom-menu-item" style="padding-left: 20px !important;" :index="menu.url" v-if="!menu.children">
          <span>{{menu.menuName}}</span>
        </el-menu-item>
        <el-submenu v-else :index="menu.url">
          <template slot="title">
            <span>{{menu.menuName}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(item, key) in menu.children"
                          :key="key"
                          :index="item.url">
              <span>{{item.menuName}}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
      menus: [
        // {
        //   menuName: '系统管理',
        //   url: '/system/userManage',
        //   childMenu: [
        //     {
        //       menuName: '用户管理',
        //       url: '/system/userManage'
        //     },
        //     {
        //       menuName: '用户组',
        //       url: '/system/userGroup'
        //     }
        //   ]
        // }
      ]
    }
  },
  mounted () {
    this.loadMenus()
  },
  methods: {
    loadMenus () {
      let url = '/sys/groupMenu/getMenus'
      this.$http.get(url, null,
        res => {
          this.menus = res.data
        })
    }
  }
}
</script>

<style scoped>

</style>
