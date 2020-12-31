<template>
  <div class="task-newtask">
    <i-modal
      title="新建服务"
      :value="newServer"
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
        </i-col>
        <i-col span="9">
          <i-form
            label-position="right"
            :label-width="60"
          >
            <i-formItem
              label="名称："
              class="form-item"
            >
              <i-input
                v-model="taskForm.name"
                style="width:250px"
              ></i-input>
            </i-formItem>
          </i-form>
          <div>
            <i-row class="configure-top">
              <i-col
                span="11"
                class="configure-top-one"
              ><span>参数</span></i-col>

              <i-col span="13">默认值</i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="11"
                class="configure-body-one"
              ><span>参数1：</span></i-col>

              <i-col span="13">
                <i-input
                  style="width:60%"
                  value='"1"'
                ></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="11"
                class="configure-body-one"
              ><span>参数2：</span></i-col>

              <i-col span="13">
                <i-input
                  style="width:60%"
                  value='"1"'
                ></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="11"
                class="configure-body-one"
              ><span>参数3：</span></i-col>

              <i-col span="13">
                <i-input style="width:60%" value='"1"'></i-input>
              </i-col>
            </i-row>
          </div>
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
    newServer: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit("cancleNewServerModal")
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
.time-col {
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
  text-align: right;
}
.configure-top-one span{
  margin-right: 12px;
}
.configure-body {
  margin-top: 15px;
}
.configure-body-one {
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
>>> .ivu-date-picker-rel {
  width: 250px;
}
.determine {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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