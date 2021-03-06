import Layout from "~/layouts/default/index.vue";
import {AppRouteRecordRaw} from "~/router/types";

const featureRoute: AppRouteRecordRaw[] = [
  {
    path: '/feature',
    name: 'Feature',
    component: Layout,
    redirect: '/feature',
    meta: {title: '功能', icon: 'el-ungroup', sort: 30},
    children: [
      {
        path: 'context-menu',
        name: 'ContextMenu',
        meta: {title: '右键菜单'},
        component: () => import('~/views/demo/feature/context-menu/index.vue'),
      },
      {
        path: 'full-screen',
        name: 'FullScreen',
        meta: {title: '全屏'},
        component: () => import('~/views/demo/feature/full-screen/index.vue'),
      },
      {
        path: 'clipboard',
        name: 'Clipboard',
        meta: {title: '剪贴板'},
        component: () => import('~/views/demo/feature/clipboard/index.vue'),
      },
      {
        path: 'click-out-side',
        name: 'ClickOutSide',
        meta: {title: '单击外部'},
        component: () => import('~/views/demo/feature/click-out-side/index.vue'),
      },
      {
        path: 'qr-code',
        name: 'QrCode',
        meta: {title: '二维码'},
        component: () => import('~/views/demo/feature/qr-code/index.vue'),
      },
      {
        path: 'drauu',
        name: 'Drauu',
        meta: {title: '画图'},
        component: () => import('~/views/demo/feature/drauu/index.vue'),
      },
      {
        path: 'debounce',
        name: 'Debounce',
        meta: {title: '防抖'},
        component: () => import('~/views/demo/feature/debounce/index.vue'),
      },
      {
        path: 'throttle',
        name: 'Throttle',
        meta: {title: '节流'},
        component: () => import('~/views/demo/feature/throttle/index.vue'),
      },
      {
        path: 'flex',
        name: 'Flex',
        meta: {title: '布局'},
        component: () => import('~/views/demo/feature/flex/index.vue'),
      },
    ]
  }
];

export default featureRoute;