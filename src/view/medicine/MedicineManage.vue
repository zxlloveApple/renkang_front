<template>
  <div class="common-manage">
    <div class="search-condition-container">
      <el-input class="div-right" style="width: 300px" v-model="form.keyword" size="small" clearable placeholder="根据药品名称模糊搜索"></el-input>
      <el-button class="div-right" type="primary" size="small" @click="loadMedicines">搜索</el-button>
      <el-button v-if="editRole" type="success" size="small" @click="addMedicine">新增药品</el-button>
    </div>
    <div class="manage-content-container">
      <el-table :data="medicines" height="string">
        <el-table-column  label="序号" width="100px">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="medicineName" label="名称"></el-table-column>
        <el-table-column prop="medicineVender" label="厂家"></el-table-column>
        <el-table-column prop="medicineUnit" label="单位" width="120px"></el-table-column>
        <el-table-column prop="medicineSpecification" label="规格" width="120px"></el-table-column>
        <el-table-column prop="medicinePrice" label="价格" width="120px"></el-table-column>
        <el-table-column prop="" label="操作" width="100px" v-if="editRole">
          <template slot-scope="scope">
            <el-button type="text" @click="editMedicine(scope.row)">修改</el-button>
            <el-button type="text" style="color: red" @click="delMedicine(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadMedicines"></common-pagination>
    <create-medicine-dialog :visible="visible"
                            :medicine="medicineInfo"
                            @flushTable="loadMedicines"
                            @closeDialog="closeDialog"></create-medicine-dialog>
  </div>
</template>

<script>
import CreateMedicineDialog from './childModule/CreateMedicineDialog'
export default {
  name: 'MedicineManage',
  components: {
    CreateMedicineDialog
  },
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
      medicineInfo: {},
      medicines: [],
      editRole: false
    }
  },
  mounted () {
    this.loadMedicines()
  },
  methods: {
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      let data = {
        page: this.form.page,
        pageSize: this.form.pageSize,
        medicineName: this.form.keyword
      }
      this.$http.get(url, data,
        (res) => {
          let role = res.headers['user_role']
          this.editRole = role === 'EDIT_ROLE'
          this.form.total = res.data.data.total
          this.medicines = res.data.data.list
        })
    },
    addMedicine () {
      this.medicineInfo = {}
      this.visible = true
    },
    closeDialog () {
      this.medicineInfo = {}
      this.visible = false
    },
    editMedicine (row) {
      this.medicineInfo = row
      this.visible = true
    },
    delMedicine (index, row) {
      this.$confirm('确定删除该药品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delUrl = '/medicine/deleteMedicineInfoById'
        let data = {
          medicineId: row.medicineId
        }
        this.$http.delete(delUrl, data,
          (res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.medicines.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
      }).catch(() => {

      }

      )
    }
  }
}
</script>

<style scoped>

</style>
