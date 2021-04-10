const SalesVolume = () => import('@/view/marker/SalesVolume')
const SaleContrast = () => import('@/view/marker/SaleContrast')
const FlowManage = () => import('@/view/marker/FlowManage')
const ExploitManage = () => import('@/view/exploit/ExploitManage')

export default [
  {
    name: 'salesVolumeManage',
    path: '/marker/sale/salesVolumeManage',
    component: SalesVolume,
    meta: {
      title: '销量管理',
      auth: true
    }
  },
  {
    name: 'SaleContrast',
    path: '/marker/sale/SaleContrast',
    component: SaleContrast,
    meta: {
      title: '销量对照',
      auth: true
    }
  },
  {
    name: 'FlowManage',
    path: '/marker/sale/FlowManage',
    component: FlowManage,
    meta: {
      title: '流向管理',
      auth: true
    }
  },
  {
    name: 'ExploitManage',
    path: '/exploit/exploitManage',
    component: ExploitManage,
    meta: {
      title: '开发记录管理',
      auth: true
    }
  }
]
