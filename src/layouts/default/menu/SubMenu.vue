<template>
  <el-sub-menu :index="menu.path" v-if="menu.children && menu.children.length >= 1" popper-append-to-body>
    <template #title>
      <el-icon v-if="menu.icon">
        <icon :name="menu.icon" :size="18" class="mr-1" />
      </el-icon>
      <span>{{ menu.title }}</span>
    </template>
    <template v-for="child in menu.children">
      <sub-menu v-if="child.children && child.children.length > 1" :menu="child" :key="child.path"/>
      <item-menu v-else :menu="child" :key="child.path"/>
    </template>
  </el-sub-menu>
  <item-menu v-else :menu="menu.children && menu.children.length === 1 ? menu.children[0] : menu"/>
</template>
<script lang="ts" setup>
import ItemMenu from "~/layouts/default/menu/ItemMenu.vue";
defineProps({
  menu: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: '',
  }
})

const logo = import.meta.env.VITE_LOGO
</script>
