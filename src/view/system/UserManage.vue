<template>
  <div class="common-manage">
    <div class="search-condition-container">
      <el-input class="div-right" style="width: 300px" v-model="form.keyword" size="small" clearable placeholder="根据用户名、真实姓名模糊搜索"></el-input>
      <el-select class="div-right" size="small" v-model="form.status">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="正常" :value="true"></el-option>
        <el-option label="禁用" :value="false"></el-option>
      </el-select>
      <el-button class="div-right" type="primary" size="small" @click="loadUsers">搜索</el-button>
      <el-button type="success" size="small" @click="addUser">添加用户</el-button>
    </div>
    <div class="manage-content-container">
      <el-table :data="tableData" border height="string">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex">{{scope.row.sex ? '男' : '女'}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="部门">
          <template slot-scope="scope">
            <span v-if="scope.row.departmentId">{{departmentInfo(scope.row.departmentId)}}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role">{{roleInfo(scope.row.role)}}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="editUser(scope.row)">修改</el-button>
            <el-button type="text" style="color: #f56c6c" @click="editPsd(scope.row)">重置密码</el-button>
            <el-button type="text" style="color: #f56c6c" @click="delUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <common-pagination :pages="form" @loadData="loadUsers"></common-pagination>
    <edit-psd-dialog :visible="psdVisible" :user="userInfo" @closeReset="closeReset"></edit-psd-dialog>
    <create-user-dialog :visible="visible"
                        :user-info.sync="userInfo"
                        :departments="departments"
                        :groupList="groupList"
                        @closeDialog="closeDialog"></create-user-dialog>
  </div>
</template>

<script>
import EditPsdDialog from '../../view/system/dialog/EditPsdDialog'
import CreateUserDialog from './dialog/CreateUserDialog'
export default {
  name: 'UserAbout',
  components: {
    CreateUserDialog,
    EditPsdDialog
  },
  data () {
    return {
      tableData: [],
      form: {
        keyword: undefined,
        status: true,
        page: 1,
        pageSize: 10,
        total: 0,
        userGroupId: null
      },
      psdVisible: false,
      visible: false,
      userInfo: {},
      groupList: [], // 用户组
      departments: [] // 部门
    }
  },
  mounted () {
    this.loadDepartments()
    this.loadUsers()
    this.department()
    this.loadUserGroup()
  },
  methods: {
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    loadUsers () {
      let url = '/base/sysUser/getUsers'
      this.$http.get(url, this.form,
        (res) => {
          this.tableData = res.data.list
          this.form.total = res.data.total
        })
    },
    closeDialog (val) {
      this.visible = false
      if (val) this.loadUsers()
    },
    closeReset () {
      this.psdVisible = false
    },
    editUser (user) {
      this.userInfo = user
      this.visible = true
    },
    editPsd (user) {
      this.userInfo = user
      this.psdVisible = true
    },
    addUser () {
      this.userInfo = false
      this.visible = true
    },
    department () {
      let url = '/department/list'
      this.$http.get(url, null, res => {
        this.departments = res.data
      })
    },
    loadUserGroup () { // 获取所有用户组
      let url = '/sys/groupMenu/userGroups'
      this.$http.get(url, {},
        (res) => {
          this.groupList = res.data
        })
    },
    roleInfo (role) {
      let roleStr
      switch (role) {
        case 'admin':
          roleStr = '管理员'
          break
        case 'salesman':
          roleStr = '业务员'
          break
        case 'regionManager':
          roleStr = '经理'
          break
        case 'attract':
          roleStr = '招商'
          break
        case 'vender':
          roleStr = '厂家用户'
          break
      }
      return roleStr
    },
    departmentInfo (departmentId) {
      let deps = this.departments.filter(item => item.departmentId === departmentId)
      if (deps.length > 0) {
        return deps[0].departmentName
      } else {
        return ''
      }
    },
    delUser (row) {
      this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/base/sysUser/addUser'
        row.status = false
        this.$http.postJson(url, row, res => {
          this.$message.success(res.message)
          this.loadUsers()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
