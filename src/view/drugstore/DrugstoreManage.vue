<template>
  <div class="common-manage">
    <div class="search-condition-container">
      <el-input class="div-right" style="width: 300px" v-model="form.keyword" size="small" clearable placeholder="根据药店名称模糊搜索"></el-input>
      <el-button class="div-right" type="primary" size="small" @click="loadDrugstores">搜索</el-button>
      <el-button v-if="editRole" type="success" size="small" @click="addDrugstore">新增药店</el-button>
    </div>
    <div class="manage-content-container">
      <el-table :data="drugstores" height="string">
        <el-table-column  label="序号" width="100px">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="drugstoreName" label="药店名称"></el-table-column>
        <el-table-column prop="drugstoreAddress" label="地址"></el-table-column>
        <el-table-column prop="drugstoreManager" label="店长" width="120px"></el-table-column>
        <el-table-column prop="" label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="text" @click="editDrugstore(scope.row)">修改</el-button>
            <el-button  v-if="editRole" type="text" style="color: red" @click="delDrugstore(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadDrugstores"></common-pagination>
    <create-drugstore-dialog :visible="visible"
                             :edit-role="editRole"
                             :drugstore="drugstore"
                             :medicines="medicines"
                             @closeDialog="closeDialog"></create-drugstore-dialog>
  </div>
</template>

<script>
import CreateDrugstoreDialog from './dialog/CreateDrugstoreDialog'
export default {
  name: 'DrugstoreManage',
  components: {CreateDrugstoreDialog},
  data () {
    return {
      form: {
        keyword: undefined,
        status: null,
        page: 1,
        pageSize: 10,
        total: 0,
        userGroupId: null
      },
      visible: false,
      drugstore: {},
      drugstores: [],
      medicines: [],
      editRole: false
    }
  },
  mounted () {
    let role = JSON.parse(sessionStorage.getItem('user')).role
    this.editRole = role === 'regionManager' || role === 'admin'
    this.loadDrugstores()
    this.loadMedicines() // 加载所有药品
  },
  methods: {
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadDrugstores () {
      let url = '/drugstore/queryDrugstoreInfoList'
      let data = {
        page: this.form.page,
        pageSize: this.form.pageSize,
        drugstoreName: this.form.keyword
      }
      this.$http.get(url, data,
        (res) => {
          this.drugstores = res.data.list
          this.form.total = res.data.total
        })
    },
    addDrugstore () {
      this.drugstore = {}
      this.visible = true
    },
    editDrugstore (val) {
      let url = '/drugstore/detail/' + val.drugstoreId
      this.$http.get(url, null, res => {
        this.drugstore = res.data
        this.visible = true
      })
    },
    delDrugstore (index, row) {
      this.$confirm('确定删除该药店吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delUrl = '/drugstore/deleteDrugstoreInfoById'
        let data = {
          drugstoreId: row.drugstoreId
        }
        this.$http.delete(delUrl, data,
          (res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.drugstores.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
      }).catch(() => {
      })
    },
    closeDialog (val) {
      this.visible = false
      if (val) this.loadDrugstores()
    },
    editRelation (row) {

    }
  }
}
</script>

<style scoped>

</style>
