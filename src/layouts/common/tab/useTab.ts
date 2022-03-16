import path from "path";
import store from "~/store";
import {RouteLocation, RouteRecord, useRouter} from "vue-router";
import {computed, nextTick, onMounted, Ref, ref, unref, UnwrapRef, watch} from 'vue';

export function useTab() {

  const {getters, dispatch} = store;
  const {push, replace, currentRoute, getRoutes} = useRouter();

  const scrollbarRef: UnwrapRef<any> = ref();
  const getViewRefs: Ref<UnwrapRef<any[]>> = ref([]);
  const getSelectView = ref();
  const getVisitedViews = computed(() => getters.getVisitedViews);

  /**
   * 初始化视图
   * @returns {Promise<void>}
   */
  async function initViews() {
    const affixViews = filterAffixViews(getRoutes());
    for (const view of affixViews) {
      const {name, path, fullPath, meta} = view as RouteLocation;
      name && await dispatch('tab/addVisitedView', {name, path, fullPath, meta});
    }
  }

  /**
   * 跳转视图
   * @param view
   * @returns {Promise<void>}
   */
  async function goView(view: RouteLocation) {
    const {path, fullPath} = view;
    if (path === unref(currentRoute).path) return;
    await replace({path: fullPath})
  }

  /**
   * 添加视图
   * @returns {Promise<void>}
   */
  async function addView() {
    const {name, path, fullPath, meta} = currentRoute.value
    name && await dispatch('tab/addView', {name, path, fullPath, meta});
  }

  /**
   * 关闭视图
   * @param view
   * @returns {Promise<void>}
   */
  async function closeView({name, path, fullPath, meta}: RouteLocation) {
    const {visitedViews} = await dispatch('tab/delView', {name, path, fullPath, meta});
    if (viewIsActive({name, path, fullPath, meta} as RouteLocation)) {
      await toLastView(visitedViews, {name, path, fullPath, meta} as RouteLocation);
    }
  }

  /**
   * 刷新视图
   * @param view
   * @returns {Promise<void>}
   */
  async function refreshView({name, path, fullPath, meta}: RouteLocation) {
    await dispatch('tab/delCachedView', {name, path, fullPath, meta});
    await nextTick(() => {
      replace({path: '/redirect' + fullPath});
    })
  }

  /**
   * 关闭其他视图
   * @param view
   * @returns {Promise<void>}
   */
  async function closeOtherView({name, path, fullPath, meta}: RouteLocation) {
    if (fullPath !== currentRoute.value.fullPath) {
      await push({name, path, fullPath, meta} as RouteLocation);
    }
    await dispatch('tab/delOtherViews', currentRoute);
    await moveToCurrentTab();
  }

  /**
   * 关闭所有视图
   * @param view
   */
  async function closeAllView(view: RouteLocation) {
    const {visitedViews} = await dispatch('tab/delAllViews');
    await toLastView(visitedViews, view);
  }

  /**
   * 过滤需要固定的视图
   * @param routes
   * @param basePath
   * @returns {[]}
   */
  function filterAffixViews(routes: RouteRecord[], basePath = '/') {
    let views: object[] = [];
    routes.forEach(route => {
      if (route.meta && route.meta.affix) {
        const viewPath = path.resolve(basePath, route.path)
        views.push({fullPath: viewPath, path: viewPath, name: route.name, meta: {...route.meta}})
      }
      if (route.children) {
        const childViews = filterAffixViews(route.children as RouteRecord[], route.path)
        if (childViews.length >= 1) {
          views = [...views, ...childViews]
        }
      }
    });
    return views
  }

  /**
   * 移动到当前路由所在标签
   * @returns {Promise<void>}
   */
  async function moveToCurrentTab() {
    await nextTick(async () => {
      for (const tag of getViewRefs.value) {
        if (tag.$attrs.route.path === unref(currentRoute).path) {
          moveToTarget(tag)
          if (tag.$attrs.route.fullPath !== unref(currentRoute).fullPath) {
            await dispatch('tab/updateVisitedView', unref(currentRoute))
          }
          break
        }
      }
    })
  }

  /**
   * 移动到指定标签位置
   * @param currentTag
   */
  function moveToTarget(currentTag: UnwrapRef<any>) {
    let offsetLeft = 0;
    const tagList = getViewRefs.value;

    if (tagList.length > 0) {
      const firstTag = tagList[0];
      const lastTag = tagList[tagList.length - 1];

      if (currentTag === firstTag) {
        offsetLeft = 0;
      } else if (currentTag === lastTag) {
        offsetLeft = lastTag.$el.offsetLeft;
      } else {
        const currentIndex = tagList.findIndex(item => item === currentTag);
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - 2;
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + 2

        const containerWidth = parseInt(scrollbarRef.value.$el.offsetWidth);
        const scrollWrapper = scrollbarRef.value.$refs.wrap$;

        if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
          offsetLeft = afterNextTagOffsetLeft - containerWidth;
        } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
          offsetLeft = beforePrevTagOffsetLeft
        }
      }
      scrollbarRef.value.setScrollLeft(offsetLeft);
    }
  }

  /**
   * 跳转到最后一个标签视图
   * @param visitedViews
   * @param view
   * @returns {Promise<void>}
   */
  async function toLastView(visitedViews: RouteLocation[], {name, fullPath}: RouteLocation) {
    const latestView: RouteLocation = visitedViews.slice(-1)[0];
    if (latestView) {
      await push({path: latestView.fullPath})
    } else {
      if (name === 'Dashboard') {
        await replace({path: '/redirect' + fullPath})
      } else {
        await push('/')
      }
    }
  }

  /**
   * 是否活跃视图
   * @param view
   * @returns {boolean}
   */
  function viewIsActive({path}: RouteLocation) {
    return path === currentRoute.value.path;
  }

  /**
   * 是否固定视图
   * @param view
   * @returns {boolean|*}
   */
  function viewIsAffix({meta}: RouteLocation) {
    return meta && meta.affix;
  }

  // 初始化
  onMounted(async () => {
    await initViews();
    await addView();
    await moveToCurrentTab();
  })

  watch(currentRoute, async () => {
    await addView();
    await moveToCurrentTab()
  });

  return {
    scrollbarRef,
    getViewRefs,
    getSelectView,
    getVisitedViews,
    goView,
    addView,
    closeView,
    refreshView,
    closeOtherView,
    closeAllView,
    viewIsActive,
    viewIsAffix,
  };
}