<template>
  <div class="add-customer">
    <div style="margin: 0 auto;background: #ffffff">
      <div class="page-type">
        <i class="el-icon-arrow-left back-icon" @click="$router.back()">返回</i>
        <div class="page-desc">{{isCreate ? '添加客户' : '编辑客户'}}</div>
      </div>
      <el-form :model="customerInfo" label-width="140px" style="padding: 20px" :rules="rules" ref="customerInfo">
        <el-form-item label="区域" required  prop="cityId">
          <el-select size="small" placeholder="请选择"
                     required
                     clearable
                     filterable
                     style="width: 140px"
                     @change="loadRegions"
                     v-model="customerInfo.cityId">
            <el-option v-for="item in cities" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主管" prop="charge">
          <el-input size="small" v-model="customerInfo.charge" clearable ></el-input>
        </el-form-item>
        <el-form-item label="代表" prop="representative">
          <el-input size="small" v-model="customerInfo.representative" clearable></el-input>
        </el-form-item>
        <el-form-item label=产品 prop="product">
          <el-input size="small" v-model="customerInfo.product" clearable></el-input>
        </el-form-item>
        <el-form-item label="医院名称" prop="hospitalName">
          <el-input size="small" v-model="customerInfo.hospitalName" clearable></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-input size="small" v-model="customerInfo.department" clearable></el-input>
        </el-form-item>
        <el-form-item label="医生名字" prop="hospitalName">
          <el-input size="small" v-model="customerInfo.doctorName" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="potentialDealer">
          <el-input size="small" v-model="customerInfo.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="院内职务" prop="hospitalFunction">
          <el-input size="small" v-model="customerInfo.hospitalFunction" clearable></el-input>
        </el-form-item>
        <el-form-item label="社会职务" prop="agentArea">
          <el-input size="small" v-model="customerInfo.socialFunction" clearable></el-input>
        </el-form-item>
        <el-form-item label="月均销量" prop="level">
          <el-input size="small" v-model="customerInfo.monthlySales" type="number" clearable placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="是否VIP">
          <el-select size="small" v-model="customerInfo.isVip" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardId">
          <el-input size="small" v-model="customerInfo.cardId" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input size="small" v-model="customerInfo.telephone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="customerInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="爱好" prop="hobby">
          <el-input size="small" v-model="customerInfo.hobby" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input size="small" v-model="customerInfo.remark" type="textarea" clearable></el-input>
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
        provinceCode: '浙江省',
        area: '',
        charge: '',
        representative: '',
        product: '',
        hospitalName: '',
        department: '',
        doctorName: '',
        title: '',
        hospitalFunction: '',
        socialFunction: '',
        monthlySales: '',
        isVip: false,
        cardId: '',
        telephone: '',
        email: '',
        hobby: '',
        remark: '',
        createUserId: ''
      },
      provinceCode: 33,
      provinces: [],
      cities: [],
      regions: [],
      hospitals: [],
      medicines: [],
      disable: false,
      rules: {
        // cityId: [
        //   { required: false, message: '请选择区域', trigger: 'blur' }
        // ],
        intNum: [
          { required: false, message: '请输入数字', trigger: 'blur' }
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
        provinceCode: [
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
    this.loadCities(this.provinceCode)
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
      let url = '/rest/customer/direct/detail?customerId=' + customerId
      this.$http.get(url, null, res => {
        this.customerInfo = res.data
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
        this.provinceCode = val
        this.loadNaticePlace({type: 'city', parentCode: this.provinceCode})
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
        provinceCode: this.customerInfo.provinceCode,
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
          let url = '/rest/customer/direct/modify'
          this.disable = true
          this.customerInfo.provinceCode = 33
          // this.customerInfo.provinceLabel = this.provinces.filter(item => item.areaCode === this.customerInfo.provinceCode)[0].areaName
          // this.customerInfo.cityLabel = this.cities.filter(item => item.areaCode === this.customerInfo.cityAreaCode)[0].areaName
          // this.customerInfo.regionLabel = this.regions.filter(item => item.areaCode === this.customerInfo.regionAreaCode)[0].areaName
          // this.customerInfo.hospitalName = this.hospitals.filter(item => item.hospitalId === this.customerInfo.hospitalId)[0].hospitalName
          // this.customerInfo.medicineName = this.medicines.filter(item => item.medicineId === this.customerInfo.medicineId)[0].medicineName
          this.$http.postJson(url, this.customerInfo, res => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.disable = false
            this.$router.back()
          }, () => {
            this.disable = false
            this.$notify.error({
              title: '失败',
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
