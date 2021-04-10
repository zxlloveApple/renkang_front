<template>
  <el-dialog :visible="visible"
             @close="close"
             top="5vh"
             custom-class="create-sales-volume"
             :title="salesVolume.id ? '修改销量' : '新增销量'"
             :close-on-click-modal="false"
             width="600px">
    <el-form :model="salesVolumeInfo" label-width="80px">
      <el-form-item label="医院" required>
        <el-select size="small" v-model="salesVolumeInfo.hospitalId" @change="loadDrugstoreByHospitalId">
          <el-option v-for="item in hospitals" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药店" required>
        <el-select size="small" v-model="salesVolumeInfo.drugstoreId" @change="loadMedicineByDrugstore">
          <el-option v-for="item in drugstores" :key="item.drugstoreId" :label="item.drugstoreName" :value="item.drugstoreId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品" required>
        <el-select size="small" v-model="salesVolumeInfo.medicineId">
          <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月份" required>
        <el-date-picker
          size="small"
          v-model="salesVolumeInfo.salesMonth"
          type="month"
          :picker-options="pickerSalesMonth"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="销量" required>
        <el-input size="small" type="number" v-model="salesVolumeInfo.salesVolume">
        </el-input>
      </el-form-item>
      <el-form-item label="库存" required>
        <el-input size="small" type="number" v-model="salesVolumeInfo.stockVolume">
        </el-input>
      </el-form-item>
      <el-form-item label="退货">
        <el-input size="small" type="number" v-model="salesVolumeInfo.brokenVolume">
        </el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input size="small" v-model="salesVolumeInfo.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="submit" :disabled="disabled">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateSalesVolumeDialog',
  props: ['salesVolume', 'visible'],
  data () {
    let _this = this
    return {
      salesVolumeInfo: {},
      user: JSON.parse(sessionStorage.getItem('user')),
      hospitals: [],
      drugstores: [],
      medicines: [],
      pickerSalesMonth: {
        disabledDate: (time) => {
          return time.getTime() > _this.curMonth.getTime()
        }
      },
      curMonth: new Date(),
      disabled: false
    }
  },
  watch: {
    salesVolume: function (val) {
      if (val.id) {
        for (let key in val) {
          this.$set(this.salesVolumeInfo, key, val[key])
        }
        this.hospitals = [
          {
            hospitalId: this.salesVolumeInfo.hospitalId,
            hospitalName: this.salesVolumeInfo.hospitalName
          }
        ]
        this.loadDrugstoreByHospitalId()
        this.loadMedicineByDrugstore()
      } else {
        this.salesVolumeInfo = {
          salesVolume: 0,
          stockVolume: 0
        }
      }
    }
  },
  mounted () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    month = month === 0 ? 12 : month
    year = month === 12 ? year - 1 : year
    month = month > 9 ? month : '0' + month
    this.curMonth = new Date(year + '/' + month + '/01 00:00:00') // 添加销量时只能选择上一个月之前的月份
    this.loadOwnHospitals()
  },
  methods: {
    submit () {
      this.disabled = true
      if (!this.salesVolumeInfo.hospitalId ||
        !this.salesVolumeInfo.drugstoreId ||
        !this.salesVolumeInfo.medicineId ||
        !this.salesVolumeInfo.salesMonth) {
        this.$message.warning('必选项未填写，请检查！')
        this.disabled = false
        return
      }
      // try {
      //   if (typeof this.salesVolumeInfo.salesMonth === 'string') {
      //     this.salesVolumeInfo.salesMonth = new Date(this.salesVolumeInfo.salesMonth)
      //   }
      //   let time = this.salesVolumeInfo.salesMonth.getTime() + 8 * 60 * 60 * 1000
      //   this.salesVolumeInfo.salesMonth = new Date(time)
      // } catch (e) {
      //   this.disabled = false
      //   return
      // }
      let url = this.salesVolume.id ? '/sell/salesVolume/updateSalesVolume' : '/sell/salesVolume/addSalesVolume'
      this.$http.postJson(url, this.salesVolumeInfo, res => {
        this.$message.success(res.data)
        this.disabled = false
        this.$emit('closeDialog', true)
      }, err => {
        this.disabled = false
        // let time = this.salesVolumeInfo.salesMonth.getTime() - 8 * 60 * 60 * 1000
        // this.salesVolumeInfo.salesMonth = new Date(time)
        if (err) {
          this.$message.error(err.message)
        } else {
          this.$message.error('服务器错误！')
        }
      })
    },
    close () {
      this.$emit('closeDialog', false)
    },
    loadOwnHospitals () {
      let url = '/hospital/own/hospitals/' + this.user.userId
      this.$http.get(url, null,
        (res) => {
          this.hospitals = res.data
        })
    },
    loadDrugstoreByHospitalId () {
      let url = '/hospital/drugstores/' + this.salesVolumeInfo.hospitalId
      this.$http.get(url, null,
        (res) => {
          this.drugstores = res.data
        })
    },
    loadMedicineByDrugstore () {
      let url = '/relation/medicines/' + this.salesVolumeInfo.drugstoreId
      this.$http.get(url, null, res => {
        this.medicines = res.data
      })
    }
  }
}
</script>

<style lang="stylus">
.create-sales-volume{
  .el-form-item{
    margin-bottom 10px !important
  }
}
</style>
