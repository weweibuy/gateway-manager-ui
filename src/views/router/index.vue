<template>
  <div>
    <div class="filter-container" style="margin-top: 20px">
      <el-input v-model="listQuery.routerId" placeholder="路由id" style="width: 205px;" class="filter-item"/>

      <el-input v-model="listQuery.systemId" placeholder="服务id" style="width: 205px;" class="filter-item"/>
      <el-input v-model="listQuery.systemName" placeholder="服务名称" style="width: 205px;" class="filter-item"/>
      <el-input v-model="listQuery.uri" placeholder="服务url" style="width: 205px;" class="filter-item"/>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 205px">
        <el-option key="0" value="使用"/>
        <el-option key="1" value="停用"/>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        {{ $t('table.search') }}
      </el-button>
      <router-link to='/router/create'>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                   @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
      </router-link>
    </div>


    <el-table :key="tableKey" :data="routerListData" v-loading="listLoading" style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>

      <el-table-column label="路由id" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.routerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务id" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>服务id: {{ scope.row.systemId }}</p>
            <p>服务名: {{ scope.row.systemName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.systemId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="服务名" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.systemName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="服务url" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.uri }}</span>
        </template>
      </el-table-column>

      <el-table-column label="优先级" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 15px">{{ scope.row.priority }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isUse | statusFilter">
            {{ scope.row.isUse  ? '使用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows"
                @pagination="getList"></pagination>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {getRouters} from '@/api/router'
  import waves from '@/directive/waves'

  export default {
    name: "index",
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        tableKey: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          rows: 10,
          routerId: '',
          systemId: '',
          systemName: '',
          uri: '',
          status: '',
        },
        total: 0,
        routerListData: [],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getRouters(this.listQuery).then(response => {
          this.total = response.data.total
          this.routerListData = response.data.routers
        }).catch(error => {

        }).finally(() => {
          this.listLoading = false
        })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSearch() {
        this.listQuery.page = 1
        this.getList()
      },
      handleCreate() {

      }
    }

  }
</script>

<style scoped>

</style>
