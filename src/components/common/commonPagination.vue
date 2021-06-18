<template>
  <div class="pagination-container">
    <div class="zzb-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'commonPagination',
  props: ['pages'],
  methods: {
    handleSizeChange (val) {
      this.pages.pageSize = val
      this.$emit('loadData', this.pages)
    },
    handleCurrentChange (val) {
      this.pages.page = val
      this.$emit('loadData', this.pages)
    }
  }
}
</script>

<style lang="stylus">
  .pagination-container{
    position absolute
    bottom 5px
    width 100%
    .zzb-pagination {
      display: flex;
      width: 100%;

      .el-pagination {
        margin 0 auto
        padding-top 10px;
        box-sizing border-box
     }
    }
  }
</style>
