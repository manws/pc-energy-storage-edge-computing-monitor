import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'monitor',
    component: () => import('@/views/MonitorView.vue'),
    meta: { title: '实时监控' }
  },
  {
    path: '/bms/:id/algorithm',
    name: 'algorithm',
    component: () => import('@/views/AlgorithmView.vue'),
    meta: { title: '算法估算' }
  },
  {
    path: '/settings',
    redirect: '/settings/soc'
  },
  {
    path: '/settings/soc',
    name: 'settings-soc',
    component: () => import('@/views/SettingsSocView.vue'),
    meta: { title: 'SOC 估算设置' }
  },
  {
    path: '/settings/soe',
    name: 'settings-soe',
    component: () => import('@/views/SettingsSoeView.vue'),
    meta: { title: 'SOE 估算设置' }
  },
  {
    path: '/settings/sop',
    name: 'settings-sop',
    component: () => import('@/views/SettingsSopView.vue'),
    meta: { title: 'SOP 估算设置' }
  },
  {
    path: '/settings/inconsistency',
    name: 'settings-inconsistency',
    component: () => import('@/views/SettingsInconsistencyView.vue'),
    meta: { title: '不一致性估算设置' }
  },
  {
    path: '/settings/alert',
    name: 'settings-alert',
    component: () => import('@/views/SettingsAlertView.vue'),
    meta: { title: '预警估算设置' }
  },
  {
    path: '/bms/:id',
    name: 'bms-detail',
    component: () => import('@/views/BmsDetailView.vue'),
    meta: { title: '查看详情' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function clusterName(id) {
  const value = String(id || '1')
  return /^\d+$/.test(value) ? `${value}簇` : value
}

router.afterEach((to) => {
  let pageTitle = to.meta.title
  if (to.name === 'bms-detail') pageTitle = `${clusterName(to.params.id)} · 查看详情`
  if (to.name === 'algorithm') pageTitle = `${clusterName(to.params.id)} · 算法估算`
  document.title = pageTitle ? `${pageTitle} · 储能-边缘计算监控系统` : '储能-边缘计算监控系统'
})

export default router
