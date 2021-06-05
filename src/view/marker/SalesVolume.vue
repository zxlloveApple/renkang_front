<template>
  <div class="common-manage">
    <div class="search-condition-container" style="height: 140px;box-sizing: border-box">
      <el-form label-position="left" label-width="70px">
        <el-row :gutter="8">
          <el-col :span="6">
            <el-form-item label="业务员">
              <el-select size="small" v-model="form.userId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in users" :key="item.userId" :label="item.username" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始月份">
              <el-date-picker
                      size="small"
                      v-model="form.startMonth"
                      type="month"
                      placeholder="选择开始月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束月份">
              <el-date-picker
                      size="small"
                      v-model="form.endMonth"
                      type="month"
                      placeholder="选择结束月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select size="small" v-model="form.depId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in departments" :key="item.departmentId"
                           :label="item.departmentName" :value="item.departmentId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
<!--          <el-col :span="6">-->
<!--            <el-form-item label="医院">-->
<!--              <el-select size="small" v-model="form.hospitalId" filterable clearable>-->
<!--                <el-option label="全部" :value="null"></el-option>-->
<!--                <el-option v-for="item in hospitals" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="6">
            <el-form-item label="药店">
              <el-select size="small" v-model="form.drugstoreId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in drugstores" :key="item.drugstoreId" :label="item.drugstoreName" :value="item.drugstoreId"></el-option>
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
          <el-col :span="8" style="margin-top: 4px">
            <el-button size="small" type="primary" @click="loadSalesVolumes">搜索</el-button>
            <el-button size="small" type="success" @click="openDialog">添加销量</el-button>
            <el-button size="small" type="success" @click="exportResult">导出当前结果</el-button>
            <el-button size="small" v-if="isAdmin" type="danger" @click="lockAll">一键锁定</el-button>
          </el-col>
          <el-col :span="4">
            <div style="height: 40px;display: flex;align-items: center;font-size: 18px">销量总计：{{totalSum}}</div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="manage-content-container" style="top: 150px">
      <el-table :data="salesVolumes" height="string">
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员" prop="username"></el-table-column>
        <el-table-column label="月份" prop="salesMonth">
          <template slot-scope="scope">
            <span>{{scope.row.salesMonth | dateFormat('yyyy-MM')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="医院" prop="hospitalName" width="200px"></el-table-column>
        <el-table-column label="药店" prop="drugstoreName" width="200px"></el-table-column>
        <el-table-column label="品种" prop="medicineName" width="220px"></el-table-column>
        <el-table-column label="销量" prop="salesVolume" sortable></el-table-column>
        <el-table-column label="库存" prop="stockVolume"></el-table-column>
        <el-table-column label="退货" prop="brokenVolume"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column prop="" label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1 && (scope.row.userId === userId || isAdmin)" type="text" @click="editSalesVolume(scope.row)">修改</el-button>
            <el-button type="text" v-if="isAdmin && scope.row.status === 1" style="color: #e6a23c" @click="lockSalesVolume(scope.row.id, scope.$index)">锁定</el-button>
            <el-button type="text" v-if="isAdmin && scope.row.status === 0" style="color: #67c23a" @click="unlockSalesVolume(scope.row.id, scope.$index)">解锁</el-button>
            <el-button type="text" v-if="isAdmin" style="color: #f56c6c" @click="delSalesVolume(scope.row.id, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadSalesVolumes"></common-pagination>
    <create-sales-volume-dialog :visible="visible"
                                @closeDialog="closeDialog"
                                :sales-volume="salesVolume"></create-sales-volume-dialog>
  </div>
</template>

<script>
import CreateSalesVolumeDialog from './dialog/CreateSalesVolumeDialog'
export default {
  name: 'SalesVolume',
  components: {CreateSalesVolumeDialog},
  data () {
    return {
      form: {
        page: 1,
        pageSize: 10,
        total: 0,
        userId: undefined,
        hospitalId: undefined,
        medicineId: undefined,
        startMonth: undefined,
        endMonth: undefined
      },
      salesVolumes: [],
      salesVolume: {},
      visible: false,
      hospitals: [],
      medicines: [],
      users: [],
      departments: [],
      userId: undefined,
      isAdmin: false,
      drugstores: [],
      totalSum: 0
    }
  },
  mounted () {
    this.userId = JSON.parse(sessionStorage.getItem('user')).userId
    this.isAdmin = JSON.parse(sessionStorage.getItem('user')).role === 'admin'
    this.loadSalesVolumes()
    this.loadHospitals()
    this.loadMedicines()
    this.loadUses()
    this.loadDepartments()
    this.loadDrugstores()
  },
  methods: {
    loadDrugstores () {
      let url = '/drugstore/queryDrugstoreInfoList'
      this.$http.get(url, null,
        (res) => {
          this.drugstores = res.data
        })
    },
    loadSalesVolumes () {
      let param = {}
      for (let key in this.form) {
        param[key] = this.form[key]
      }
      if (this.form.startMonth) {
        param.startMonth = this.form.startMonth.getTime()
      }
      if (this.form.endMonth) {
        param.endMonth = this.form.endMonth.getTime()
      }
      let url = '/sell/salesVolume/selectSalesVolumeByPage'
      this.$http.get(url, param, res => {
        this.form.total = res.data.list.total
        this.salesVolumes = res.data.list.list
        this.totalSum = res.data.totalSum
      })
    },
    editSalesVolume (row) {
      this.salesVolume = row
      this.visible = true
    },
    openDialog () {
      this.salesVolume = {}
      this.visible = true
    },
    closeDialog (val) {
      this.salesVolume = {}
      this.visible = false
      if (val) this.loadSalesVolumes()
    },
    loadHospitals () {
      let url = '/hospital/queryHospitalInfo'
      this.$http.get(url, null, res => {
        this.hospitals = res.data
      })
    },
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadUses () {
      let url = '/base/sysUser/getUsers'
      this.$http.get(url, null,
        (res) => {
          this.users = res.data.list
        })
    },
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    exportResult () {
      if (typeof this.form.startMonth === 'object') {
        this.form.startMonth = this.form.startMonth.getTime()
      }
      if (typeof this.form.endMonth === 'object') {
        this.form.endMonth = this.form.endMonth.getTime()
      }
      let url = '/sell/salesVolume/export'
      this.$http.postDownload(url, this.form, res => {
        let headers = res.headers
        let blob = new Blob([res.data], {type: headers['content-type']})
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '销量列表.xls'
        link.click()
      })
    },
    lockAll () {
      let url = '/sell/salesVolume/lock'
      let data = {
        isAllLock: true
      }
      this.$http.post(url, data, res => {
        if (res.data) this.$message.success(res.message)
        this.loadSalesVolumes()
      }, () => {
        this.$message.error('一键锁定失败')
      })
    },
    lockSalesVolume (id, index) {
      let url = '/sell/salesVolume/lock'
      let data = {
        isAllLock: false,
        salesVolumesId: id
      }
      this.$http.post(url, data, res => {
        if (res.data) {
          this.$message.success(res.message)
          this.salesVolumes[index].status = 0
        } else {
          this.$message.error(res.message)
        }
      }, () => {
        this.$message.error('锁定失败')
      })
    },
    unlockSalesVolume (id, index) {
      let url = '/sell/salesVolume/unlock'
      let data = {
        salesVolumesId: id
      }
      this.$http.post(url, data, res => {
        if (res.data) {
          this.$message.success(res.message)
          this.salesVolumes[index].status = 1
        } else {
          this.$message.error(res.message)
        }
      }, () => {
        this.$message.error('解锁失败')
      })
    },
    delSalesVolume (id, index) {
      this.$confirm('确定删除该条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/sell/salesVolume/delete/' + id
          this.$http.delete(url, null, res => {
            if (res.data) {
              this.$message.success(res.message)
              this.loadSalesVolumes()
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
