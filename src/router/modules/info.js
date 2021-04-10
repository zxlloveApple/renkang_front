const MedicineManage = () => import('../../view/medicine/MedicineManage')
const DrugstoreManage = () => import('../../view/drugstore/DrugstoreManage')
const HospitalManage = () => import('../../view/hospital/HospitalManage')
const UploadExcel = () => import('../../view/excel/UploadExcel')

export default [
  {
    name: 'medicineManage',
    path: '/info/medicineManage',
    component: MedicineManage,
    meta: {
      title: '药品管理',
      auth: true
    }
  },
  {
    name: 'drugstoreManage',
    path: '/info/drugstoreManage',
    component: DrugstoreManage,
    meta: {
      title: '药店管理',
      auth: true
    }
  },
  {
    name: 'hospitalManage',
    path: '/info/hospitalManage',
    component: HospitalManage,
    meta: {
      title: '医院管理',
      auth: true
    }
  },
  {
    name: '上传Excel',
    path: '/info/uploadExcel',
    component: UploadExcel,
    meta: {
      title: '上传信息Excel',
      auth: true
    }
  }
]
