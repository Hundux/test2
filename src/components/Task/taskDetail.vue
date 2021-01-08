<template>
  <div>
    <i-modal
      title="任务详情"
      :value="taskDetail"
      @on-cancel="cancle"
      width="100%"
      class="taskDetailModal"
      footer-hide
    >
      <i-row class="taskDetail-wrap">
        <i-col
          span="10"
          class="taskDetail-configure"
          style="height:100%"
        >
          <div class="configure">
            <i-vueJsonEditor
              name="jsonData"
              v-model="jsonData"
              :mode="'code'"
              lang="zh"
              v-if="jsonData"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
            <p
              class="noConfigure"
              v-else
            >填写配置</p>
          </div>
        </i-col>
        <i-col
          span="7"
          class="taskDetail-task"
        >
          <i-form
            label-position="right"
            :label-width="100"
            class="taskDetail-form"
          >
            <i-formItem label="名称：">
              <i-input
                style="width:200px"
                :value="task.name"
              ></i-input>
            </i-formItem>
            <i-formItem label="执行计划：">
              <i-select
                style="width:200px"
                :value="task.plan"
                @on-change="planChange"
              >
                <i-option value="定点">定点</i-option>
                <i-option value="定期">定期</i-option>
              </i-select>
            </i-formItem>
            <i-row
              class="form-item"
              v-if="task.plan==='定点'"
              style="marginBottom:10px"
            >
                <i-col span="12">
                  <i-datePicker
                    type="date"
                    placeholder="Select date"
                  ></i-datePicker>
                </i-col>
                <i-col span="12">
                  <i-timePicker
                    type="time"
                    placeholder="Select time"
                  ></i-timePicker>
                </i-col>
            </i-row>
            <i-row
              v-if="task.plan==='定期'"
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
              v-if="task.plan==='定期'"
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
            <i-formItem label="类型：">
              <i-select
                style="width:200px"
                disabled
                :value="task.type"
              >
                <i-option value="执行配置">执行配置</i-option>
                <i-option value="调用服务">调用服务</i-option>
              </i-select>
            </i-formItem>
          </i-form>
          <i-button
            type="text"
            style="marginTop:-20px;marginBottom:20px;color:#057009"
            v-if="task.type=='调用服务'"
            @click="handleServerDetail()"
          >查看服务详情</i-button>
          <!-- 服务详情模态框 -->
          <i-serverDetail
            :serverDetail="serverDetail"
            @cancleServerDetailModal="handleCancleServerDetailModal"
          ></i-serverDetail>

          <div>
            <i-button
              type="primary"
              class="task-determine"
            >确定</i-button>
          </div>
          <p class="taskDetail-wrap-operation">操作栏</p>
          <i-buttongroup
            vertical
            style="width:80%"
          >
            <i-button
              type="success"
              icon="md-play"
            >立即执行</i-button>
            <i-button
              type="error"
              icon="md-trash"
            >禁用</i-button>
            <i-button
              type="primary"
              icon="md-copy"
            >复制</i-button>
            <i-button
              type="warning"
              icon="md-pause"
            >暂停</i-button>
            <i-button
              type="error"
              icon="md-close"
            >终止</i-button>
          </i-buttongroup>
        </i-col>
        <i-col span="7" style="height:100%">
          <div class="log">
            <div class="noLog">
              暂无日志
            </div>
            <div class="log-button">
              <i-button type="primary">查看完整日志</i-button>
            </div>
          </div>
        </i-col>
      </i-row>
    </i-modal>
  </div>
</template>

<script>
import ServerDetail from '../Server/ServerDetail'
export default {
  data() {
    return {
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
      serverDetail: false,
    }
  },
  props: {
    taskDetail: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
    }
  },
  methods: {
    cancle() {
      this.$emit('cancleTaskDetailModal')
    },
    handleServerDetail() {
      this.serverDetail = true
    },
    handleCancleServerDetailModal() {
      this.serverDetail = false
    },
    planChange(newValue) {
      this.$emit('changePlan', newValue)
    }
  },
  components: {
    "i-serverDetail": ServerDetail,
  },
}
</script>

<style  scoped>
>>> .ivu-modal-header {
  text-align: center;
}
>>> .ivu-modal {
  top: 0px !important;
  height: 100%;
  overflow: hidden;
}
>>> .ivu-modal-content {
  height: 100%;
}
>>> .ivu-modal-body{
  height: 100%;
}
.taskDetail-task {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.taskDetail-form{
  min-width: 352px;
}
.taskitem {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.taskDetail-wrap{
  height: 100%;
}
.taskDetail-wrap-operation {
  margin-top: 160px;
  margin-bottom: 10px;
}
.taskDetail-configure-plan {
  margin-left: 110px;
}
.configure {
  width: 98%;
  height: 94%;
  border: 1px solid black;
  margin: 0 auto;
  position: relative;
}
.noConfigure {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 28px;
  color: #ccc;
  transform: translate(-50%, -50%);
}
.log {
  width: 100%;
  height: 94%;
  border: 1px solid black;
  position: relative;
}
.noLog {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 28px;
  color: #ccc;
  transform: translate(-50%, -50%);
}
.log-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
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
.time-col {
  text-align: center;
}
>>> .ivu-form-item-content {
  margin-left: 0px !important;
}
</style>