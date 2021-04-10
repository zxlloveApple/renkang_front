<template>
  <el-dialog width="500px"
             :visible="visible"
             @close="close"
             :close-on-click-modal="false"
             title="修改密码">
    <el-form v-model="form" label-width="120px" label-position="left">
      <el-form-item label="新密码：" required>
        <el-input size="small" type="password" v-model="form.password"
                  clearable @change="verifyPsd"
                  placeholder="请输入至少6位的密码"
                  :class="emptyFlagPsd || regFlagPsd ? 'el-input-error':''"></el-input>
        <div v-if="emptyFlagPsd" class="error-label">密码不能为空</div>
        <div v-if="regFlagPsd" class="error-label">密码格式不正确</div>
      </el-form-item>
      <el-form-item label="确认新密码：" required>
        <el-input size="small" type="password" v-model="form.confirmPassword"
                  placeholder="请输入至少6位的密码"
                  clearable @change="verifyConPsd" :class="emptyFlagConPsd || equalFlagConPsd ? 'el-input-error':''"></el-input>
        <div v-if="emptyFlagConPsd || equalFlagConPsd" class="error-label">{{emptyFlagConPsd? '请确认密码' : '和新密码不同'}}</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :disabled="subMit" @click="submitEdit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditPsdDialog',
  props: ['visible', 'user'],
  data () {
    return {
      form: {
        password: '',
        confirmPassword: ''
      },
      subMit: true,
      emptyFlagPsd: false,
      regFlagPsd: false,
      emptyFlagConPsd: false,
      equalFlagConPsd: false
    }
  },
  watch: {
    form: {
      handler (newVal, oldVal) {
        if (newVal.password && newVal.confirmPassword && newVal.password === newVal.confirmPassword) {
          this.subMit = false
        } else {
          this.subMit = true
        }
      },
      deep: true
    }
  },
  methods: {
    close () {
      this.$emit('closeReset', false)
    },
    verifyPsd () {
      if (!this.form.password || this.form.password.trim() === '') {
        this.emptyFlagPsd = true
        this.regFlagPsd = false
        return
      }
      this.emptyFlagPsd = false
      this.regFlagPsd = !/^[a-zA-Z0-9]{6,}[\s]{0}$/.test(this.form.password)
    },
    verifyConPsd () {
      if (!this.form.confirmPassword) {
        this.emptyFlagConPsd = true
        this.equalFlagConPsd = false
        return
      }
      this.emptyFlagConPsd = false
      this.equalFlagConPsd = this.form.password !== this.form.confirmPassword
    },
    submitEdit () {
      let url = '/base/sysUser/addUser'
      this.user.password = this.form.password
      this.$http.postJson(url, this.user,
        (res) => {
          this.$message.success(res.data)
          this.$emit('closeReset', false)
        })
    }
  }
}
</script>

<style scoped>

</style>
