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
            <el-form-item label="主管">
              <el-input size="small" v-model="form.charge" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品">
              <el-input size="small" v-model="form.product" clearable></el-input>
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
        <el-table-column label="区域" prop="area" width="80px">
          <template slot-scope="scope">
            <span>{{getCityName(scope.row.cityId)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="主管" prop="charge" width="120px"></el-table-column>
        <el-table-column label="代表" prop="representative" width="120px"></el-table-column>
        <el-table-column label="产品" prop="product" width="120px"></el-table-column>
        <el-table-column label="医院名称" prop="hospitalName" width="150px"></el-table-column>
        <el-table-column label="科室" prop="department" width="150px"></el-table-column>
        <el-table-column label="医生姓名" prop="doctorName" width="120px"></el-table-column>
        <el-table-column label="职称" prop="title" width="120px"></el-table-column>
        <el-table-column label="院内职务" prop="hospitalFunction" width="140px"></el-table-column>
        <el-table-column label="社会职务" prop="socialFunction" width="80px"></el-table-column>
        <el-table-column label="月均销量" prop="monthlySales" width="80px"></el-table-column>
        <el-table-column label="是否VIP"  width="80px">
          <template slot-scope="scope">
            <span >{{scope.row.isVip === true?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号码" prop="cardId" width="120px"></el-table-column>
        <el-table-column label="电话" prop="telephone" width="120px"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="150px"></el-table-column>
        <el-table-column label="爱好" prop="hobby" width="150px"></el-table-column>
        <el-table-column label="备注" prop="remark" width="120px"></el-table-column>

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
  name: 'DirectCustomer',
  data () {
    return {
      form: {
        page: 1,
        pageSize: 10,
        total: 0,
        cityId: undefined,
        charge: undefined,
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
        path: '/direct/modify/customer'
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
      let url = '/rest/customer/direct/list'
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
        path: '/direct/modify/customer/' + item.customerId
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
          let url = '/rest/customer/direct/delete?customerId=' + val.customerId
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
