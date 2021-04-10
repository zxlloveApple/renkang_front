<template>
  <div class="user-user-group" style="display: -webkit-box">
    <div class="user-group-list">
      <div class="user-group-title">用户组列表</div>
      <div style="box-sizing: border-box;background: aliceblue;flex-grow: 1">
        <div v-for="(item, index) in groupList" :key="index"
             :class="{'group-name-content': true, 'group-name-selected': item.show}" @click="changeInfo(item, index)">
          <i v-if="!item.groupId" class="el-icon-plus"/>{{item.groupName}}
        </div>
      </div>
    </div>
    <div class="user-group-detail">
      <div class="user-group-detail-info">
        <div style="margin: auto 0 auto 10px">
          {{userGroupInfo.groupName}}
        </div>
      </div>
      <div style="display: flex;margin: 10px 0;flex-grow: 0;justify-content: center">
          <div style="display: flex;margin-right: 10px">
            <div style="min-width: 85px;margin: auto 0">用户组名称:</div>
            <div class="input-label">
              <el-input size="small" v-model="userGroupInfo.groupName" clearable @change="verifyName(userGroupInfo.groupName)" :class="emptyFlag || existFlag ? 'el-input-error':''"></el-input>
              <div v-if="emptyFlag || existFlag" class="error-label">{{emptyFlag ? '用户组名称不能为空' : '用户组名已存在'}}</div>
            </div>
          </div>
          <div style="display: flex;margin-right: 10px">
            <div style="min-width: 85px;margin: auto 0">用户组描述:</div>
            <el-input size="small" v-model="userGroupInfo.groupDescription" clearable></el-input>
          </div>
          <div>
            <el-button type="primary" size="small" @click="submitSave">保存</el-button>
            <el-button v-if="userGroupInfo.groupId" type="primary" size="small" @click="delUserGroup">删除</el-button>
          </div>
      </div>
      <div class="user-group-role-user" v-if="userGroupInfo.groupId">
        <div style="display: flex;">
          <div :class="{'group-title-content': true, 'title-selected': showRoleList}" @click="changeShowTable">
            <div class="group-title">菜单列表</div>
          </div>
          <div :class="{'group-title-content': true, 'title-selected': showUserList}" @click="selectUsersInGroup">
            <div class="group-title">用户列表</div>
          </div>
        </div>
        <div v-if="showRoleList" style="margin: 0 0 5px 0">
          <el-cascader
            style="width:50%"
            :options="roleTree"
            :key="isResouceShow"
            v-model="roleIds"
            :props="props"
            filterable
            size="small"
            clearable
            collapse-tags
          ></el-cascader>
          <el-button type="primary" style="padding: 9px 15px" @click="addRole" :disabled="roleIds.length === 0">添加</el-button>
        </div>
        <div v-if="showUserList" style="margin: 0 0 5px 0">
          <el-select
            style="width:50%;margin: auto 0"
            clearable
            multiple
            collapse-tags
            size="small"
            v-model="selectedUsers"
            filterable>
            <el-option v-for="(item, index) in usersNotInGroup" :key="index" :label="item.realName" :value="item.userId" style="display: flex">
              <span>{{item.username}}</span>
              <div style="height: 15px;width: 1px;background: #cccccc;margin: auto 10px"></div>
              <span>{{item.realName}}</span>
            </el-option>
          </el-select>
          <el-button type="primary" style="padding: 9px 15px;" @click="addUserToGroup" :disabled="selectedUsers.length === 0">添加</el-button>
        </div>
        <el-table v-if="showRoleList" :data="groupRoles" border
                  row-key="menuId"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="序号">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column label="菜单名" prop="menuName"></el-table-column>
          <el-table-column label="菜单路径" prop="url"></el-table-column>
          <el-table-column label="菜单状态">
            <template slot-scope="scope">{{scope.row.enable ? '正常' : '禁用'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delPrivilegeWithGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-if="showUserList" :data="userList" border>
          <el-table-column label="序号">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="姓名" prop="realname"></el-table-column>
          <el-table-column label="电话" prop="phone"></el-table-column>
          <el-table-column label="编制" prop="orgName"></el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">{{scope.row.createTime | dateFormat('yyyy-MM-dd')}}</template>
          </el-table-column>
          <el-table-column label="用户状态">
            <template slot-scope="scope">{{scope.row.status ? '正常' : '禁用'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delUserWithGroup(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserGroup',
  data () {
    return {
      groupList: [
        {
          groupName: '创建用户组',
          show: true
        }
      ],
      userGroupInfo: {},
      groupRoles: [],
      userList: [],
      showUserList: false,
      firstClickUserList: false,
      showRoleList: true,
      emptyFlag: false,
      existFlag: false,
      roleIds: [],
      roleList: [],
      roleTree: [],
      props: {
        label: 'menuName',
        value: 'menuId',
        children: 'children',
        multiple: true
      },
      usersNotInGroup: [],
      selectedUsers: [],
      isResouceShow: 0
    }
  },
  created () {
    this.loadUserGroup(0)
  },
  methods: {
    loadUserGroup (type) {
      let url = '/sys/groupMenu/userGroups'
      this.$http.get(url, {},
        (res) => {
          this.groupList = []
          let obj = type === 1 ? {groupName: '创建用户组', userGroupInfo: ''} : {groupName: '创建用户组', groupDescription: '', show: true}
          this.groupList.push(obj)
          this.groupList.push(...res.data)
          if (type !== 1) {
            this.userGroupInfo = {}
            for (let key in this.groupList[0]) {
              this.$set(this.userGroupInfo, key, this.groupList[0][key])
            }
          }
        })
    },
    changeInfo (item, index) {
      ++this.isResouceShow
      this.roleIds = []
      this.emptyFlag = false
      this.existFlag = false
      for (let key in this.groupList) {
        if (index.toString() === key) {
          this.$set(this.groupList[key], 'show', true)
        } else {
          this.$set(this.groupList[key], 'show', false)
        }
      }
      this.firstClickUserList = false
      this.userGroupInfo = {}
      for (let key in item) {
        this.$set(this.userGroupInfo, key, item[key])
      }
      if (!item.groupId) return
      this.groupRoles = []
      this.loadAllRole(item.groupId)
      this.loadGroupRoles(item.groupId)
      this.loadUsersNotInGroup(item.groupId)
    },
    loadGroupRoles (groupId) {
      let url = '/sys/groupMenu/userGroup/menu/' + groupId + '/1'
      this.$http.get(url, {},
        (res) => {
          this.groupRoles = res.data
          this.showRoleList = true
          this.showUserList = false
          this.firstClickUserList = false
        })
    },
    delPrivilegeWithGroup (row) {
      this.$confirm('确定删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/sys/groupMenu/addUserGroupMenus'
          let arr = []
          arr.push(row.menuId)
          this.$http.postJson(url, {menusIds: arr, userGroupId: this.userGroupInfo.groupId, isAdd: 0},
            (res) => {
              this.loadGroupRoles(this.userGroupInfo.groupId)
              this.loadAllRole(this.userGroupInfo.groupId)
            })
        })
        .catch(() => {})
    },
    delUserWithGroup (scope) {
      this.$confirm('确定将  ' + scope.row.realName + '  移除该用户组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/sys/groupMenu/addUserGroupUser'
          let userIds = [scope.row.userId]
          let data = {userIds: userIds, userGroupId: this.userGroupInfo.groupId, isAdd: 0}
          this.$http.postJson(url, data,
            (res) => {
              this.userList.splice(scope.$index, 1)
              this.loadUsersNotInGroup(this.userGroupInfo.groupId)
            })
        })
        .catch(() => {})
    },
    verifyName (val) {
      this.emptyFlag = val === undefined || val.trim() === ''
      if (this.emptyFlag) return
      let arr = this.groupList.filter(item => item.groupId === this.userGroupInfo.groupId)
      if (arr[0].groupName === val) {
        this.existFlag = false
        return
      }
      let url = '/sys/groupMenu/checkGroupName/' + this.userGroupInfo.groupName
      this.$http.get(url, {},
        (res) => {
          this.existFlag = res.data > 0
        })
    },
    submitSave () {
      if (this.userGroupInfo.groupName === undefined || this.userGroupInfo.groupName.trim() === '') {
        this.emptyFlag = true
        return
      }
      this.emptyFlag = false
      let url = '/sys/groupMenu/addUserGroup'
      this.$http.postJson(url, this.userGroupInfo,
        () => {
          this.$message.success(this.userGroupInfo.groupId ? '用户组修改成功' : '用户组添加成功')
          this.loadUserGroup(this.userGroupInfo.groupId ? 1 : 0)
        })
    },
    delUserGroup () {
      this.$confirm('确定删除该用户组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let url = '/sys/groupMenu/deleteGroup/' + this.userGroupInfo.groupId
          this.$http.delete(url, null,
            (res) => {
              this.loadUserGroup(2)
            })
        })
        .catch(() => {})
    },
    selectUsersInGroup () {
      this.showRoleList = false
      this.firstClickUserList = true
      let url = '/sys/groupMenu/userGroup/user/' + this.userGroupInfo.groupId + '/1'
      this.$http.get(url, {},
        (res) => {
          this.showUserList = true
          this.userList = res.data
        })
    },
    changeShowTable () {
      this.showUserList = false
      setTimeout(() => {
        this.showRoleList = true
      }, 100)
    },
    loadAllRole (groupId) {
      let url = '/sys/groupMenu/userGroup/menu/' + groupId + '/0'
      this.$http.get(url, {},
        (res) => {
          ++this.isResouceShow
          this.roleTree = []
          this.roleTree = res.data
        })
    },
    addRole () {
      if (this.roleIds.length === 0) {
        this.$message.warning('请选择权限')
        return
      }
      let ids = []
      this.roleIds.forEach(item => {
        ids.push(...item)
      })
      let url = '/sys/groupMenu/addUserGroupMenus'
      this.$http.postJson(url, {menusIds: new Set(ids), userGroupId: this.userGroupInfo.groupId, isAdd: 1},
        (res) => {
          this.roleIds = []
          this.loadGroupRoles(this.userGroupInfo.groupId)
          this.loadAllRole(this.userGroupInfo.groupId)
        })
    },
    loadUsersNotInGroup (groupId) {
      let url = '/sys/groupMenu/userGroup/user/' + groupId + '/0'
      this.$http.get(url, {},
        (res) => {
          this.usersNotInGroup = []
          this.selectedUsers = []
          this.usersNotInGroup = res.data
        })
    },
    addUserToGroup () {
      let url = '/sys/groupMenu/addUserGroupUser'
      let data = {userIds: this.selectedUsers, userGroupId: this.userGroupInfo.groupId, isAdd: 1}
      this.$http.postJson(url, data,
        (res) => {
          let url = '/sys/groupMenu/userGroup/user/' + this.userGroupInfo.groupId + '/1'
          this.$http.get(url, {},
            (res) => {
              this.userList = res.data
            })
          this.loadUsersNotInGroup(this.userGroupInfo.groupId)
        })
    }
  }
}
</script>

<style scoped>

</style>
