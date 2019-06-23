<template>
  <div style="margin-left: 20px">

    <el-collapse value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <h4>过滤器参数</h4><i class="header-icon el-icon-info"></i>
        </template>
        <el-form ref="filterArgsForm" :inline="true" :model="filterArgsForm" :rules="rules"
                 label-width="120px"
                 label-suffix>
          <el-form-item label="路由id" prop="routerId">
            <el-input v-model="filterArgsForm.FilterId" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数名" prop="argsName">
            <el-input v-model="filterArgsForm.argsName" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数值" prop="argsValue">
            <el-input v-model="filterArgsForm.argsValue" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数描述" prop="argsDesc">
            <el-input v-model="filterArgsForm.argsDesc" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数类型" prop="dictType">
            <el-input v-model="filterArgsForm.dictType" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="字典Id" prop="dictId">
            <el-input v-model="filterArgsForm.dictId" style="width: 350px"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="filterArgsForm.status" style="width: 350px" placeholder="请选择状态">
              <el-option label="使用" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <div style="margin-left: 800px">
            <el-form-item>
              <el-button type="primary" :disabled="disableSubmitBtn"
                         @click="submitFilterArgsForm('predicateCreateForm')">
                保存
              </el-button>
              <el-button @click="submitFilterArgsForm('predicateCreateForm')">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
  export default {
    name: "FilterArgs",
    data() {
      return {
        disableSubmitBtn: false,
        filterArgsForm: {},
        rules:[]
      }
    },
    methods: {
      submitFilterArgsForm() {

      },
      submitFilterArgsForm() {

      },
    }
  }
</script>

<style scoped>

</style>
