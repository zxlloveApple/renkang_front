<template>
  <div class="renkang-manage-index">
    <el-container>
      <el-aside>
        <aside-menu></aside-menu>
      </el-aside>
      <el-container>
        <el-header>
          <header-nav></header-nav>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsideMenu from '../components/construct_component/AsideMenu'
import HeaderNav from '../components/construct_component/HeaderNav'
export default {
  name: 'Index',
  components: {
    AsideMenu,
    HeaderNav
  }
}
</script>

<style lang="stylus">
</style>
