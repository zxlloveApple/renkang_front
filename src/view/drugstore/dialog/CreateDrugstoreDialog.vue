<template>
  <el-dialog :visible="visible"
             @close="close"
             :title="drugstore.drugstoreId ? '修改药店' : '新增药店'"
             :close-on-click-modal="false"
             width="600px">
    <el-form :model="drugstoreInfo" label-width="80px">
      <el-form-item label="药店名称" required>
        <el-input size="small" placeholder="填写药店名称"
                  @change="verifyName"
                  :class="verify.nameIsExist || verify.nameIsEmpty ? 'el-input-error' : ''"
                  v-model="drugstoreInfo.drugstoreName" clearable></el-input>
        <div v-if="verify.nameIsExist" class="error-label">药店名称已存在</div>
        <div v-if="verify.nameIsEmpty" class="error-label">药店名称不能为空</div>
      </el-form-item>
      <el-form-item label="地址">
        <el-input size="small" placeholder="请填写地址"
                  clearable
                  v-model="drugstoreInfo.drugstoreAddress"></el-input>
      </el-form-item>
      <el-form-item label="店长">
        <el-input size="small" placeholder="填写店长姓名"
                  clearable
                  v-model="drugstoreInfo.drugstoreManager"></el-input>
      </el-form-item>
      <el-form-item label="所属连锁">
        <el-select size="small" filterable v-model="drugstoreInfo.parentId">
          <el-option v-for="item in drugstores"
                     :key="item.drugstoreId"
                     :label="item.drugstoreName"
                     :value="item.drugstoreId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联药品">
        <div v-for="(item, index) in drugstoreInfo.medicineIdAndUserIds" :key="index">
          <el-select size="small" filterable v-model="item.medicineId" placeholder="请选择品种">
            <el-option v-for="val in medicines" :key="val.medicineId" :label="val.medicineName" :value="val.medicineId"></el-option>
          </el-select>
          <el-select size="small" filterable v-model="item.userId" placeholder="请选择业务员">
            <el-option v-for="val in users" :key="val.userId" :label="val.username" :value="val.userId"></el-option>
          </el-select>
          <i v-if="editRole" class="el-icon-remove icon-remove" @click="removeRelation(index)"></i>
          <i class="el-icon-circle-plus icon-add" v-if="editRole && index === 0" @click="addRelation"></i>
        </div>
      </el-form-item>
      <el-form-item label="关联医院" v-if="drugstore.drugstoreId">
        <div v-for="(item, index) in drugstoreInfo.relHospitals" :key="index">
          {{item.hospitalName}}
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="submit" :disabled="disabled">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateDrugstoreDialog',
  props: ['visible', 'drugstore', 'medicines', 'editRole'],
  data () {
    return {
      drugstoreInfo: {},
      verify: {
        nameIsExist: false,
        nameIsEmpty: false
      },
      disabled: false,
      medicineId: undefined,
      drugstores: [],
      users: []
    }
  },
  watch: {
    drugstore: function (val) {
      this.medicineId = undefined
      this.disabled = !val.drugstoreId
      if (val.drugstoreId) {
        for (let key in val) {
          this.$set(this.drugstoreInfo, key, val[key])
        }
        if (!val.medicineIdAndUserIds) {
          this.drugstoreInfo.medicineIdAndUserIds = []
          this.drugstoreInfo.medicineIdAndUserIds.push({
            medicineId: '',
            userId: ''
          })
        }
      } else {
        this.drugstoreInfo = {}
        this.$set(this.drugstoreInfo, 'medicineIdAndUserIds', [])
        this.drugstoreInfo.medicineIdAndUserIds.push({
          medicineId: '',
          userId: ''
        })
      }
    }
  },
  mounted () {
    this.loadDrugstores()
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      let url = '/base/sysUser/getUsers'
      this.$http.get(url, null,
        (res) => {
          this.users = res.data.list
        })
    },
    loadDrugstores () { // 加载所有药店
      let url = '/drugstore/queryDrugstoreInfoList'
      this.$http.get(url, null, res => {
        this.drugstores = res.data
      })
    },
    verifyName () {
      if (!this.drugstoreInfo.drugstoreName || this.drugstoreInfo.drugstoreName.trim() === '') {
        this.verify.nameIsEmpty = true
        this.verify.nameIsExist = false
        this.disabled = true
        return
      }
      this.verify.nameIsEmpty = false
      // 如果改变后的名称和开始名称一样不校验直接返回
      if (this.drugstoreInfo.drugstoreName === this.drugstore.drugstoreName) {
        this.disabled = false
        return
      }
      let url = '/drugstore/verify/' + this.drugstoreInfo.drugstoreName
      this.$http.get(url, null,
        (res) => {
          this.verify.nameIsExist = !res.data
          this.disabled = !res.data
        })
    },
    close () {
      this.$emit('closeDialog', false)
    },
    submit () {
      this.disabled = true
      // this.drugstoreInfo.medicineIds = this.relationMedicines.map(item => item.medicineId)
      let url = this.drugstore.drugstoreId ? '/drugstore/updateDrugstoreInfo' : '/drugstore/addDrugstoreInfo'
      this.$http.postJson(url, this.drugstoreInfo,
        (res) => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.disabled = false
            this.$emit('closeDialog', true)
          } else {
            this.$message.error('操作失败')
          }
        }, () => {
          this.disabled = false
          // this.$message.error('服务器错误')
        })
    },
    addRelation () {
      this.drugstoreInfo.medicineIdAndUserIds.push({
        medicineId: '',
        userId: ''
      })
    },
    removeRelation (index) {
      this.drugstoreInfo.medicineIdAndUserIds.splice(index, 1)
      if (this.drugstoreInfo.medicineIdAndUserIds.length === 0) {
        this.drugstoreInfo.medicineIdAndUserIds.push({
          medicineId: '',
          userId: ''
        })
      }
    }
  }
}
</script>

<style scoped>
  .icon-remove{
    font-size: 18px;color: #fa5151;cursor: pointer
  }
  .icon-add{
    font-size: 18px;color: #586b95;cursor: pointer
  }
</style>
