<template>
  <div style="margin-left: 20px">
    <el-collapse value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <h4>断言参数</h4><i class="header-icon el-icon-info"></i>
        </template>

        <el-form ref="predicateArgsForm" :inline="true" :model="predicateArgsForm" :rules="rules"
                 label-width="120px"
                 label-suffix>
          <el-form-item label="断言id" prop="predicateId">
            <el-input v-model="predicateArgsForm.predicateId" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数名" prop="argsName">
            <el-input v-model="predicateArgsForm.argsName" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数值" prop="argsValue">
            <el-input v-model="predicateArgsForm.argsValue" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数描述" prop="argsDesc">
            <el-input v-model="predicateArgsForm.argsDesc" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="参数类型" prop="dictType">
            <el-input v-model="predicateArgsForm.dictType" style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="字典Id" prop="dictId">
            <el-input v-model="predicateArgsForm.dictId" style="width: 350px"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="predicateArgsForm.status" style="width: 350px" placeholder="请选择状态">
              <el-option label="使用" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <div style="margin-left: 800px">
            <el-form-item>
              <el-button type="primary" :disabled="disableSubmitBtn"
                         @click="submitPredicateArgsForm('predicateArgsForm')">
                保存
              </el-button>
              <el-button @click="resetPredicateArgsForm('predicateArgsForm')">取消</el-button>
            </el-form-item>
          </div>
        </el-form>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import {getPredicateArgs} from '@/api/dict'
  import {addPredicateArgs} from '@/api/predicate-args'


  export default {
    name: "PredicateArgs",
    data() {
      return {
        disableSubmitBtn: false,
        predicateArgsForm: {
          status: '0'
        },
        dictPredicateArgs: [],
        rules: {
          predicateId: [
            {required: true, message: '请输入断言Id', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          argsName: [
            {required: true, message: '请输入参数名', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          argsValue: [
            {required: true, message: '请输入参数值', trigger: 'blur'},
            {min: 1, max: 127, message: '长度在 1 到 127 个字符', trigger: 'blur'}
          ],
          argsDesc: [
            {required: true, message: '请输入对参数的描述', trigger: 'blur'},
            {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getPredicateArgList()
    },
    methods: {
      submitPredicateArgsForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createPredicateArgs()
          } else {
            return false;
          }
        });
      },
      resetPredicateArgsForm(formName) {
        this.$refs[formName].resetFields();
      },
      createPredicateArgs() {
        addPredicateArgs(this.predicateArgsForm).then(response => {

        }).catch(error => {
          alert("失败")
        }).finally(() => {
          this.disableSubmitBtn = false
        })
      },
      getPredicateArgList() {
        getPredicateArgs().then(response => {
          this.dictPredicateArgs = response.data
        }).catch(error => {

        }).finally(() => {

        })
      },
      handlePredicateNameChange(dictValues) {
        for (let i = 0; i < this.dictPredicateArgs.length; i++) {
          if (this.dictPredicateArgs[i].dictValues == dictValues) {
            this.predicateArgsForm.FilterDesc = this.dictPredicateArgs[i].dictDesc
            this.predicateArgsForm.dictId = this.dictPredicateArgs[i].id
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
