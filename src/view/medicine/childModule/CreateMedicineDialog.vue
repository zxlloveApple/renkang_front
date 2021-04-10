<template>
  <el-dialog :visible="visible"
             @close="close"
             :title="medicine.medicineId ? '修改药品' : '新增药品'"
             :close-on-click-modal="false"
             width="600px">
    <el-form :model="medicineInfo" label-width="80px">
      <el-form-item label="药品名" required>
        <el-input size="small" placeholder="填写药品名称"
                  @change="verifyName"
                  :class="verify.nameIsExist || verify.nameIsEmpty ? 'el-input-error' : ''"
                  v-model="medicineInfo.medicineName" clearable></el-input>
        <div v-if="verify.nameIsExist" class="error-label">药品名已存在</div>
        <div v-if="verify.nameIsEmpty" class="error-label">药品名不能为空</div>
      </el-form-item>
      <el-form-item label="是否直营" required>
        <el-select v-model="medicineInfo.isDirect" size="small">
          <el-option label="直营" :value="true"></el-option>
          <el-option label="分销" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂家">
        <el-input size="small" placeholder="请填写厂家"
                  clearable
                  v-model="medicineInfo.medicineVender"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-input size="small" placeholder="请填写单位"
                  clearable
                  v-model="medicineInfo.medicineUnit"></el-input>
      </el-form-item>
      <el-form-item label="规格">
      <el-input size="small" placeholder="请填写规格"
                clearable
                v-model="medicineInfo.medicineSpecification"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input size="small" placeholder="填写价格"
                  clearable
                  v-model="medicineInfo.medicinePrice"></el-input>
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
  name: 'CreateMedicineDialog',
  props: ['visible', 'medicine'],
  data () {
    return {
      medicineInfo: {},
      verify: {
        nameIsExist: false,
        nameIsEmpty: false
      },
      disabled: true
    }
  },
  watch: {
    medicine: function (val) {
      this.disabled = !val.medicineId
      if (val.medicineId) {
        for (let key in val) {
          this.$set(this.medicineInfo, key, val[key])
        }
      } else {
        this.medicineInfo = {}
      }
    }
  },
  methods: {
    verifyName () {
      if (!this.medicineInfo.medicineName || this.medicineInfo.medicineName.trim() === '') {
        this.verify.nameIsEmpty = true
        this.verify.nameIsExist = false
        this.disabled = true
        return
      }
      this.verify.nameIsEmpty = false
      // 如果改变后的名称和开始名称一样不校验直接返回
      if (this.medicineInfo.medicineName === this.medicine.medicineName) {
        this.disabled = false
        return
      }
      let url = '/medicine/verify/' + this.medicineInfo.medicineName
      this.$http.get(url, null,
        (res) => {
          this.verify.nameIsExist = !res.data
          this.disabled = !res.data
        })
    },
    close () {
      this.verify.nameIsEmpty = false
      this.verify.nameIsExist = false
      this.$emit('closeDialog')
    },
    submit () {
      if (this.medicineInfo.isDirect === undefined) {
        this.$message.warning('请选择是否直营')
        return
      }
      this.disabled = true
      let url = this.medicine.medicineId ? '/medicine/updateMedicineInfo' : '/medicine/addMedicineInfo'
      this.$http.postJson(url, this.medicineInfo,
        (res) => {
          this.$message.success(this.medicine.medicineId ? '修改成功' : '添加成功')
          this.disabled = false
          this.$emit('closeDialog')
          this.$emit('flushTable')
        },
        () => {
          this.disabled = false
          this.$message.error(this.medicine.medicineId ? '修改失败' : '添加失败')
        })
    }
  }
}
</script>

<style scoped>

</style>
