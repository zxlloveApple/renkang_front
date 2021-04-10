import Vue from 'vue'
import Router from 'vue-router'
import login from './modules/login'
import Index from '../view/Index'
import system from './modules/system'
import info from './modules/info'
import marker from './modules/marker'
import customer from './modules/customer'
import potentialCustomer from './modules/potentialCustomer'
const NotFound = () => import('../view/404.vue')
const Workbench = () => import('../view/Workbench.vue')

Vue.use(Router)
const routers = [
  {
    path: '*',
    redirect: '/renkang/notfound'
  },
  ...login,
  {
    path: '/renkang',
    name: '海曙仁康',
    component: Index,
    children: [
      {
        path: 'notfound',
        name: '资源没有找到',
        component: NotFound
      },
      {
        path: 'workbench',
        name: '首页',
        component: Workbench
      },
      ...system,
      ...info,
      ...marker,
      ...customer,
      ...potentialCustomer
    ]
  }
]
const router = new Router({
  mode: 'hash',
  base: '/projectRenkang',
  routes: routers
})
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('$renkang-access-token')) {
    if (to.path === '/login') {
      next({
        path: '/renkang'
      })
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
export default router
