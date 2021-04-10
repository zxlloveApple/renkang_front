<template>
  <el-dialog :visible="visible"
             @close="close"
             title="修改关系"
             custom-class="edit-hospital-relation-dialog"
             :close-on-click-modal="false"
             width="600px">
    <el-form>
      <el-form-item label="医院名称" label-width="90px">
        <el-input size="small" style="width: 220px" disabled v-model="relationInfo.hospitalName"></el-input>
      </el-form-item>
      <el-form-item label="关联业务员" label-width="90px">
        <el-select size="small" filterable v-model="userId" @change="addUser">
          <el-option v-for="item in users" :key="item.userId" :label="item.username" :value="item.userId"></el-option>
        </el-select>
        <div style="display: flex;margin-top: 8px;flex-wrap: wrap">
          <div v-for="(item, index) in relationUsers" :key="index" class="selected-users">
            <div style="margin: auto;line-height: 22px">{{item.username}}</div>
            <i class="el-icon-circle-close close-icon" @click="delUser(index)"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="关联药店" label-width="90px">
        <el-select size="small" filterable v-model="drugstoreId" @change="addDrugstore">
          <el-option v-for="item in drugstores"
                     :key="item.drugstoreId"
                     :label="item.drugstoreName"
                     :value="item.drugstoreId"></el-option>
        </el-select>
        <div style="display: flex;margin-top: 8px;flex-wrap: wrap">
          <div v-for="(item, index) in relationDrugstores" :key="index" class="selected-users">
            <div style="margin: auto;line-height: 22px">{{item.drugstoreName}}</div>
            <i class="el-icon-circle-close close-icon" @click="delDrugstore(index)"></i>
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
  name: 'EditRelationDialog',
  props: ['visible', 'relationInfo', 'users', 'drugstores'],
  data () {
    return {
      relationUsers: this.relationInfo.users ? this.relationInfo.users : [],
      userId: undefined,
      drugstoreId: undefined,
      relationDrugstores: this.relationInfo.drugstoreInfos ? this.relationInfo.drugstoreInfos : []
    }
  },
  watch: {
    'relationInfo': function (val) {
      this.userId = undefined
      this.drugstoreId = undefined
      this.relationUsers = val.users ? val.users : []
      this.relationDrugstores = val.drugstoreInfos ? val.drugstoreInfos : []
    }
  },
  methods: {
    submit () {
      Promise.all([
        this.editUserRelation(),
        this.editDrugstoreRelation()
      ])
        .then(res => {
          this.$message.success('修改成功')
          this.close()
        })
        .catch(() => {
          this.$message.error('修改失败')
        })
    },
    editUserRelation () {
      return new Promise(resolve => {
        let url = '/relation/build/userHospitalRelation'
        let userIds = this.relationUsers.map(item => item.userId)
        let data = {
          hospitalId: this.relationInfo.hospitalId,
          userIdList: userIds
        }
        this.$http.postJson(url, data, res => {
          resolve(res.data)
        })
      })
    },
    editDrugstoreRelation () {
      return new Promise(resolve => {
        let url = '/relation/build/hospitalDrugstoreRelation'
        let drugstoreIds = this.relationDrugstores.map(item => item.drugstoreId)
        let data = {
          hospitalId: this.relationInfo.hospitalId,
          drugstoreList: drugstoreIds
        }
        this.$http.postJson(url, data, res => {
          resolve(res.data)
        })
      })
    },
    close () {
      this.$emit('closeRelation')
    },
    addUser (val) { // 添加关联用户
      let userIds = this.relationUsers.map(item => item.userId)
      let user = this.users.filter(item => item.userId === val)[0]
      if (userIds.indexOf(val) === -1) {
        this.relationUsers.push(user)
      }
      // if (this.relationUsers.indexOf(user) === -1) this.relationUsers.push(user) // 如果没选过就添加进集合
    },
    delUser (val) {
      this.relationUsers.splice(val, 1)
    },
    addDrugstore (val) {
      let drugstoreIds = this.relationDrugstores.map(item => item.drugstoreId)
      let drugstore = this.drugstores.filter(item => item.drugstoreId === val)[0]
      if (drugstoreIds.indexOf(val) === -1) {
        this.relationDrugstores.push(drugstore)
      }
    },
    delDrugstore (item) {
      this.relationDrugstores.splice(item, 1)
    }
  }
}
</script>

<style lang="stylus">
.edit-hospital-relation-dialog{
  .el-form-item{
    margin-bottom 10px
  }
}
</style>
