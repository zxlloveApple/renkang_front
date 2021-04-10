const userManage = () => import('../../view/system/UserManage.vue')
const DepartmentManage = () => import('../../view/system/DepartmentManage.vue')
const userGroup = () => import('../../view/system/UserGroup.vue')
export default [
  {
    path: '/system/userManage',
    name: '用户列表',
    component: userManage
  },
  {
    path: '/system/department',
    name: '部门列表',
    component: DepartmentManage
  },
  {
    path: '/system/userGroup',
    name: '用户组',
    component: userGroup
  }
]
