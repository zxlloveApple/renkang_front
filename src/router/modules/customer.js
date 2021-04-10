const MerchantsCustomer = () => import('../../view/customer/MerchantsCustomer')
const addCustomer = () => import('../../view/customer/addCustomer')

export default [
  {
    name: 'merchantsCustomer',
    path: '/merchants/customer',
    component: MerchantsCustomer,
    meta: {
      title: '客户管理-招商',
      auth: true
    }
  },
  {
    name: 'addCustomer',
    path: '/merchants/add/customer/:customerId?',
    component: addCustomer,
    meta: {
      title: '添加客户',
      auth: true
    }
  }
]
