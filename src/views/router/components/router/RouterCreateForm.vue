<template>
  <div>
    <el-form ref="routerCreateForm" :disabled="disableForm" :inline="true" :model="routerCreateForm" :rules="rules"
             label-width="120px"
             label-suffix>
      <el-form-item label="路由id" prop="routerId">
        <el-input v-model="routerCreateForm.routerId" @change="handlerRouterIdChange" style="width: 350px"></el-input>
      </el-form-item>

      <el-form-item label="服务id" prop="status">
        <el-select v-model="routerCreateForm.systemId" style="width: 350px" placeholder="请选择服务id"
                   @change="handleSystemIdChange">
          <el-option
            v-for="item in systemList"
            :key="item.dictName"
            :label="item.systemId"
            :value="item.systemId">
            <span style="float: left">{{ item.systemId }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.systemName }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服务名称" prop="systemName">
        <el-input :disabled="true" v-model="routerCreateForm.systemName" style="width: 350px"></el-input>
      </el-form-item>


      <el-form-item label="服务url" prop="uri">
        <el-select v-model="routerCreateForm.uri" style="width: 350px" placeholder="请选择服务url"
        >
          <el-option-group
            v-for="group in systemUrlType"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-option-group>

        </el-select>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-input type=tel v-model="routerCreateForm.priority" style="width: 350px"></el-input>
      </el-form-item>
      <el-form-item label="使用使用" prop="isUse">
        <el-select v-model="routerCreateForm.isUse" style="width: 350px" placeholder="请选择状态">
          <el-option label="使用" value="true"></el-option>
          <el-option label="停用" value="false"></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-left: 800px">
        <el-form-item>
          <el-button type="primary" :disabled="disableSubmitBtn" @click="submitRouterCreateForm('routerCreateForm')">
            保存
          </el-button>
          <el-button @click="resetRouterCreateForm('routerCreateForm')">取消</el-button>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>

  import {addRouter} from '@/api/router'
  import {getAccessSystems} from '@/api/system'
  import {MessageBox, Message} from 'element-ui'

  export default {
    name: "RouterCreateForm",
    props: ['routerId'],
    data() {
      var validatePriority = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (!/^[0-9]\d*$/.test(value)) {
          return callback(new Error('优先级必须是数据,且最小为0'));
        } else {
          callback();
        }
      }
      return {
        activeNames: ['1'],
        disableSubmitBtn: false,
        disableForm: false,
        routerCreateForm: {
          routerId: '',
          systemId: '',
          systemName: '',
          uri: '',
          priority: '',
          isUse: 'true',
        },
        systemList: [],
        systemUrlType: [{
          label: 'lb',
          options: []
        }, {
          label: 'domain',
          options: []
        }],
        rules: {
          routerId: [
            {required: true, message: '请输入路由id', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          systemId: [
            {required: true, message: '请输入服务id', trigger: 'blur'},
            {min: 1, max: 63, message: '长度在 1 到 63 个字符', trigger: 'blur'}
          ],
          systemName: [
            {required: true, message: '请输入服务名', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 63 个字符', trigger: 'blur'}
          ],
          uri: [
            {required: true, message: '请输入uri', trigger: 'blur'},
            {min: 3, max: 63, message: '长度在 3 到 127 个字符', trigger: 'blur'}
          ],
          priority: [
            {validator: validatePriority, trigger: 'blur'},
          ],
          isUse: [
            {required: true, message: '必须选择状态', trigger: 'blur'},
          ],
        }
      }
    },
    created() {
      this.getAccessSystemList();
    },
    methods: {
      submitRouterCreateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createRouter()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetRouterCreateForm(formName) {
        this.$refs[formName].resetFields();
      },
      createRouter() {
        this.disableSubmitBtn = true
        addRouter(this.routerCreateForm).then(response => {
          this.disableForm = true
          MessageBox({
            message: "创建成功",
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
      resetRouterCreateForm(formName) {
        this.$refs[formName].resetFields();
      },
      getAccessSystemList() {
        getAccessSystems().then(response => {
          this.systemList = response.data.accessSystems
        })
      },
      handleSystemIdChange(systemId) {
        for (let i = 0; i < this.systemList.length; i++) {
          if (this.systemList[i].systemId == systemId) {
            this.routerCreateForm.systemName = this.systemList[i].systemName
            this.systemUrlType[0].options[0] = this.systemList[i].lbUri
            this.systemUrlType[1].options[0] = this.systemList[i].systemDomain
          }
        }
      },
      handlerRouterIdChange(value) {
        this.$emit("routerIdChange", value)
      }

    }
  }
</script>

<style scoped>

</style>
