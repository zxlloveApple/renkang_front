<template>
  <div class="handle-flow-email">
    <div style="flex-grow: 1;background: #fff;padding: 30px;
                  display: flex;flex-direction: column;
                  border: 1px #ebebeb solid;box-shadow:0 0 8px 0 #ebebeb">
      <div style="font-size: 18px;font-weight: 600;margin: 0 auto 20px auto">
        上传直销部流向表并解析
      </div>
      <el-upload
        class="custom-upload"
        drag
        accept=".xlsx,.xls"
        :headers="requestHeader"
        action="/renkang-api-new/drugstore/uploadExcel">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" style="font-size: 14px;margin: 0 auto">上传流向表，只能上传xls/xlsx文件</div>
        <!--        <el-button type="primary" size="small">上传要处理的Excel</el-button>-->
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadExcel',
  data () {
    return {
      requestHeader: {
        'renkang-access-token': sessionStorage.getItem('$renkang-access-token')
      }
    }
  }
}
</script>

<style lang="stylus">
  .handle-flow-email{
    display flex
    height 100%
    flex-direction column
    .custom-upload{
      /*margin auto*/
      display flex
      flex-direction column
      width: 360px;
      margin 0 auto
    }
  }
</style>
