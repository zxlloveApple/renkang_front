<template>
  <div class="common-manage">
    <div class="search-condition-container">
      <el-input class="div-right" style="width: 300px" v-model="form.keyword" size="small" clearable placeholder="根据医院名称模糊搜索"></el-input>
      <el-button class="div-right" type="primary" size="small" @click="loadHospitals">搜索</el-button>
      <el-button v-if="editRole" type="success" size="small" @click="addHospital">新增医院</el-button>
    </div>
    <div class="manage-content-container">
      <el-table :data="hospitals" height="string">
        <el-table-column  label="序号" width="100px">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalName" label="医院名称"></el-table-column>
        <el-table-column prop="hospitalAddress" label="地址"></el-table-column>
        <el-table-column prop="hospitalRegion" label="所属区域"></el-table-column>
        <el-table-column prop="" label="操作" v-if="editRole" width="180px">
          <template slot-scope="scope">
            <el-button type="text" @click="editHospital(scope.row)">修改</el-button>
            <el-button type="text" @click="editRelation(scope.row)">详情</el-button>
            <el-button type="text" style="color: red" @click="delHospital(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadHospitals"></common-pagination>
    <create-hospital-dialog :visible="visible" :hospital="hospitalInfo" @closeDialog="closeDialog"></create-hospital-dialog>
    <edit-relation-dialog
            :visible="relationVisible"
            :users="users"
            @closeRelation="closeRelation"
            :drugstores="drugstores"
            :relation-info="relationInfo"></edit-relation-dialog>
  </div>
</template>

<script>
import CreateHospitalDialog from './childModule/CreateHospitalDialog'
import EditRelationDialog from './childModule/EditRelationDialog'
export default {
  name: 'HospitalManage',
  components: {
    CreateHospitalDialog,
    EditRelationDialog
  },
  data () {
    return {
      form: {
        keyword: undefined,
        status: null,
        page: 1,
        pageSize: 10,
        total: 0,
        userGroupId: null
      },
      visible: false,
      hospitalInfo: {},
      hospitals: [],
      relationVisible: false,
      relationInfo: {},
      selectedHospital: {}, // 修改关系选中的医院
      users: [], // 所有用户信息
      drugstores: [], // 所有的药店信息
      editRole: false
    }
  },
  mounted () {
    this.loadHospitals()
    this.loadDrugstores()
    this.loadUsers()
  },
  methods: {
    loadHospitals () {
      let url = '/hospital/queryHospitalInfo'
      let data = {
        page: this.form.page,
        pageSize: this.form.pageSize,
        hospitalName: this.form.keyword
      }
      this.$http.get(url, data,
        (res) => {
          let role = res.headers['user_role']
          this.editRole = role === 'EDIT_ROLE'
          this.hospitals = res.data.data.list
          this.form.total = res.data.data.total
        })
    },
    addHospital () {
      this.hospitalInfo = {}
      this.visible = true
    },
    editHospital (val) {
      this.hospitalInfo = val
      this.visible = true
    },
    closeDialog (val) {
      this.visible = false
      if (val) this.loadHospitals()
    },
    editRelation (val) {
      // if (val.hospitalId === this.selectedHospital.hospitalId) { // 判断和上一次要修改的是否一样，一样直接返回
      //   this.relationVisible = true
      //   return
      // }
      // this.selectedHospital = val
      let url = '/relation/userAndDrugstore/' + val.hospitalId
      this.$http.get(url, null, res => {
        this.relationInfo = res.data
        this.relationInfo.hospitalName = val.hospitalName
        this.relationVisible = true
      })
    },
    loadDrugstores () { // 加载所有药店
      let url = '/drugstore/queryDrugstoreInfoList'
      this.$http.get(url, null, res => {
        this.drugstores = res.data
      })
    },
    loadUsers () { // 加载所有用户
      let url = '/base/sysUser/getUsers'
      this.$http.get(url, null, res => {
        this.users = res.data.list
      })
    },
    closeRelation () {
      this.relationVisible = false
    },
    delHospital (index, row) {
      this.$confirm('确定删除该医院吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delUrl = '/hospital/deleteHospitalInfoById'
        let data = {
          hospitalId: row.hospitalId
        }
        this.$http.delete(delUrl, data,
          (res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.hospitals.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
