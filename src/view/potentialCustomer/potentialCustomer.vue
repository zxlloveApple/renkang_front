<template>
  <div class="common-manage">
    <div class="search-condition-container" style="height: 140px;box-sizing: border-box">
      <el-form label-position="left" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="市级区域">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         @change="loadRegions"
                         v-model="form.cityId">
                <el-option v-for="item in cities" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售负责人">
              <el-input size="small" v-model="form.salesDirector" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品线">
              <el-input size="small" v-model="form.productLine" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开始时间" >
              <el-date-picker
                size="small"
                clearable
                v-model="form.start">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" >
              <el-date-picker
                size="small"
                clearable
                v-model="form.end">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-top: 4px">
            <el-button size="small" type="primary" @click="loadCustomers">搜索</el-button>
            <el-button size="small" type="success" @click="modifyCustomer">添加客户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="manage-content-container" style="top: 150px">
      <el-table :data="customerList" height="string">
        <el-table-column label="产品线" prop="productLine" width="200px"></el-table-column>
        <el-table-column label="省份" width="80px">
          <template slot-scope="scope">
            <span>浙江省</span>
          </template>
        </el-table-column>
        <el-table-column label="区域" prop="cityId" width="80px">
          <template slot-scope="scope">
            <span>{{getCityName(scope.row.cityId)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="大区经理" prop="regionalManager" width="120px"></el-table-column>
        <el-table-column label="省经理" prop="provincialManager" width="120px"></el-table-column>
        <el-table-column label="销售负责人" prop="salesDirector" width="120px"></el-table-column>
        <el-table-column label="意向产品" prop="potentialProduct" width="150px"></el-table-column>
        <el-table-column label="包装规格" prop="packingSize" width="150px"></el-table-column>
        <el-table-column label="代理商获取渠道" prop="agentChannel" width="120px"></el-table-column>
        <el-table-column label="意向经销商" prop="potentialDealer" width="120px"></el-table-column>
        <el-table-column label="联系电话" prop="telephone" width="140px"></el-table-column>
        <el-table-column label="代理区域" prop="agentArea" width="80px"></el-table-column>
        <el-table-column label="级别" prop="level" width="80px"></el-table-column>
        <el-table-column label="院内/外"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isOuter === true?'院内':'院外'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="对应LINK药店" prop="linkDrugstore" width="120px"></el-table-column>
        <el-table-column label="合作形式" prop="cooperation" width="120px"></el-table-column>
        <el-table-column label="所属公司名称/自然人" prop="companyName" width="150px"></el-table-column>
        <el-table-column label="公司任职职位" prop="position" width="150px"></el-table-column>
        <el-table-column label="所属公司性质" prop="companyNature" width="120px"></el-table-column>
        <el-table-column label="学术推广能力" prop="promotionAbility" width="200px"></el-table-column>
        <el-table-column label="既往操作产品及销售情况" prop="history" width="200px"></el-table-column>
        <el-table-column label="预计年销量" prop="annualSales" width="100px"></el-table-column>
        <el-table-column label="预计进院/店时间" prop="enterTime" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.enterTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="终端跟标"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isOuter === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="筛选代理"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isAgentScreen === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="锁定洽谈"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isCustomerLock === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="条款谈妥"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isAgreementSettled === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="OA签批"  width="80px">
        <template slot-scope="scope">
          <span >{{scope.row.isOaSign === true?'是':'否'}}</span>
        </template>
      </el-table-column>
        <el-table-column label="纸质协议"  width="80px">
        <template slot-scope="scope">
          <span >{{scope.row.isPaperAgreement === true?'是':'否'}}</span>
        </template>
      </el-table-column>   <el-table-column label="打保证金"  width="80px">
        <template slot-scope="scope">
          <span >{{scope.row.isDeposit === true?'是':'否'}}</span>
        </template>
      </el-table-column>
        <el-table-column label="淘汰客户"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isEliminateCustomer === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优势" prop="advantage" width="200px"></el-table-column>
        <el-table-column label="劣势" prop="inferiority" width="200px"></el-table-column>
        <el-table-column label="是否发货"  width="120px">
          <template slot-scope="scope">
            <span >{{scope.row.isDeliverGoods === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次提货数量" prop="firstPickupCount" width="120px"></el-table-column>
        <el-table-column label="提货时间" prop="pickupTime" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.pickupTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计月销量" prop="potentialMonthlySales" width="100px"></el-table-column>
        <el-table-column label="备注" prop="remark" width="200px"></el-table-column>
        <el-table-column label="创建时间" prop="gmtCreate" width="150px">
          <template slot-scope="scope">
            <span>{{scope.row.gmtCreate | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="user.userId === scope.row.createUserId || user.role === 'admin'" type="text" @click="editCustomer(scope.row)">修改</el-button>
            <el-button v-if="user.userId === scope.row.createUserId || user.role === 'admin'" type="text" style="color: #f56c6c" @click="delCustomer(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadCustomers"></common-pagination>
  </div>
</template>

<script>
export default {
  name: 'PotentialCustomer',
  data () {
    return {
      form: {
        page: 1,
        pageSize: 10,
        total: 0,
        cityId: undefined,
        salesDirector: undefined,
        productLine: undefined,
        start: undefined,
        end: undefined
      },
      cities: [],
      regions: [],
      medicines: [],
      hospitals: [],
      departments: [],
      visible: false,
      exploitRecord: {},
      user: JSON.parse(sessionStorage.getItem('user')),
      customerList: [] // 市场开发记录
    }
  },
  mounted () {
    this.loadCustomers()
    this.loadDepartments()
    this.loadMedicines()
    this.loadHospitals()
    this.loadNaticePlace({type: 'city', parentCode: 33})
  },
  methods: {
    getCityName (cityId) {
      let arr = this.cities.filter(item => item.areaCode === cityId)
      if (arr.length > 0) {
        return arr[0].areaName
      }
      return ''
    },
    loadNaticePlace (item) {
      let url = '/region/child/places'
      let data = {
        parentCode: item.parentCode
      }
      this.$http.get(url, data, (res) => {
        switch (item.type) {
          case 'city':
            this.cities = res.data
            break
          case 'region':
            this.regions = res.data
            break
        }
      })
    },
    modifyCustomer () {
      this.$router.push({
        path: '/potential/modify/customer'
      })
    },
    loadCustomers () {
      let param = {}
      for (let key in this.form) {
        param[key] = this.form[key]
      }
      if (this.form.start) {
        param.start = this.form.start.getTime()
      }
      if (this.form.end) {
        param.end = this.form.end.getTime() + 24 * 60 * 60 * 1000
      }
      let url = '/rest/customer/potential/list'
      this.$http.get(url, param, (res) => {
        this.customerList = res.data.list
        this.form.total = res.data.total
      })
    },
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    loadHospitals () {
      let url = '/hospital/queryHospitalInfo'
      let data = {
        cityAreaCode: this.form.cityAreaCode,
        regionAreaCode: this.form.regionAreaCode
      }
      this.$http.get(url, data, res => {
        this.hospitals = res.data
      })
    },
    editCustomer (item) {
      this.$router.push({
        path: '/potential/modify/customer/' + item.customerId
      })
    },
    loadRegions (val) {
      this.loadHospitals()
      if (val) {
        this.loadNaticePlace({type: 'region', parentCode: val})
      } else {
        this.regions = []
      }
    },
    closeDialog (val) {
      this.visible = false
      if (val) this.loadCustomers()
    },
    delCustomer (val) {
      this.$confirm('确定删除该客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/rest/customer/potential/delete?customerId=' + val.customerId
          this.$http.delete(url, null, res => {
            if (res.code === 200) {
              this.$notify.success({
                title: '成功',
                message: res.message
              })
              this.loadCustomers()
            } else {
              this.$notify.error({
                title: '失败',
                message: res.message
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
  .tow-line-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
  }
</style>
