<template>
  <div>

    <el-form ref="predicateCreateForm" :inline="true" :rules="rules" :model="predicateCreateForm" label-width="120px"
             label-suffix>

      <el-form-item label="路由id" prop="routerId">
        <el-input v-model="predicateCreateForm.routerId" :disabled="true" style="width: 350px"></el-input>
      </el-form-item>

      <el-form-item label="断言name" prop="predicateName">
        <el-select style="width: 350px" v-model="predicateCreateForm.predicateName" placeholder="请选择或直接输入"
                   filterable
                   allow-create
                   default-first-option @change="handlePredicateNameChange">

          <el-option
            v-for="item in dictPredicates"
            :key="item.dictValue"
            :label="item.dictValue"
            :value="item.dictValue">
            <span style="float: left">{{ item.dictValue }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dictDesc }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="字典id" v-show="false" prop="dictId">
        <el-input v-model="predicateCreateForm.dictId" style="width: 350px"></el-input>
      </el-form-item>

      <el-form-item label="断言描述" prop="predicateDesc">
        <el-input v-model="predicateCreateForm.predicateDesc" style="width: 350px"></el-input>
      </el-form-item>
      <el-form-item label="使用状态" prop="isUse">
        <el-select v-model="predicateCreateForm.isUse" style="width: 350px" placeholder="请选择使用状态">
          <el-option label="使用" value="true"></el-option>
          <el-option label="停用" value="false"></el-option>
        </el-select>
      </el-form-item>


      <div v-for="(site, index) in predicateCreateForm.predicateArgs" style="margin-left: 20px">

        <el-collapse value="1">
          <el-collapse-item name="1">
            <template slot="title">
              <h4>{{predicateCreateForm.predicateName }} &nbsp;断言参数</h4><i class="header-icon el-icon-info"></i>
            </template>

            <el-form-item label="参数名" prop="predicateArgs.argsName">
              <el-select v-model="predicateCreateForm.predicateArgs[index].argsName" style="width: 350px"
                         placeholder="请选择参数名"
                         @change="handlePredicateArgsNameChange($event, index)">
                <el-option
                  v-for="item in dictPredicateArgs"
                  :key="item.dictName"
                  :label="item.dictValue"
                  :value="item.dictValue">
                  <span style="float: left">{{ item.dictValue }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dictDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="参数值" prop="predicateArgs.argsValue">
              <el-input v-model="predicateCreateForm.predicateArgs[index].argsValue" style="width: 350px"></el-input>
            </el-form-item>
            <el-form-item label="参数描述" prop="predicateArgs.argsDesc">
              <el-input v-model="predicateCreateForm.predicateArgs[index].argsDesc" style="width: 350px"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button style="margin-left: 400px" type="danger" v-show="predicateCreateForm.predicateArgs.length > 1"
                         @click="handleDeletePredicateArg(index)">删除
              </el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div style="margin-left: 800px; margin-top: 30px">
        <el-form-item>
          <el-button type="primary" :disabled="disableSubmitBtn"
                     @click="submitPredicateCreateForm('predicateCreateForm')">
            保存
          </el-button>
          <el-button @click="resetPredicateCreateForm('predicateCreateForm')">取消</el-button>

          <el-button @click="handleAddPredicateArgGroup">增加</el-button>

        </el-form-item>
      </div>

    </el-form>

  </div>
</template>

<script>
  import PredicateArgs from './PredicateArgs'
  import {getRouterPredicates, getChildByPid} from '@/api/dict'
  import {addPredicate} from '@/api/predicate'
  import {MessageBox, Message} from 'element-ui'

  export default {
    name: "PredicateCreateForm",
    data() {
      return {
        disableSubmitBtn: false,
        routerId: '',
        predicateCreateForm: {
          routerId: '',
          isUse: 'true',
          predicateArgs: [{
            argsName: '',
            argsValue: '',
            argsDesc: '',
            dictId: '',
            dictType: ''
          }],
        },
        dictPredicates: [],
        dictPredicateArgs: [],
        rules: {
          routerId: [
            {required: true, message: '请输入路由id', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          predicateName: [
            {required: true, message: '请输入断言name', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 63 个字符', trigger: 'blur'}
          ],
          predicateDesc: [
            {required: true, message: '请输入断言描述', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 63 个字符', trigger: 'blur'}
          ],
          isUse: [
            {required: true, message: '必须选择状态', trigger: 'blur'},
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
      this.getRouterPredicateList()
    },
    methods: {
      submitPredicateCreateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createPredicate()
          } else {
            return false;
          }
        });
      },
      resetPredicateCreateForm(formName) {
        this.$refs[formName].resetFields();
        this.predicateCreateForm.predicateArgs = []
        this.predicateCreateForm.predicateArgs.push({})
        this.predicateCreateForm.routerId = this.routerId;
      },
      createPredicate() {
        this.disableSubmitBtn = true
        addPredicate(this.predicateCreateForm).then(response => {
          MessageBox({
            message: '新增成功',
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(error => {
          MessageBox({
            message: error.response.data.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }).finally(() => {
          this.disableSubmitBtn = false
        })
      },
      getRouterPredicateList() {
        getRouterPredicates().then(response => {
          this.dictPredicates = response.data
        }).catch(error => {

        }).finally(() => {

        })
      },
      handlePredicateNameChange(dictValue) {
        for (let i = 0; i < this.dictPredicates.length; i++) {
          if (this.dictPredicates[i].dictValue == dictValue) {
            this.predicateCreateForm.predicateDesc = this.dictPredicates[i].dictDesc
            this.predicateCreateForm.dictId = this.dictPredicates[i].id
          }
        }
        this.handlerPredicateDictIdChange(this.predicateCreateForm.dictId)
      },
      handlerRouterIdChange(routerId) {
        this.routerId = routerId
        this.predicateCreateForm.routerId = this.routerId;
      },
      handlerPredicateDictIdChange(dictId) {
        getChildByPid(dictId).then(response => {
          this.dictPredicateArgs = response.data
        }).catch(error => {

        }).finally(() => {

        })
      },
      handlePredicateArgsNameChange(value, index) {
        for (let i = 0; i < this.dictPredicateArgs.length; i++) {
          if (this.dictPredicateArgs[i].dictValue == value) {
            this.predicateCreateForm.predicateArgs[index].argsDesc = this.dictPredicateArgs[i].dictDesc
            this.predicateCreateForm.predicateArgs[index].dictId = this.dictPredicateArgs[i].id
            this.predicateCreateForm.predicateArgs[index].dictType = this.dictPredicateArgs[i].dictType
          }
        }
      },
      handleAddPredicateArgGroup() {

        if (this.predicateCreateForm.predicateName == null ||
          this.predicateCreateForm.predicateArgs[this.predicateCreateForm.predicateArgs.length - 1].argsValue == '' ||
          this.predicateCreateForm.predicateArgs[this.predicateCreateForm.predicateArgs.length - 1].argsValue == null) {
          MessageBox({
            message: '请先完成上一个步骤',
            type: 'error',
            duration: 5 * 1000
          })
          return;
        }
        this.predicateCreateForm.predicateArgs.push({})
      },
      handleDeletePredicateArg(index) {
        this.predicateCreateForm.predicateArgs.splice(index, 1)
      }

    }
  }
</script>

<style scoped>

</style>
