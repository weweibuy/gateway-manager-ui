<template>
  <div>
    <el-form ref="filterCreateForm" :inline="true" :model="filterCreateForm" :rules="rules" label-width="120px"
             label-suffix>
      <el-form-item label="路由id" prop="routerId">
        <el-input :disabled="true" v-model="filterCreateForm.routerId" style="width: 350px"></el-input>
      </el-form-item>


      <el-form-item label="断言name" prop="filterName">
        <el-select style="width: 350px" v-model="filterCreateForm.filterName" placeholder="请选择或直接输入"
                   filterable
                   allow-create
                   default-first-option @change="handleFilterNameChange">

          <el-option
            v-for="item in dictFilters"
            :key="item.dictValue"
            :label="item.dictValue"
            :value="item.dictValue">
            <span style="float: left">{{ item.dictValue }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dictDesc }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="过滤器描述" prop="filterDesc">
        <el-input v-model="filterCreateForm.filterDesc" style="width: 350px"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input type=tel v-model="filterCreateForm.priority" style="width: 350px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="isUse">
        <el-select v-model="filterCreateForm.isUse" style="width: 350px" placeholder="请选择状态">
          <el-option label="使用" value="true"></el-option>
          <el-option label="停用" value="false"></el-option>
        </el-select>
      </el-form-item>


      <div v-for="(site, index) in filterCreateForm.filterArgs" style="margin-left: 20px">

        <el-collapse value="1">
          <el-collapse-item name="1">
            <template slot="title">
              <h4>{{filterCreateForm.filterName }} &nbsp;过滤器参数</h4><i class="header-icon el-icon-info"></i>
            </template>

            <el-form-item label="参数名" prop="filterArgs.argsName">
              <el-select v-model="filterCreateForm.filterArgs[index].argsName" style="width: 350px"
                         placeholder="请选择参数名"
                         @change="handleFilterArgsNameChange($event, index)">
                <el-option
                  v-for="item in dictFilterArgs"
                  :key="item.dictName"
                  :label="item.dictValue"
                  :value="item.dictValue">
                  <span style="float: left">{{ item.dictValue }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dictDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="dictFilterArgsDict[index] == undefined || dictFilterArgsDict.length == 0"
                          label="参数值"
                          prop="filterArgs.argsValue">
              <el-input v-model="filterCreateForm.filterArgs[index].argsValue" style="width: 350px"></el-input>
            </el-form-item>

            <el-form-item v-if="dictFilterArgsDict[index] != undefined && dictFilterArgsDict[index].length != 0"
                          label="参数值" prop="filterArgs.argsValue">
              <el-select v-model="filterCreateForm.filterArgs[index].argsValue" style="width: 350px"
                         placeholder="请选择参数值">
                <el-option
                  v-for="item in dictFilterArgsDict[index]"
                  :key="item.dictName"
                  :label="item.dictValue"
                  :value="item.dictValue">
                  <span style="float: left">{{ item.dictValue }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dictDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-button id="freshBtn" v-show="false"></el-button>


            <el-form-item label="参数描述" prop="filterArgs.argsDesc">
              <el-input v-model="filterCreateForm.filterArgs[index].argsDesc" style="width: 350px"></el-input>
            </el-form-item>


            <el-form-item>
              <el-button style="margin-left: 400px" type="danger" v-show="filterCreateForm.filterArgs.length > 1"
                         @click="handleDeleteFilterArg(index)">删除
              </el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div style="margin-left: 800px; margin-top: 30px">
        <el-form-item>
          <el-button type="primary" :disabled="disableSubmitBtn"
                     @click="submitFilterCreateForm('filterCreateForm')">
            保存
          </el-button>
          <el-button @click="resetFilterCreateForm('filterCreateForm')">取消</el-button>
          <el-button @click="handleAddFilterArgGroup">增加</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

  import FilterArgs from './FilterArgs'
  import {MessageBox, Message} from 'element-ui'
  import {getRouterFilters, getChildByPid} from '@/api/dict'
  import {addFilter} from '@/api/filter'


  export default {
    name: "FilterCreateForm",

    data() {
      var validatePriority = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (!/^[0-9]\d*$/.test(value)) {
          return callback(new Error('优先级必须是数字,且最小为0'));
        } else {
          callback();
        }
      }
      return {
        routerId: '',
        disableSubmitBtn: false,
        filterCreateForm: {
          routerId: '',
          isUse: 'true',
          filterArgs: [{
            argsName: '',
            argsValue: '',
            argsDesc: '',
            dictId: '',
            dictType: ''
          }],
        },
        dictFilters: [],
        dictFilterArgs: [],
        dictFilterArgsDict: [],
        dictFilterArgsHavingValues: false,
        rules: {
          routerId: [
            {required: true, message: '请输入路由id', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          filterName: [
            {required: true, message: '请输入过滤器name', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 63 个字符', trigger: 'blur'}
          ],
          filterDesc: [
            {required: true, message: '请输入过滤器描述', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 63 个字符', trigger: 'blur'}
          ],
          isUse: [
            {required: true, message: '必须选择是否使用', trigger: 'blur'},
          ],
          priority: [
            {required: true, validator: validatePriority, trigger: 'blur'},
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
      this.getRouterFilterList()
    },
    methods: {
      submitFilterCreateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createFilter()
          } else {
            return false;
          }
        });
      },
      createFilter() {
        this.disableSubmitBtn = true
        addFilter(this.filterCreateForm).then(response => {
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
      resetFilterCreateForm(formName) {
        this.$refs[formName].resetFields();
        this.filterCreateForm.filterArgs = []
        this.filterCreateForm.filterArgs.push({})
        this.filterCreateForm.routerId = this.routerId;
      },
      handlerRouterIdChange(routerId) {
        this.routerId = routerId
        this.filterCreateForm.routerId = this.routerId
      },
      handleFilterNameChange(value) {
        for (let i = 0; i < this.dictFilters.length; i++) {
          if (this.dictFilters[i].dictValue == value) {
            this.filterCreateForm.filterDesc = this.dictFilters[i].dictDesc
            this.filterCreateForm.dictId = this.dictFilters[i].id
          }
        }
        this.handlerFilterDictIdChange(this.filterCreateForm.dictId)
      },
      handleFilterArgsNameChange(value, index) {
        for (let i = 0; i < this.dictFilterArgs.length; i++) {
          if (this.dictFilterArgs[i].dictValue == value) {
            this.filterCreateForm.filterArgs[index].argsDesc = this.dictFilterArgs[i].dictDesc
            this.filterCreateForm.filterArgs[index].dictId = this.dictFilterArgs[i].id
            this.filterCreateForm.filterArgs[index].dictType = this.dictFilterArgs[i].dictType
          }
        }
        this.handleFilterArgsDictIdChange(this.filterCreateForm.filterArgs[index].dictId, index)
        this.filterCreateForm.filterArgs[index].argsValue = '';
      },
      handleDeleteFilterArg(index) {
        this.filterCreateForm.filterArgs.splice(index, 1)
      },
      handleAddFilterArgGroup() {
        // if (this.filterCreateForm.filterName == null ||
        //   this.filterCreateForm.filterArgs[this.filterCreateForm.filterArgs.length - 1].argsValue == '' ||
        //   this.filterCreateForm.filterArgs[this.filterCreateForm.filterArgs.length - 1].argsValue == null) {
        //   MessageBox({
        //     message: '请先完成上一个步骤',
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        //   return;
        // }
        this.filterCreateForm.filterArgs.push({})
      },
      getRouterFilterList() {
        getRouterFilters().then(response => {
          this.dictFilters = response.data
        }).catch(error => {

        }).finally(() => {
        })
      },
      handlerFilterDictIdChange(dictId) {
        getChildByPid(dictId).then(response => {
          this.dictFilterArgs = response.data
        })
      },
      handleFilterArgsDictIdChange(dictId, index) {
        getChildByPid(dictId).then(response => {
          if (response.data != null && response.data.length > 0) {
            this.dictFilterArgsDict[index] = response.data
            this.dictFilterArgsDict.push({})
          } else {
            this.dictFilterArgsDict = []
            this.dictFilterArgsDict.push({})
            this.dictFilterArgsDict.pop()
          }
        }).finally(() => {
        })
      },

    }
  }
</script>

<style scoped>

</style>
