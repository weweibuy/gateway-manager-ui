<template>
  <div style="margin-top: 20px; margin-left: 20px">

    <el-collapse >
      <el-collapse-item name="1">
        <template slot="title">
          <h3>新增路由</h3><i class="header-icon el-icon-info"></i>
        </template>
        <RouterCreateForm @routerIdChange="handlerRouterIdChange"></RouterCreateForm>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template slot="title">
          <h3>关联断言</h3><i class="header-icon el-icon-info"></i>
        </template>

        <PredicateCreateForm ref="predicateCreate"></PredicateCreateForm>

      </el-collapse-item>

      <el-collapse-item name="3">
        <template slot="title">
          <h3>关联过滤器</h3><i class="header-icon el-icon-info"></i>
        </template>

        <FilterCreateForm ref="filterCreate"></FilterCreateForm>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

  import {addRouter} from '@/api/router'
  import {MessageBox, Message} from 'element-ui'
  import PredicateCreateForm from './router/predicate/PredicateCreateForm'
  import FilterCreateForm from './router/filter/FilterCreateForm'
  import RouterCreateForm from './router/RouterCreateForm'

  export default {
    name: "RouterAdd",
    components: {PredicateCreateForm, FilterCreateForm, RouterCreateForm},

    data() {
      return {
      }
    },
    methods: {
      handlerRouterIdChange(routerId) {
        this.$refs.predicateCreate.handlerRouterIdChange(routerId)
        this.$refs.filterCreate.handlerRouterIdChange(routerId)
      }
    }

  }
</script>

<style scoped>

</style>
