const potentialCustomer = () => import('../../view/potentialCustomer/potentialCustomer')
const addPotentialCustomer = () => import('../../view/potentialCustomer/addPotentialCustomer')

export default [
  {
    name: 'potentialCustomer',
    path: '/potential/customer',
    component: potentialCustomer,
    meta: {
      title: '意向客户管理',
      auth: true
    }
  },
  {
    name: 'addPotentialCustomer',
    path: '/potential/modify/customer/:customerId?',
    component: addPotentialCustomer,
    meta: {
      title: '添加客户',
      auth: true
    }
  }
]
