<template>
  <el-dialog :visible="visible"
             @close="close"
             :title="hospital.hospitalId ? '修改医院' : '新增医院'"
             :close-on-click-modal="false"
             width="600px">
    <el-form :model="hospitalInfo" label-width="80px">
      <el-form-item label="医院名称" required>
        <el-input size="small" placeholder="填写医院名称"
                  @change="verifyName"
                  :class="verify.nameIsExist || verify.nameIsEmpty ? 'el-input-error' : ''"
                  v-model="hospitalInfo.hospitalName" clearable></el-input>
        <div v-if="verify.nameIsExist" class="error-label">医院名称已存在</div>
        <div v-if="verify.nameIsEmpty" class="error-label">医院名称不能为空</div>
      </el-form-item>
      <el-form-item label="所属区域" required>
        <el-select size="small" placeholder="请选择"
                  clearable
                   filterable
                   style="width: 157px"
                   @change="loadCities"
                  v-model="hospitalInfo.provinceAreaCode">
          <el-option v-for="item in provinces" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
        </el-select>
        <el-select size="small" placeholder="请选择"
                   clearable
                   filterable
                   style="width: 157px"
                   @change="loadRegions"
                   v-model="hospitalInfo.cityAreaCode">
          <el-option v-for="item in cities" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
        </el-select>
        <el-select size="small" placeholder="请选择"
                   clearable
                   filterable
                   style="width: 157px"
                   v-model="hospitalInfo.regionAreaCode">
          <el-option v-for="item in regions" :key="item.id" :label="item.areaName" :value="item.areaCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址">
        <el-input size="small" placeholder="请填写地址"
                  clearable
                  v-model="hospitalInfo.hospitalAddress"></el-input>
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
  name: 'CreateHospitalDialog',
  props: ['visible', 'hospital'],
  data () {
    return {
      hospitalInfo: {},
      verify: {
        nameIsExist: false,
        nameIsEmpty: false
      },
      disabled: false,
      provinces: [],
      cities: [],
      regions: []
    }
  },
  watch: {
    hospital: function (val) {
      if (val.hospitalId) {
        for (let key in val) {
          this.$set(this.hospitalInfo, key, val[key])
        }
        if (this.hospitalInfo.provinceAreaCode) {
          this.loadNaticePlace({type: 'city', parentCode: this.hospitalInfo.provinceAreaCode})
        }
        if (this.hospitalInfo.cityAreaCode) {
          this.loadNaticePlace({type: 'region', parentCode: this.hospitalInfo.cityAreaCode})
        }
      } else {
        this.hospitalInfo = {}
        this.hospitalInfo.provinceAreaCode = 33
        this.loadNaticePlace({type: 'city', parentCode: this.hospitalInfo.provinceAreaCode})
      }
    }
  },
  mounted () {
    this.loadNaticePlace({type: 'province', parentCode: undefined})
  },
  methods: {
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
      this.loadNaticePlace({type: 'city', parentCode: val})
    },
    loadRegions (val) {
      this.loadNaticePlace({type: 'region', parentCode: val})
    },
    verifyName () {
      if (!this.hospitalInfo.hospitalName || this.hospitalInfo.hospitalName.trim() === '') {
        this.verify.nameIsEmpty = true
        this.verify.nameIsExist = false
        return
      }
      this.verify.nameIsEmpty = false
      if (this.hospitalInfo.hospitalName === this.hospital().hospitalName) {
        return
      }
      let url = '/hospital/verify/' + this.hospitalInfo.hospitalName
      this.$http.post(url, null,
        (res) => {
          this.verify.nameIsExist = res.data
        })
    },
    close () {
      this.$emit('closeDialog', false)
    },
    submit () {
      this.disabled = true
      if (this.verify.nameIsEmpty) {
        this.disabled = false
        this.$message.warning('医院名不能为空')
        return
      }
      if (this.verify.nameIsExist) {
        this.disabled = false
        this.$message.warning('医院名已存在')
        return
      }
      if (!this.hospitalInfo.provinceAreaCode || !this.hospitalInfo.cityAreaCode || !this.hospitalInfo.regionAreaCode) {
        this.disabled = false
        this.$message.warning('请选择医院所属区域')
        return
      }
      let url = this.hospitalInfo.hospitalId ? '/hospital/updateHospitalInfo' : '/hospital/addHospitalInfo'
      this.$http.postJson(url, this.hospitalInfo,
        (res) => {
          this.$message.success(this.hospital.hospitalId ? '修改成功' : '添加成功')
          this.disabled = false
          this.$emit('closeDialog', true)
        },
        () => {
          this.disabled = false
          this.$message.error(this.hospital.hospitalId ? '修改失败' : '添加失败')
        })
    }
  }
}
</script>

<style scoped>

</style>
