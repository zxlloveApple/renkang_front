<template>
  <div class="add-customer">
    <div style="margin: 0 auto;background: #ffffff">
      <div class="page-type">
        <i class="el-icon-arrow-left back-icon" @click="$router.back()">返回</i>
        <div class="page-desc">{{isCreate ? '添加客户' : '编辑客户'}}</div>
      </div>
      <el-form :model="customerInfo" label-width="140px" style="padding: 20px" :rules="rules" ref="customerInfo">
        <el-row>
          <el-col :span="24" style="display: flex">
            <el-form-item label="产品线" required prop="productLine">
              <el-input size="small" v-model="customerInfo.productLine" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-form-item label="大区经理" prop="regionalManager">
          <el-input size="small" v-model="customerInfo.regionalManager" clearable ></el-input>
        </el-form-item>
        <el-form-item label="省经理" prop="provincialManager">
          <el-input size="small" v-model="customerInfo.provincialManager" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售负责人" prop="salesDirector">
          <el-input size="small" v-model="customerInfo.salesDirector" clearable></el-input>
        </el-form-item>
        <el-form-item label="意向产品" prop="potentialProduct">
          <el-input size="small" v-model="customerInfo.potentialProduct" clearable></el-input>
        </el-form-item>
        <el-form-item label="包装规格" prop="packingSize">
          <el-input size="small" v-model="customerInfo.packingSize" clearable></el-input>
        </el-form-item>
        <el-form-item label="代理商获取渠道" prop="agentChannel">
          <el-input size="small" v-model="customerInfo.agentChannel" clearable></el-input>
        </el-form-item>
        <el-form-item label="意向经销商" prop="potentialDealer">
          <el-input size="small" v-model="customerInfo.potentialDealer" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input size="small" v-model="customerInfo.telephone" clearable></el-input>
        </el-form-item>
        <el-form-item label="代理区域" prop="agentArea">
          <el-input size="small" v-model="customerInfo.agentArea" clearable></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input size="small" v-model="customerInfo.level" clearable></el-input>
        </el-form-item>
        <el-form-item label="院内/院外">
          <el-select size="small" v-model="customerInfo.isOuter" filterable clearable>
            <el-option label="院内" :value="true"></el-option>
            <el-option label="院外" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对应Link药店" prop="linkDrugstore">
          <el-input size="small" v-model="customerInfo.linkDrugstore" clearable></el-input>
        </el-form-item>
        <el-form-item label="合作形式" prop="linkDrugstore">
          <el-input size="small" v-model="customerInfo.cooperation" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属公司名称/自然人" prop="companyName">
          <el-input size="small" v-model="customerInfo.companyName" clearable></el-input>
        </el-form-item>
        <el-form-item label="在公司任职职位" prop="position">
          <el-input size="small" v-model="customerInfo.position" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属公司性质" prop="companyNature">
          <el-input size="small" v-model="customerInfo.companyNature" clearable placeholder="直营/分销"></el-input>
        </el-form-item>
        <el-form-item label="学术推广能力" prop="companyName">
          <el-input size="small" v-model="customerInfo.promotionAbility" type="textarea" clearable  placeholder="是否有专业学术推广团队及学术推广人员数量"></el-input>
        </el-form-item>
        <el-form-item label="既往操作产品及销售情况" prop="history">
          <el-input size="small" v-model="customerInfo.history" type="textarea" clearable placeholder="既往操作产品及销售情况"></el-input>
        </el-form-item>
        <el-form-item label="预计年度销量/盒">
          <el-input size="small" v-model="customerInfo.annualSales" type="number" clearable placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="预计进院/店时间">
          <el-date-picker
            size="small"
            clearable
            v-model="customerInfo.enterTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终端是否跟标" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isTerminalTag" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="20" style="display: flex">
        <el-form-item label="筛选代理商" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isAgentScreen" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="锁定客户洽谈" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isCustomerLock" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" style="display: flex">
        <el-form-item label="协议条款谈妥" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isAgreementSettled" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="OA签批流程" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isOaSign" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" style="display: flex">
        <el-form-item label="签纸质协议" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isPaperAgreement" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="已打保证金" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isDeposit" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" style="display: flex">
        <el-form-item label="淘汰客户" prop="terminalTag">
          <el-select size="small" v-model="customerInfo.isEliminateCustomer" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
<!--        //销售负责人评估意见-->
        <el-form-item label="优势" prop="advantage">
          <el-input size="small" v-model="customerInfo.advantage" type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label="劣势">
          <el-input size="small" v-model="customerInfo.inferiority" type="textarea" clearable></el-input>
        </el-form-item>

<!--        //是否发货-->
        <el-form-item label="是否发货">
          <el-select size="small" v-model="customerInfo.isDeliverGoods" filterable clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首次提货数量/盒">
          <el-input size="small" v-model="customerInfo.firstPickupCount" type="number" clearable placeholder="请输入数字"></el-input>
        </el-form-item>
        <el-form-item label="提货时间" >
          <el-date-picker
            size="small"
            clearable
            v-model="customerInfo.pickupTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计月均销量/盒">
          <el-input size="small" v-model="customerInfo.potentialMonthlySales" type="number" clearable placeholder="请输入数字"></el-input>
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
        productLine: '',
        cityId: '',
        regionalManager: '',
        provincialManager: '',
        salesDirector: '',
        potentialProduct: '',
        packingSize: '',
        agentChannel: '',
        potentialDealer: '',
        telephone: '',
        agentArea: '',
        level: '',
        isOuter: undefined,
        linkDrugstore: '',
        cooperation: '',
        companyName: '',
        position: '',
        companyNature: '',
        promotionAbility: '',
        history: '',
        annualSales: '',
        enterTime: undefined,
        isTerminalTag: false,
        isAgentScreen: false,
        isCustomerLock: false,
        isAgreementSettled: false,
        isOaSign: false,
        isPaperAgreement: false,
        isDeposit: false,
        isEliminateCustomer: false,
        advantage: '',
        inferiority: '',
        isDeliverGoods: false,
        firstPickupCount: '',
        pickupTime: undefined,
        potentialMonthlySales: undefined,
        remark: '',
        gmtCreate: undefined,
        gmtModify: undefined,
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
        productLine: [
          { required: true, message: '请输入产品线', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
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
      let url = '/rest/customer/potential/detail?customerId=' + customerId
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
          let url = '/rest/customer/potential/modify'
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
