<template>
  <div class="task-newtask">
    <i-modal
      title="新建任务"
      :value="newTask"
      @on-cancel="cancle"
      width="1000px"
      footer-hide
    >

      <i-row>
        <i-col span="15">
          <div
            class="configure"
            v-if="taskForm.type==='执行配置'"
          >
            <i-vueJsonEditor
              name="jsonData"
              v-model="jsonData"
              :mode="'code'"
              lang="zh"
              v-if="jsonData"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
          </div>
          <div
            class="configure"
            v-if="taskForm.type==='调用服务'"
          >
            <i-row class="configure-top">
              <i-col
                span="4"
                class="configure-top-one"
              ><span>参数名</span></i-col>
              <i-col span="8">参数值</i-col>
              <i-col span="8">类型</i-col>
              <i-col span="4">默认值</i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数1：</span></i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数2：</span></i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数3：</span></i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
          </div>
        </i-col>
        <i-col span="9">
          <i-form
            label-position="right"
            :label-width="100"
          >
            <i-formItem
              label="执行计划："
              class="form-item"
            >
              <i-select
                v-model="taskForm.plan"
                style="width:250px"
              >
                <i-option value="单次">单次</i-option>
                <i-option value="周期">周期</i-option>
                <i-option value="未计划">未计划</i-option>
              </i-select>
            </i-formItem>

            <i-row>
              <i-formItem
                class="form-item"
                label="定时："
                v-if="taskForm.plan==='单次'"
              >
                <i-col span="12">
                  <i-datePicker
                    type="date"
                    placeholder="Select date"
                    v-model="taskForm.date"
                  ></i-datePicker>
                </i-col>
                <i-col span="12">
                  <i-timePicker
                    type="time"
                    placeholder="Select time"
                    v-model="taskForm.time"
                  ></i-timePicker>
                </i-col>
              </i-formItem>
            </i-row>

            <i-row
              v-if="taskForm.plan==='周期'"
              class="period form-item"
              style="margin-left:20px"
            >
              <i-col
                span="3"
                class="time-col"
              ><span class="time">秒</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">分钟</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">小时</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">天</span></i-col>
              <i-col
                span="5"
                class="time-col"
              ><span class="time">星期几</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">月</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">年</span></i-col>
            </i-row>
            <i-row
              v-if="taskForm.plan==='周期'"
              class="form-item"
              style="margin-bottom:10px;margin-left:20px"
            >
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="5"><input
                  type="number"
                  min="0"
                  style="width:73px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
            </i-row>
            <i-formItem
              label="名称："
              class="form-item"
            >
              <i-input
                v-model="taskForm.name"
                style="width:250px"
              ></i-input>
            </i-formItem>
            <i-formItem
              label="类型："
              class="form-item"
            >
              <i-select
                v-model="taskForm.type"
                style="width:250px"
              >
                <i-option value="执行配置">执行配置</i-option>
                <i-option value="调用服务">调用服务</i-option>
              </i-select>
            </i-formItem>
            <i-formItem
              label="服务："
              class="form-item"
              v-if="taskForm.type==='调用服务'"
            >
              <i-select
                v-model="taskForm.service"
                style="width:250px"
              >
                <i-option value="服务1">服务1</i-option>
                <i-option value="服务2">服务2</i-option>
              </i-select>
            </i-formItem>
          </i-form>
          <div class="determine">
            <i-button type="primary">确定</i-button>
          </div>
        </i-col>
      </i-row>
    </i-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskForm: {
        plan: '',
        name: '',
        type: '执行配置',
        date: '',
        time: '',
        service: ''
      },
      jsonData: {
        "name": "sccm",
        "version": "0.1.0",
        "lockfileVersion": 1,
        "requires": true,
        "dependencies": {
          "@babel/code-frame": {
            "version": "7.12.11",
            "resolved": "https://registry.npm.taobao.org/@babel/code-frame/download/@babel/code-frame-7.12.11.tgz?cache=0&sync_timestamp=1608076875397&other_urls=https%3A%2F%2Fregistry.npm.taobao.org%2F%40babel%2Fcode-frame%2Fdownload%2F%40babel%2Fcode-frame-7.12.11.tgz",
            "integrity": "sha1-9K1DWqJj25NbjxDyxVLSP7cWpj8=",
            "dev": true,
            "requires": {
              "@babel/highlight": "^7.10.4"
            }
          },
        },
        "@babel/compat-data": {
          "version": "7.12.7",
          "resolved": "https://registry.npm.taobao.org/@babel/compat-data/download/@babel/compat-data-7.12.7.tgz",
          "integrity": "sha1-kym0eCp9a71+71fhGt35HuPvHkE=",
          "dev": true
        },
        "@babel/core": {
          "version": "7.12.10",
          "resolved": "https://registry.npm.taobao.org/@babel/core/download/@babel/core-7.12.10.tgz?cache=0&sync_timestamp=1607568968691&other_urls=https%3A%2F%2Fregistry.npm.taobao.org%2F%40babel%2Fcore%2Fdownload%2F%40babel%2Fcore-7.12.10.tgz",
          "integrity": "sha1-t5ouG59w7T2Eu/ttjE74JfYGvM0=",
          "dev": true,
          "requires": {
            "@babel/code-frame": "^7.10.4",
            "@babel/generator": "^7.12.10",
            "@babel/helper-module-transforms": "^7.12.1",
            "@babel/helpers": "^7.12.5",
            "@babel/parser": "^7.12.10",
            "@babel/template": "^7.12.7",
            "@babel/traverse": "^7.12.10",
            "@babel/types": "^7.12.10",
            "convert-source-map": "^1.7.0",
            "debug": "^4.1.0",
            "gensync": "^1.0.0-beta.1",
            "json5": "^2.1.2",
            "lodash": "^4.17.19",
            "semver": "^5.4.1",
            "source-map": "^0.5.0"
          }
        },
        "@babel/generator": {
          "version": "7.12.11",
          "resolved": "https://registry.npm.taobao.org/@babel/generator/download/@babel/generator-7.12.11.tgz?cache=0&sync_timestamp=1608076880719&other_urls=https%3A%2F%2Fregistry.npm.taobao.org%2F%40babel%2Fgenerator%2Fdownload%2F%40babel%2Fgenerator-7.12.11.tgz",
          "integrity": "sha1-mKffe4w1jJo3qweiQFaFMBaro68=",
          "dev": true,
          "requires": {
            "@babel/types": "^7.12.11",
            "jsesc": "^2.5.1",
            "source-map": "^0.5.0"
          }
        },
        "@babel/helper-annotate-as-pure": {
          "version": "7.12.10",
          "resolved": "https://registry.npm.taobao.org/@babel/helper-annotate-as-pure/download/@babel/helper-annotate-as-pure-7.12.10.tgz?cache=0&sync_timestamp=1607584028947&other_urls=https%3A%2F%2Fregistry.npm.taobao.org%2F%40babel%2Fhelper-annotate-as-pure%2Fdownload%2F%40babel%2Fhelper-annotate-as-pure-7.12.10.tgz",
          "integrity": "sha1-VKubAA5gqTZEzhez830xOq8dEV0=",
          "dev": true,
          "requires": {
            "@babel/types": "^7.12.10"
          }
        },
      },
    }
  },
  props: {
    newTask: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit("cancleNewServeModal")
    }
  }
}
</script>

<style scoped>
>>> .ivu-modal-header {
  text-align: center;
}
>>> .ivu-modal-footer {
  text-align: center;
}
>>> .ivu-form-item-content {
  margin-left: 0 !important;
}
>>> .ivu-modal {
  top: 15px !important;
}
.time-col{
  text-align: center;
}
.configure {
  width: 600px;
  height: 610px;
  border: 1px solid black;
  margin: 0 auto;
}
.configure-top {
  margin-top: 15px;
}
.configure-top-one {
  text-align: center;
}
.configure-body {
  margin-top: 15px;
}
.configure-body-one {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
>>> .ivu-date-picker-rel {
  width: 250px;
}
.determine {
  display: flex;
  justify-content: center;
}
.vueJsonEditor {
  height: 100%;
}
>>> .jsoneditor-vue {
  height: 100%;
}
>>> .jsoneditor {
  border: none;
}
>>> .jsoneditor-poweredBy {
  display: none !important;
}
</style>