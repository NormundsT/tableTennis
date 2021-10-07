
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Table.vue') },
      { path: '/help', component: () => import('pages/Help.vue') },
      { path: '/rules', component: () => import('pages/Rules.vue') },
      { path: 'table/:year?/:season?', component: () => import('pages/Table.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
