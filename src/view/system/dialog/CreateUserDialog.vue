<template>
  <el-dialog :visible="visible"
             @close="close"
             top="5vh"
             custom-class="create-user-dialog"
             :title="userForm.userId ? '修改用户' : '添加用户'"
             :close-on-click-modal="false"
             width="650px">
    <el-form :model="userForm" label-width="80px">
      <el-form-item label="用户名" required>
        <div style="display: flex;">
          <div>
            <el-input size="small" placeholder="填写用户名"
                      @change="verifyUsername"
                      :class="verify.usernameIsExist || verify.usernameIsEmpty ? 'el-input-error' : ''"
                      v-model="userForm.username" clearable></el-input>
            <div v-if="verify.usernameIsExist" class="error-label">用户名已存在</div>
            <div v-if="verify.usernameIsEmpty" class="error-label">用户名不能为空</div>
          </div>
          <div style="margin-left: 15px;display: flex;">
            <div style="width: 54px">
              <span>姓名</span>
            </div>
            <el-input size="small" placeholder="填写真实姓名"
                      style="width: auto"
                      :class="verify.realNameIsEmpty ? 'el-input-error' : ''"
                      clearable
                      @change="verifyRealName" v-model="userForm.realName"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="密码" required  v-if="!userForm.userId">
        <div style="display: flex;">
          <div>
            <el-input size="small" type="password" placeholder="填写至少6位的密码"
                      @change="verifyPassword"
                      style="width: auto;"
                      clearable
                      :class="verify.psdIsReg || verify.psdIsEmpty ? 'el-input-error' : ''"
                      v-model="userForm.password"></el-input>
            <div v-if="verify.psdIsReg" class="error-label">密码格式不对</div>
            <div v-if="verify.psdIsEmpty" class="error-label">密码不能为空</div>
          </div>
          <div style="margin-left: 15px;display: flex;">
            <div style="width: 54px">
              <span>用户组</span>
            </div>
            <el-select size="small"
                       multiple
                       collapse-tags
                       placeholder="请选择" v-model="userForm.groupIds">
              <el-option v-for="(item, index) in groupList"
                         :label="item.groupName"
                         :key="index"
                         :value="item.groupId"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="部门" required>
        <div style="display: flex;">
          <el-select size="small" placeholder="请选择" v-model="userForm.departmentId">
            <el-option v-for="(item, index) in departments"
                       :label="item.departmentName"
                       :key="index"
                       :value="item.departmentId"></el-option>
          </el-select>
          <div style="margin-left: 15px;display: flex;">
            <div style="width: 54px">
              <span>角色</span>
              <span style="color: #f56c6c">*</span>
            </div>
            <el-select size="small" placeholder="请选择" v-model="userForm.role" multiple>
              <el-option label="管理员" value="admin"></el-option>
              <el-option label="业务员" value="salesman"></el-option>
              <el-option label="经理" value="regionManager"></el-option>
              <el-option label="招商" value="attract"></el-option>
              <el-option label="厂家用户" value="vender"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <div style="display: flex;">
          <el-select size="small" placeholder="请选择" v-model="userForm.sex">
            <el-option label="男" :value="true"></el-option>
            <el-option label="女" :value="false"></el-option>
          </el-select>
          <div style="margin-left: 15px;display: flex">
            <div style="width: 54px">
              <span>状态</span>
            </div>
            <el-select size="small" placeholder="请选择" v-model="userForm.status">
              <el-option label="正常" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input size="small" placeholder="填写备注" v-model="userForm.remark" clearable></el-input>
      </el-form-item>
      <el-form-item label="关联药品">
        <el-select size="small" filterable v-model="medicineId" @change="addMedicine">
          <el-option v-for="item in medicines" :key="item.medicineId" :label="item.medicineName" :value="item.medicineId"></el-option>
        </el-select>
        <span style="font-size: 12px;color:rgb(147 150 156)">(公司内部用户不用填写，默认可以查看所有药品数据)</span>
        <div style="display: flex;margin-top: 8px;flex-wrap: wrap">
          <div v-for="(item, index) in relationMedicines" :key="index" class="selected-users">
            <div style="margin: auto;line-height: 22px">{{item.medicineName}}</div>
            <i class="el-icon-circle-close close-icon" @click="delMedicine(index)"></i>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateUserDialog',
  props: ['visible', 'userInfo', 'departments', 'groupList'],
  data () {
    return {
      userForm: {
        sex: null,
        status: true
      },
      first: true,
      verify: {
        usernameIsEmpty: false,
        usernameIsExist: false,
        psdIsEmpty: false,
        psdIsReg: false,
        realNameIsEmpty: false
      },
      medicineId: undefined,
      medicines: [],
      relationMedicines: []
    }
  },
  watch: {
    userInfo: function (val) {
      this.relationMedicines = []
      this.medicineId = undefined
      if (val.userId) {
        this.first = false
        this.loadRelationMedicines(val.userId)
        for (let key in val) {
          if (key === 'role') {
            let role = val[key].split('|')
            this.$set(this.userForm, key, role)
          } else {
            this.$set(this.userForm, key, val[key])
          }
        }
      } else {
        this.first = true
        this.userForm = {
          sex: null,
          status: true
        }
      }
      this.verify.usernameIsEmpty = false
      this.verify.usernameIsExist = false
      this.verify.psdIsEmpty = false
      this.verify.psdIsReg = false
      this.verify.realNameIsEmpty = false
    }
  },
  mounted () {
    this.loadMedicines()
  },
  methods: {
    close () {
      this.$emit('closeDialog', false)
    },
    verifyUsername () {
      this.first = false
      if (!this.userForm.username || !this.userForm.username.trim()) {
        this.verify.usernameIsEmpty = true
        this.verify.usernameIsExist = false
        return
      }
      this.verify.usernameIsEmpty = false
      this.verifyUsernameIsExist()
    },
    verifyUsernameIsExist () {
      let url = '/base/sysUser/verify/' + this.userForm.username
      this.$http.get(url, null, res => {
        this.verify.usernameIsExist = !res.data
      })
    },
    verifyPassword () {
      this.first = false
      if (!this.userForm.password || !this.userForm.password.trim()) {
        this.verify.psdIsEmpty = true
        this.verify.psdIsReg = false
        return
      }
      this.verify.psdIsEmpty = false
      this.verify.psdIsReg = !/^[a-zA-Z0-9]{6,}[\s]{0}$/.test(this.userForm.password)
    },
    verifyRealName () {
      this.first = false
      if (!this.userForm.realName || !this.userForm.realName.trim()) {
        this.verify.realNameIsEmpty = true
        return
      }
      this.verify.realNameIsEmpty = false
    },
    submit () {
      if (!this.userForm.username || this.userForm.username.trim() === '') {
        this.$message.warning('用户名不能为空')
        return
      }
      if (this.verify.usernameIsExist) {
        this.$message.warning('用户名已存在')
        return
      }
      if (!this.userForm.userId && (!this.userForm.password || this.userForm.password.trim() === '')) {
        this.$message.warning('密码不能为空')
        return
      }
      if (this.verify.psdIsReg) {
        this.$message.warning('密码格式不正确')
        return
      }
      if (!this.userForm.departmentId) {
        this.$message.warning('请选择部门')
        return
      }
      if (this.userForm.role && this.userForm.role.length === 0) {
        this.$message.warning('请选择角色')
        return
      }
      this.userForm.role = this.userForm.role.join('|')
      let medicineIds = this.relationMedicines.map(item => item.medicineId)
      this.userForm.medicineIds = medicineIds.join(',')
      let url = '/base/sysUser/addUser'
      let data = this.userForm
      if (this.userForm.userId) data.password = null
      this.$http.postJson(url, data,
        (res) => {
          this.$message.success(res.message)
          this.$emit('closeDialog', true)
        }, () => {
          let arr = [...this.userForm.role.split(',')]
          this.userForm.role = arr
        })
    },
    loadMedicines () {
      let url = '/medicine/queryMedicineInfoList'
      this.$http.get(url, null,
        (res) => {
          this.medicines = res.data
        })
    },
    addMedicine (val) { // 添加关联药品
      let medicineIds = this.relationMedicines.map(item => item.medicineId)
      let medicine = this.medicines.filter(item => item.medicineId === val)[0]
      if (medicineIds.indexOf(val) === -1) {
        this.relationMedicines.push(medicine)
      }
      this.medicineId = undefined
    },
    delMedicine (val) {
      this.relationMedicines.splice(val, 1)
      this.medicineId = undefined
    },
    loadRelationMedicines (userId) {
      let url = '/base/sysUser/relation/medicines/' + userId
      this.$http.get(url, null, res => {
        this.relationMedicines = this.medicines.filter(item => res.data.indexOf(item.medicineId) > -1)
      })
    }
  }
}
</script>

<style lang="stylus">
.create-user-dialog{
  .el-form-item{
    margin-bottom 15px
  }
}
</style>
