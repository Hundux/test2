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
          span="18"
          class="serverDetail-configure"
          style="height:100%"
        >
          <div class="configure">
            <i-vueJsonEditor
              name="jsonData"
              v-model="serveDetailData.spec"
              :mode="'code'"
              lang="zh"
              v-if="serveDetailData"
              class="vueJsonEditor"
              @json-change="onJsonChange"
            ></i-vueJsonEditor>
            <p
              class="noConfigure"
              v-else
            >填写配置</p>
          </div>
        </i-col>
        <i-col
          span="6"
          class="serverDetail-server"
        >
          <i-form
            label-position="right"
            :label-width="100"
            class="serverDetail-form"
            v-if="serveDetailData"
          >
            <i-formItem label="名称：">
              <i-input
                style="width:200px"
                v-model="serveDetailData.title"
              ></i-input>
            </i-formItem>
            <i-formItem
              label="所需爬虫数："
              class="form-item"
            >
              <i-input
                v-model="serveDetailData.crawler_count"
                style="width:200px"
                type="number"
              ></i-input>
            </i-formItem>
          </i-form>
          <div
            v-if="serveDetailData.params"
            style="width:100%"
          >
            <i-row
              class="configure-top"
              style="width:100%"
              v-if="serveDetailDataParams.length"
            >
              <i-col
                span="6"
                class="configure-top-one"
              ><span>参数</span></i-col>
              <i-col span="6">默认值</i-col>
              <i-col span="12">描述</i-col>
            </i-row>
          </div>
          <i-row
            class="configure-body"
            :key="index"
            v-for="(item,index) in serveDetailDataParams"
          >
            <i-col
              span="6"
              class="configure-body-one params_name"
            ><span>{{item.name}}：</span>
            </i-col>
            <i-col span="6">
              <i-input
                style="width:85%"
                v-model="item.default"
              ></i-input>
            </i-col>
            <i-col span="12">
              <i-input
                type="textarea"
                style="width:95%"
                v-model="item.description"
              ></i-input>
            </i-col>
          </i-row>
          <div>
            <i-button
              type="primary"
              class="server-determine"
              @click="updateServer"
            >确定</i-button>
          </div>
          <p class="serverDetail-wrap-operation">操作栏</p>
          <i-buttongroup
            vertical
            style="width:80%"
          >
            <i-button
              type="success"
              icon="md-play"
              @click="callService"
              :loading="isPress"
            >立即调用</i-button>
            <i-button
              type="success"
              iicon="md-checkmark"
              v-if="serveDetailData.enabled === false"
              @click="handBanClick('yes')"
            >启用</i-button>
            <i-button
              type="error"
              icon="md-trash"
              v-else
              @click="handBanClick('no')"
            >禁用</i-button>
            <i-button
              type="primary"
              icon="md-copy"
              @click="handleCopyServer"
            >复制</i-button>
          </i-buttongroup>
        </i-col>
      </i-row>
    </i-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serveDetailDataParams: [],
      isPress: false
    }
  },
  props: {
    serverDetail: {
      type: Boolean,
      default: false
    },
    serveDetailData: {
      type: Object
    }
  },
  watch: {
    serveDetailData(newValue) {
      console.log(newValue)
      this.serveDetailDataParams = newValue.params
    }
  },
  methods: {
    cancle() {
      this.$emit('cancleServerDetailModal')
    },
    onJsonChange(value) {
      let jsonData = value
      jsonData = JSON.stringify(jsonData)
      // let res = jsonData.match(/\$\w+?\$/g)
      let res = jsonData.match(/\$\w+?\$/g)
      let params = Array.from(new Set(res))
      let paramsDefault = this.serveDetailData.params
      for (let i = 0; i < params.length; i++) {
        let name = params[i].substr(1, params[i].length - 2)
        params[i] = {
          name: name,
          default: "1",
          description: ""
        }
        paramsDefault.forEach((item) => {
          if (item.name == params[i].name) {
            params[i].default = item.default
            params[i].description = item.description
          }
        })
      }

      console.log(params);
      this.serveDetailDataParams = params
    },
    async updateServer() {
      const self = this
      try {
        if (self.serveDetailData.title == "") {
          self.$Message.error("请输入服务名称")
        } else {
          console.log(self.serveDetailData)
          let service_params = {}
          if (self.serveDetailDataParams) {
            const l = self.serveDetailDataParams.length
            for (let i = 0; i < l; i++) {
              service_params[`service_params_spec-${i}-name`] = self.serveDetailDataParams[i].name
              service_params[`service_params_spec-${i}-default`] = self.serveDetailDataParams[i].default
              service_params[`service_params_spec-${i}-desc`] = self.serveDetailDataParams[i].description
            }
          }
          const res = await self.axios({
            method: "patch",
            url: self.$store.state.baseurl + "api/service/update",
            params: {
              title: self.serveDetailData.title,
              id: self.serveDetailData.id,
              crawler_count: self.serveDetailData.crawler_count,
              spec: self.serveDetailData.spec,
              ...service_params
            }
          })
          console.log(res)
          if (res.data.code == 0) {
            self.cancle()
          } else if (res.data.data == -1) {
            self.$Message.error(res.data.code)
          } else {
            self.$Message.error(res.data.error_message)
          }
        }
      } catch (error) {
        console.log(error);
        self.$Message.error("创建任务错误")
      }
    },
    handleCopyServer() {
      this.$emit("handleCopy", this.serveDetailData)
    },
    async handBanClick(isBan) {
      const self = this
      let xData = {
        "ids-0": self.serveDetailData.id,
        enable: isBan
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/service/enable",
          params: xData
        })
        if (res.data.code == 0) {
          self.cancle()
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    async callService() {
      const self = this
      self.isPress = true
      let xData = {
        id: self.serveDetailData.id,
      }
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/call",
          params: xData
        })
        if (res.data.code === 0) {
          self.isPress = false
          self.cancle()
        } else {
          self.isPress = false
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("运行任务错误")
      }
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
>>> .ivu-modal-body {
  height: 100%;
}
.serverDetail-wrap {
  height: 100%;
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
.server-determine {
  margin-top: 25px;
}
.configure-top-one {
  text-align: right;
}
.configure-top-one span {
  margin-right: 38px;
}
>>> textarea.ivu-input {
  height: 32px;
}
.params_name {
  cursor: pointer;
}
</style>