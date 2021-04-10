<template>
  <div class="common-manage">
    <div class="search-condition-container" style="height: 140px;box-sizing: border-box">
      <el-form label-position="left" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="市级">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         @change="loadRegions"
                         v-model="form.cityAreaCode">
                <el-option v-for="item in cities" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区县级">
              <el-select size="small" placeholder="请选择"
                         clearable
                         filterable
                         @change="loadHospitals"
                         v-model="form.regionAreaCode">
                <el-option v-for="item in regions" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医院">
              <el-select size="small" v-model="form.hospitalId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in hospitals" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="品种">
              <el-select size="small" v-model="form.medicineId" filterable clearable>
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-top: 4px">
            <el-button size="small" type="primary" @click="loadCustomers">搜索</el-button>
            <el-button size="small" type="success" @click="addCustomer">添加客户</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="manage-content-container" style="top: 150px">
      <el-table :data="customerList" height="string">
        <el-table-column label="市域" prop="cityLabel" width="120px"></el-table-column>
        <el-table-column label="区/县" prop="regionLabel" width="120px"></el-table-column>
        <el-table-column label="医院" prop="hospitalName" width="150px"></el-table-column>
        <el-table-column label="品种" prop="medicineName" width="150px"></el-table-column>
        <el-table-column label="客户等级"  width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.customerLevel === 1">首选</span>
            <span v-if="scope.row.customerLevel === 2">备选1</span>
            <span v-if="scope.row.customerLevel === 3">备选2</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" prop="customerName" width="100px"></el-table-column>
        <el-table-column label="联系方式" prop="phone" width="100px"></el-table-column>
        <el-table-column label="同类产品" prop="sameMedicine" width="150px"></el-table-column>
        <el-table-column label="进院类型"  width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.inType === 1">新增</span>
            <span v-if="scope.row.inType === 2">替换</span>
          </template>
        </el-table-column>
        <el-table-column label="开发方式"  width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.developMode === 1">药事会</span>
            <span v-if="scope.row.developMode === 2">特批</span>
          </template>
        </el-table-column>
        <el-table-column label="保证金"  width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.deposit / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计开发时间" prop="expectTime" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.expectDevelopTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计月均销量" prop="expectSalesVolume" width="120px"></el-table-column>
        <el-table-column label="需要公司支持" prop="companySupport" width="200px">
          <template slot-scope="scope">
            <div class="tow-line-ellipsis">{{scope.row.companySupport}}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note" width="200px">
          <template slot-scope="scope">
            <div class="tow-line-ellipsis">{{scope.row.note}}</div>
          </template>
        </el-table-column>
        <el-table-column label="登记人" prop="createUserName" width="100px"></el-table-column>
        <el-table-column label="登记时间" prop="createTime" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="user.userId === scope.row.createUser || user.role === 'admin'" type="text" @click="editCustomer(scope.row)">修改</el-button>
            <el-button v-if="user.userId === scope.row.createUser || user.role === 'admin'" type="text" style="color: #f56c6c" @click="delCustomer(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadCustomers"></common-pagination>
  </div>
</template>

<script>
export default {
  name: 'MerchantsCustomer',
  data () {
    return {
      form: {
        page: 1,
        pageSize: 10,
        total: 0,
        hospitalId: undefined,
        medicineId: undefined,
        cityAreaCode: undefined,
        regionAreaCode: undefined
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
    addCustomer () {
      this.$router.push({
        path: '/merchants/add/customer'
      })
    },
    loadCustomers () {
      let url = '/rest/customer/merchants/list'
      this.$http.get(url, this.form, (res) => {
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
        path: '/merchants/add/customer/' + item.customerId
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
          let url = '/rest/customer/merchants/delete?customerId=' + val.customerId
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
