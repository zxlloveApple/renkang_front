<template>
  <div class="add-customer">
    <div style="width: 60%;margin: 0 auto;background: #ffffff">
      <div class="page-type">
        <i class="el-icon-arrow-left back-icon" @click="$router.back()">返回</i>
        <div class="page-desc">{{isCreate ? '添加客户' : '编辑客户'}}</div>
      </div>
      <el-form :model="customerInfo" label-width="110px" style="padding: 20px" :rules="rules" ref="customerInfo">
        <el-row>
          <el-col :span="24" style="display: flex">
            <el-form-item label="区域" required prop="provinceAreaCode">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         style="width: 140px"
                         @change="loadCities"
                         v-model="customerInfo.provinceAreaCode">
                <el-option v-for="item in provinces" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="15px" prop="cityAreaCode">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         style="width: 140px"
                         @change="loadRegions"
                         v-model="customerInfo.cityAreaCode">
                <el-option v-for="item in cities" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="15px" prop="regionAreaCode">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         style="width: 140px"
                         @change="loadHospitals"
                         v-model="customerInfo.regionAreaCode">
                <el-option v-for="item in regions" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="医院" required prop="hospitalId">
          <el-select size="small" v-model="customerInfo.hospitalId" filterable clearable>
            <el-option v-for="item in hospitals" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品种" required prop="medicineId">
          <el-select size="small" v-model="customerInfo.medicineId" filterable clearable>
            <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级" required prop="customerLevel">
          <el-select size="small" v-model="customerInfo.customerLevel" filterable clearable>
            <el-option label="首选" :value="1"></el-option>
            <el-option label="备选1" :value="2"></el-option>
            <el-option label="备选2" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" required prop="customerName">
          <el-input size="small" v-model="customerInfo.customerName" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input size="small" v-model="customerInfo.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作同类产品">
          <el-input size="small" v-model="customerInfo.sameMedicine" clearable></el-input>
        </el-form-item>
        <el-form-item label="进院类型" required prop="inType">
          <el-select size="small" v-model="customerInfo.inType" filterable clearable>
            <el-option label="新增" :value="1"></el-option>
            <el-option label="替换" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发方式" required prop="developMode">
          <el-select size="small" v-model="customerInfo.developMode" filterable clearable>
            <el-option label="药事会" :value="1"></el-option>
            <el-option label="特批" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保证金（元）">
          <el-input size="small" v-model="customerInfo.deposit" type="number" clearable></el-input>
        </el-form-item>
        <el-form-item label="预计开发时间" required prop="expectDevelopTime">
          <el-date-picker
            size="small"
            clearable
            v-model="customerInfo.expectDevelopTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计月均销量">
          <el-input size="small" v-model="customerInfo.expectSalesVolume" type="number" clearable></el-input>
        </el-form-item>
        <el-form-item label="需要公司支持">
          <el-input size="small" v-model="customerInfo.companySupport" type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" v-model="customerInfo.note" clearable></el-input>
        </el-form-item>
      </el-form>
      <div style="padding: 20px;display: flex;justify-content: flex-end">
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click="saveCustomer" :disabled="disable">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addCustomer',
  data () {
    return {
      isCreate: true,
      customerInfo: {
        provinceAreaCode: 33
      },
      provinceAreaCode: 33,
      provinces: [],
      cities: [],
      regions: [],
      hospitals: [],
      medicines: [],
      disable: false,
      rules: {
        hospitalId: [
          { required: true, message: '请选择医院', trigger: 'blur' }
        ],
        medicineId: [
          { required: true, message: '请选择品种', trigger: 'blur' }
        ],
        customerLevel: [
          { required: true, message: '请选择客户等级', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' }
        ],
        inType: [
          { required: true, message: '请选择进院类型', trigger: 'blur' }
        ],
        developMode: [
          { required: true, message: '请选择开发方式', trigger: 'blur' }
        ],
        expectDevelopTime: [
          { required: true, message: '请选择预计开发时间', trigger: 'blur' }
        ],
        provinceAreaCode: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        cityAreaCode: [
          { required: true, message: '请选择市', trigger: 'change' }
        ],
        orgRegion: [
          { required: true, message: '请选择区', trigger: 'change' }
        ],
        regionAreaCode: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.isCreate = this.$route.params.customerId === undefined
    if (!this.isCreate) {
      this.loadCustomerInfo(this.$route.params.customerId)
    }
    this.loadNaticePlace({type: 'province', parentCode: undefined})
    this.loadCities(this.provinceAreaCode)
    this.loadMedicines()
  },
  methods: {
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadCustomerInfo (customerId) {
      let url = '/rest/customer/merchants/detail?customerId=' + customerId
      this.$http.get(url, null, res => {
        this.customerInfo = res.data
        if (this.customerInfo.deposit) {
          this.customerInfo.deposit = (this.customerInfo.deposit / 100).toFixed(2)
        }
        this.loadRegions(this.customerInfo.cityAreaCode)
        this.loadHospitals()
      })
    },
    loadNaticePlace (item) {
      let url = '/region/child/places'
      let data = {
        parentCode: item.parentCode
      }
      this.$http.get(url, data, (res) => {
        switch (item.type) {
          case 'province':
            this.provinces = res.data
            break
          case 'city':
            this.cities = res.data
            break
          case 'region':
            this.regions = res.data
            break
        }
      })
    },
    loadCities (val) {
      if (!val) {
        this.cities = []
        this.regions = []
        this.customerInfo.cityAreaCode = undefined
        this.customerInfo.regionAreaCode = undefined
      } else {
        this.provinceAreaCode = val
        this.loadNaticePlace({type: 'city', parentCode: this.provinceAreaCode})
      }
    },
    loadRegions (val) {
      if (!val) {
        this.regions = []
        this.customerInfo.regionAreaCode = undefined
      } else {
        this.loadNaticePlace({type: 'region', parentCode: val})
      }
    },
    loadHospitals () {
      let url = '/hospital/queryHospitalInfo'
      let data = {
        provinceAreaCode: this.customerInfo.provinceAreaCode,
        cityAreaCode: this.customerInfo.cityAreaCode,
        regionAreaCode: this.customerInfo.regionAreaCode
      }
      this.$http.get(url, data, res => {
        this.hospitals = res.data
      })
    },
    saveCustomer () {
      this.$refs['customerInfo'].validate((valid) => {
        if (valid) {
          let url = '/rest/customer/merchants/modify'
          this.disable = true
          this.customerInfo.deposit = Math.round(this.customerInfo.deposit * 100)
          this.customerInfo.provinceLabel = this.provinces.filter(item => item.areaCode === this.customerInfo.provinceAreaCode)[0].areaName
          this.customerInfo.cityLabel = this.cities.filter(item => item.areaCode === this.customerInfo.cityAreaCode)[0].areaName
          this.customerInfo.regionLabel = this.regions.filter(item => item.areaCode === this.customerInfo.regionAreaCode)[0].areaName
          this.customerInfo.hospitalName = this.hospitals.filter(item => item.hospitalId === this.customerInfo.hospitalId)[0].hospitalName
          this.customerInfo.medicineName = this.medicines.filter(item => item.medicineId === this.customerInfo.medicineId)[0].medicineName
          this.$http.postJson(url, this.customerInfo, res => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.disable = false
            this.$router.back()
          }, () => {
            this.disable = false
            this.customerInfo.deposit = this.customerInfo.deposit / 100
            this.$notify.success({
              title: '成功',
              message: '操作失败'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.add-customer{
  display: flex
  .page-type{
    border-bottom: 1px solid #E8E9EA
    padding 10px
    display flex
    height 30px
    .back-icon{
      color: #409EFF;
      margin: auto 10px;
      font-size: 14px
      cursor: pointer;
    }
    .page-desc{
      margin: auto 10px;
      color: #353535;
      font-weight: 600;
      font-size: 18px
    }
  }
}
</style>
