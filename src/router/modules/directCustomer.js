const directCustomer = () => import('../../view/customer/directCustomer')
const addDirectCustomer = () => import('../../view/customer/addDirectCustomer')

export default [
  {
    name: 'directCustomer',
    path: '/direct/customer',
    component: directCustomer,
    meta: {
      title: '直营客户管理',
      auth: true
    }
  },
  {
    name: 'addDirectCustomer',
    path: '/direct/modify/customer/:customerId?',
    component: addDirectCustomer,
    meta: {
      title: '添加客户',
      auth: true
    }
  }
]
