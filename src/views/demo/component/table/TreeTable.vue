<template>
  <page-wrapper
    :title="$route['meta']['title']"
    :sub-title="$route['meta']['title']"
    content-background>
    <el-card shadow="none">
      <basic-table :data="tableData" :columns="tableColumns" row-key="id">
        <template #action>
          <el-button type="text">编辑</el-button>
          <el-button type="text" style="color: red">删除</el-button>
        </template>
      </basic-table>
    </el-card>
  </page-wrapper>
</template>

<script>
import {BasicTable} from "~/components/Table/index.ts";
import {PageWrapper} from '~/components/Page/index.ts';

import {getBasicColumns, getTreeData} from './tableData.ts';
import {reactive, toRefs} from "vue";

export default {
  name: 'TreeTable',
  components: {BasicTable, PageWrapper},
  setup() {
    const state = reactive({
      tableColumns: getBasicColumns(),
      tableData: getTreeData(),
    });

    return {
      ...toRefs(state),
    }
  }
}
</script>
