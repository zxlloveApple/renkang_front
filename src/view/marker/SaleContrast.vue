<template>
  <div class="common-manage">
    <div class="search-condition-container" style="height: 140px;box-sizing: border-box">
      <el-form label-position="left" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="业务员">
              <el-select size="small" v-model="form.userId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in users" :key="item.userId" :label="item.username" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始月份">
              <el-date-picker
                size="small"
                v-model="form.startTime"
                type="month"
                placeholder="选择开始月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束月份">
              <el-date-picker
                size="small"
                v-model="form.endTime"
                type="month"
                placeholder="选择结束月">
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
                <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-top: 4px">
            <el-button size="small" type="primary" @click="loadData">搜索</el-button>
            <el-button size="small" type="success" @click="exportData">导出当前结果</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="manage-content-container" style="top: 150px">
      <el-table :data="data"
                lazy
                row-key="uuid"
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                height="string">
        <el-table-column label="业务员" prop="username" width="100px"></el-table-column>
        <el-table-column label="时间范围" prop="timeRange" width="190px"></el-table-column>
        <el-table-column label="药店" prop="drugstoreName" width="180px"></el-table-column>
        <el-table-column label="品种" prop="medicineName" width="180px"></el-table-column>
        <el-table-column label="前一个月库存" prop="forwardMonthStockVolume" width="120px"></el-table-column>
        <el-table-column label="销量" prop="salesVolume"></el-table-column>
        <el-table-column label="库存" prop="stockVolume"></el-table-column>
        <el-table-column label="进货" prop="purchaseAmount"></el-table-column>
        <el-table-column label="差值" prop="dvalue"></el-table-column>
        <el-table-column label="状态" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.dvalue === 0" style="color: #67c23a">吻合</span>
            <span v-if="scope.row.dvalue > 0" style="color: #f56c6c">销量超出进货</span>
            <span v-if="scope.row.dvalue < 0" style="color: #e6a23c">销量少于进货</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display: flex;position: absolute;bottom: 5px;width: 100%">
      <el-pagination
        style="margin: 0 auto"
        layout="total"
        :total="data.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaleContrast',
  data () {
    return {
      form: {
        medicineId: undefined,
        medicineName: undefined,
        startTime: undefined,
        endTime: undefined
      },
      data: [],
      medicines: [],
      departments: [],
      users: []
    }
  },
  mounted () {
    this.loadMedicines()
    this.loadUsers()
    this.loadDepartments()
  },
  methods: {
    load (tree, treeNode, resolve) {
      let url = '/sell/salesVolume/salesVolume/isIdentical/per/drugstore'
      let data = {}
      for (let key in this.form) {
        data[key] = this.form[key]
      }
      data.userId = tree.userId
      this.$http.get(url, data, (res) => {
        // this.$set(tree, 'children', res.data)
        // tree.children = res.data
        res.data.forEach(item => {
          item.uuid = this.getRowKey()
        })
        resolve(res.data)
      })
    },
    loadData () {
      if (!this.form.startTime) {
        this.$message.warning('请选择统计开始时间')
        return
      }
      if (!this.form.endTime) {
        this.$message.warning('请选择统计结束时间')
        return
      }
      if (!this.form.medicineId) {
        this.$message.warning('请选择统计品种')
        return
      }
      if (typeof this.form.startTime === 'object') {
        this.form.startTime = this.form.startTime.getTime()
      }
      if (typeof this.form.endTime === 'object') {
        this.form.endTime = this.form.endTime.getTime()
      }
      let medicine = this.medicines.filter(item => item.medicineId === this.form.medicineId)[0]
      this.form.medicineName = medicine.medicineName
      let url = '/sell/salesVolume/salesVolume/isIdentical'
      this.$http.get(url, this.form, res => {
        if (res.data) {
          this.data = res.data
          this.data.forEach(item => {
            item.hasChildren = true
            item.children = []
            item.uuid = this.getRowKey()
          })
        } else {
          this.data = []
        }
      })
    },
    exportData () {
      let url = '/sell/salesVolume/export/salesVolume/isIdentical'
      if (!this.form.startTime) {
        this.$message.warning('请选择统计开始时间')
        return
      }
      if (!this.form.endTime) {
        this.$message.warning('请选择统计结束时间')
        return
      }
      if (!this.form.medicineId) {
        this.$message.warning('请选择统计品种')
        return
      }
      if (typeof this.form.startTime === 'object') {
        this.form.startTime = this.form.startTime.getTime()
      }
      if (typeof this.form.endTime === 'object') {
        this.form.endTime = this.form.endTime.getTime()
      }
      let medicine = this.medicines.filter(item => item.medicineId === this.form.medicineId)[0]
      this.form.medicineName = medicine.medicineName
      this.$http.postDownload(url, this.form, res => {
        let headers = res.headers
        let blob = new Blob([res.data], {type: headers['content-type']})
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '销量对照.xls'
        link.click()
      })
    },
    loadUsers () {
      let url = '/base/sysUser/getUsers'
      this.$http.get(url, null,
        (res) => {
          this.users = res.data.list
        })
    },
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    getRowKey () {
      let d = new Date().getTime()
      if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now() // use high-precision timer if available
      }
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    }
  }
}
</script>

<style scoped>

</style>
