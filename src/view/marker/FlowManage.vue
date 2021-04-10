<template>
  <div class="common-manage">
    <div class="search-condition-container" style="height: 140px;box-sizing: border-box">
      <el-form label-position="left" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商业">
              <el-input v-model="form.business" size="small" style="max-width: 215px" clearable placeholder="根据商业名称模糊搜索"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间">
              <el-date-picker
                size="small"
                v-model="form.startTime"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker
                size="small"
                v-model="form.endTime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select size="small" v-model="form.departmentId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in departments" :key="item.departmentId"
                           :label="item.departmentName" :value="item.departmentId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品种">
              <el-select size="small" v-model="form.medicineId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="药店">
              <el-select size="small" v-model="form.drugstoreId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in drugstores" :key="item.drugstoreId" :label="item.drugstoreName" :value="item.drugstoreId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-top: 4px">
            <el-button size="small" type="primary" @click="loadData">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="manage-content-container" style="top: 150px">
      <el-table :data="data" height="string">
        <el-table-column label="商业" prop="business" width="140px"></el-table-column>
        <el-table-column label="日期" prop="date" width="120px">
          <template  slot-scope="scope">
            <span>{{scope.row.date | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="品种" prop="medicineName" width="220px"></el-table-column>
        <el-table-column label="规格" prop="specifications" width="120px"></el-table-column>
        <el-table-column label="厂家" prop="originPlace" width="220px"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="数量" prop="number" sortable></el-table-column>
        <el-table-column label="客户" prop="drugstoreName" width="220px"></el-table-column>
        <el-table-column prop="" label="操作" width="100px" fixed="right" v-if="user.role === 'admin'">
          <template slot-scope="scope">
            <el-button type="text" style="color: #f56c6c" @click="delRecord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadData"></common-pagination>
  </div>
</template>

<script>
export default {
  name: 'FlowManage',
  data () {
    return {
      form: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      medicines: [],
      data: [],
      departments: [],
      user: JSON.parse(sessionStorage.getItem('user')),
      drugstores: [] // 药店
    }
  },
  mounted () {
    this.loadData()
    this.loadMedicines()
    this.loadDrugstores()
    this.loadDepartments()
  },
  methods: {
    loadData () {
      if (this.form.startTime && typeof this.form.startTime === 'object') {
        this.form.startTime = this.form.startTime.getTime()
      }
      if (this.form.endTime && typeof this.form.endTime === 'object') {
        this.form.endTime = this.form.endTime.getTime()
      }
      let url = '/sell/salesVolume/directSaleClient/list'
      this.$http.get(url, this.form, res => {
        this.data = res.data.list
        this.form.total = res.data.total
      })
    },
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadDrugstores () {
      let url = '/drugstore/queryDrugstoreInfoList'
      this.$http.get(url, null,
        (res) => {
          this.drugstores = res.data
        })
    },
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    delRecord (item) {
      this.$confirm('确定删除该条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/sell/salesVolume/delete/directSaleClient/' + item.id
          this.$http.delete(url, null, res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.loadData()
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
