<template>
  <div class="common-header">
    <div class="header-right">
      <div>{{dateTime}}</div>
      <el-dropdown trigger="hover" @command="handleCommand">
        <span style="cursor: pointer">你好！{{userInfo.username}}</span>
        <el-dropdown-menu>
          <el-dropdown-item command="out">安全退出</el-dropdown-item>
          <el-dropdown-item command="editPsd">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <edit-psd-dialog :visible="visible" :user="userInfo" @closeReset="closeReset"></edit-psd-dialog>
  </div>
</template>

<script>
import EditPsdDialog from '../../view/system/dialog/EditPsdDialog'
export default {
  name: 'HeaderNav',
  components: {
    EditPsdDialog
  },
  data () {
    return {
      dateTime: undefined,
      userInfo: JSON.parse(sessionStorage.getItem('user')),
      visible: false,
      ws: undefined
    }
  },
  mounted () {
    this.getDate()
    this.initWebsocket()
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    initWebsocket () {
      let userId = this.userInfo.userId
      // let url = 'ws://www.nblsyy.cn:8099/ws/' + userId
      let url = 'ws://www.nblsyy.cn:8098/ws/' + userId
      this.ws = new WebSocket(url)
      this.ws.onopen = function (event) {}
      // eslint-disable-next-line no-unused-expressions
      this.ws.onmessage = (msg) => {
        if (msg.data === '101') {
          this.$alert('你的账号已经在其它地方登录！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              sessionStorage.removeItem('user')
              sessionStorage.removeItem('$renkang-access-token')
              this.$router.push({path: '/login'})
            }
          })
        }
      }
      this.ws.onclose = () => {}
    },
    handleCommand (commond) {
      if (commond === 'out') {
        this.$confirm('确定退出当前系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ws.close()
          let url = window.location.origin
          sessionStorage.removeItem('$renkang-access-token')
          this.$router.push({
            path: url + '/login'
          })
        })
          .catch(() => {
          })
      } else if (commond === 'editPsd') {
        this.visible = true
      }
    },
    getDate () {
      let date = new Date()
      let a = ['日', '一', '二', '三', '四', '五', '六']
      let week = date.getDay()
      let str = '星期' + a[week]
      this.dateTime = this.dateFormat(date, 'yyyy-MM-dd') + ' ' + str + ' 欢迎您 '
    },
    closeReset () {
      this.visible = false
    }
  }
}
</script>

<style>

</style>
