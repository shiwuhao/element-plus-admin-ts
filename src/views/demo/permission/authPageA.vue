<template>
  <div class="m-2 flex-row center align-center" style="height: 300px;background: var(--el-color-primary)">
    <h1>{{ RoleEnum.ADMINISTRATOR }}角色可见</h1>
  </div>
</template>
<script lang="ts" setup>
import {RoleEnum} from "~/enums/permission";
</script>