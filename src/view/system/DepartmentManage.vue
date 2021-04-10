<template>
    <div class="common-manage">
        <div class="search-condition-container">
            <el-input class="div-right" style="width: 300px"
                      v-model="form.keyword" @change="loadDepartments"
                      size="small" clearable placeholder="根据部门名称模糊搜索"></el-input>
            <el-button class="div-right" type="primary" size="small" @click="loadDepartments">搜索</el-button>
<!--            <el-button type="success" size="small" @click="addDepartment">添加用户</el-button>-->
        </div>
        <div class="manage-content-container" style="padding-bottom: 50px">
            <el-button type="primary" size="small" @click="addDepartment" :disabled="disabled">添加部门</el-button>
            <el-table :data="departments" border height="string" style="width: 70%">
                <el-table-column label="序号" width="120px">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="departmentName" label="部门名称">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.showEdit" size="small" v-model="scope.row.departmentName"></el-input>
                    <span v-if="!scope.row.showEdit">{{scope.row.departmentName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="120px">
                    <template slot-scope="scope">
                      <div v-if="scope.row.departmentId">
                        <el-button type="text" v-if="!scope.row.showEdit" @click="scope.row.showEdit = true">修改</el-button>
                        <el-button type="text" style="color: red" v-if="!scope.row.showEdit" @click="delDepartment(scope)">删除</el-button>
                        <el-button type="text" v-if="scope.row.showEdit" @click="editDepartment(scope.row)">保存</el-button>
                        <el-button type="text" v-if="scope.row.showEdit" @click="scope.row.showEdit = false">取消</el-button>
                      </div>
                      <div v-if="!scope.row.departmentId">
                        <el-button type="text" v-if="scope.row.showEdit" @click="editDepartment(scope.row)">保存</el-button>
                        <el-button type="text" v-if="scope.row.showEdit" @click="delDepartment(scope)">删除</el-button>
                      </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DepartmentManage',
  data () {
    return {
      form: {},
      departments: [],
      visible: false,
      department: {},
      disabled: false
    }
  },
  mounted () {
    this.loadDepartments()
  },
  watch: {
    departments: {
      handler (newVal, oldVal) {
        let arr = newVal.filter(item => !item.departmentId)
        this.disabled = arr.length > 0
      },
      deep: true
    }
  },
  methods: {
    addDepartment () {
      this.departments.push({
        showEdit: true
      })
    },
    loadDepartments () {
      let url = '/department/list'
      this.$http.get(url, this.form, res => {
        this.departments = []
        res.data.forEach(item => {
          let department = item
          department.showEdit = false
          this.departments.push(department)
        })
      })
    },
    editDepartment (row) {
      let url = '/department/modify'
      this.$http.postJson(url, row, (res) => {
        this.$message.success(res.message)
        if (!row.departmentId) {
          row.departmentId = res.data.departmentId
        }
        row.showEdit = false
      })
    },
    delDepartment (scope) {
      if (scope.row.departmentId) {
        this.$confirm('确定删除该部门？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/department/delete/' + scope.row.departmentId
          this.$http.delete(url, null, (res) => {
            this.$message.success(res.message)
            this.departments.splice(scope.$index, 1)
          })
        }).catch(() => {})
      } else {
        this.departments.splice(scope.$index, 1)
      }
    }
  }
}
</script>

<style scoped>

</style>
