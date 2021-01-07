<template>
  <div>
    <i-modal
      title="服务详情"
      :value="serverDetail"
      @on-cancel="cancle"
      width="100%"
      class="serverDetailModal"
      footer-hide
    >
      <i-row class="serverDetail-wrap">
        <i-col
          span="10"
          class="serverDetail-configure"
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
          span="5"
          class="serverDetail-server"
        >
          <i-form
            label-position="right"
            :label-width="100"
            class="serverDetail-form"
          >
            <i-formItem label="名称：">
              <i-input style="width:200px"></i-input>
            </i-formItem>
          </i-form>
          <i-row class="configure-top" style="width:100%">
            <i-col
              span="6"
              class="configure-top-one"
            ><span>参数</span></i-col>
            <i-col span="9">默认值</i-col>
            <i-col span="9">描述</i-col>
          </i-row>
          <i-row class="configure-body">
            <i-col
              span="6"
              class="configure-body-one"
            ><span>参数1：</span></i-col>
            <i-col span="9">
              <i-input style="width:85%"></i-input>
            </i-col>
            <i-col span="9">
                <i-input type="textarea" style="width:85%"></i-input>
              </i-col>
          </i-row>
          <i-row class="configure-body">
            <i-col
              span="6"
              class="configure-body-one"
            ><span>参数2：</span></i-col>
            <i-col span="9">
              <i-input style="width:85%"></i-input>
            </i-col>
            <i-col span="9">
                <i-input type="textarea" style="width:85%"></i-input>
              </i-col>
          </i-row>
          <i-row class="configure-body">
            <i-col
              span="6"
              class="configure-body-one"
            ><span>参数3：</span></i-col>
            <i-col span="9">
              <i-input style="width:85%"></i-input>
            </i-col>
            <i-col span="9">
                <i-input type="textarea" style="width:85%"></i-input>
              </i-col>
          </i-row>
          <div>
            <i-button
              type="primary"
              class="server-determine"
            >确定</i-button>
          </div>
          <p class="serverDetail-wrap-operation">操作栏</p>
          <i-buttongroup
            vertical
            style="width:80%"
          >
            <i-button
              type="error"
              icon="md-trash"
            >禁用</i-button>
            <i-button
              type="primary"
              icon="md-copy"
            >复制</i-button>
          </i-buttongroup>
        </i-col>
        <i-col span="9">
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
    }
  },
  props: {
    serverDetail: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit('cancleServerDetailModal')
    }
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
.serverDetail-server {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.serveritem {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.serverDetail-wrap-operation {
  margin-top: 150px;
  margin-bottom: 10px;
}
.serverDetail-configure-plan {
  margin-left: 110px;
}
.configure {
  width: 98%;
  height: 652px;
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
  height: 652px;
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
.serverDetail-form {
  margin-left: -50px;
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
.configure-top {
  margin-top: 15px;
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
.server-determine{
    margin-top: 25px;
}
.configure-top-one{
  text-align: right;
}
.configure-top-one span{
  margin-right: 38px;
}
>>> textarea.ivu-input{
  height: 32px;
}
</style>