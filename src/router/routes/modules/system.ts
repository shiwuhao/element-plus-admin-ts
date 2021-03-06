import Layout from "~/layouts/default/index.vue";
import {AppRouteRecordRaw} from "~/router/types";

const systemRoute: AppRouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/configs',
    component: Layout,
    meta: {title: '系统', icon: 'el-windows', sort: 60},
    children: [
      {
        path: 'users',
        name: 'Users',
        meta: {title: '用户管理'},
        component: () => import('~/views/system/users/index.vue'),
      },
      {
        path: 'roles',
        name: 'Roles',
        meta: {title: '角色管理'},
        component: () => import('~/views/system/roles/index.vue'),
      },
      {
        path: 'menus',
        name: 'Menus',
        meta: {title: '菜单管理'},
        component: () => import('~/views/system/menus/index.vue'),
      },
      {
        path: 'actions',
        name: 'Actions',
        meta: {title: '动作管理'},
        component: () => import('~/views/system/actions/index.vue'),
      },
      {
        path: 'permissions',
        name: 'Permissions',
        meta: {title: '权限节点'},
        component: () => import('~/views/system/permissions/index.vue'),
      },
      {
        path: 'configs',
        name: 'Config',
        meta: {title: '站点配置'},
        component: () => import('~/views/system/configs/index.vue'),
      }
    ]
  },
];

export default systemRoute;