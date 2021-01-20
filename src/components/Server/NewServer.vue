<template>
  <div class="task-newtask">
    <i-modal
      title="新建服务"
      :value="newServer"
      @on-cancel="cancle"
      width="100%"
      footer-hide
    >

      <i-row style="height:100%">
        <i-col
          span="18"
          style="height:100%"
        >
          <div class="configure">
            <i-vueJsonEditor
              name="jsonData"
              v-model="jsonData"
              :mode="'code'"
              lang="zh"
              v-if="jsonData"
              @json-change="onJsonChange"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
          </div>
        </i-col>
        <i-col span="6">
          <i-form
            label-position="right"
            :label-width="100"
            class="titleForm"
          >
            <i-formItem
              label="名称："
              class="form-item"
            >
              <i-input
                v-model="newServe.title"
                style="width:250px"
              ></i-input>
            </i-formItem>
            <i-formItem
              label="所需爬虫数："
              class="form-item"
            >
              <i-input
                v-model="newServe.crawler_count"
                style="width:250px"
                type="number"
              ></i-input>
            </i-formItem>
          </i-form>
          <div v-if="paramsData!=null">
            <div v-if="paramsData.length">
              <i-row class="configure-top">
                <i-col
                  span="6"
                  class="configure-top-one"
                ><span>参数</span></i-col>

                <i-col span="6">默认值</i-col>
                <i-col span="12">描述</i-col>
              </i-row>
              <i-row
                class="configure-body"
                :key="index"
                v-for="(item,index) in paramsData"
              >
                <i-col
                  span="6"
                  class="configure-body-one"
                ><span>{{item.name}}：</span></i-col>

                <i-col span="6">
                  <i-input
                    style="width:85%"
                    v-model="item.default"
                  ></i-input>
                </i-col>
                <i-col span="12">
                  <i-input
                    type="textarea"
                    style="width:85%"
                    v-model="item.description"
                  ></i-input>
                </i-col>
              </i-row>
            </div>
          </div>
          <div class="determine">
            <i-button
              type="primary"
              @click="creatServer"
            >确定</i-button>
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
      newServe: {
        title: '',
        service: '',
        crawler_count: 1
      },
      jsonData: {
        // "appid": "$参数1$",
        // "crawlid": "$参数2$",
        // "url": "$参数3$",
        // "spiderid": "$参数1$",
      },
      paramsData: []
    }
  },
  props: {
    newServer: {
      type: Boolean,
      default: false
    },
    copyServe: {
      type: Object
    }
  },
  watch: {
    copyServe(newValue) {
      if (newValue.id) {
        this.newServe.title = newValue.title + "(copy)"
        this.jsonData = newValue.spec
        this.paramsData = newValue.params
      }
    }
  },
  methods: {
    cancle() {
      this.$emit("cancleNewServerModal")
    },
    async creatServer() {
      const self = this
      try {
        if (self.newServe.title == "") {
          self.$Message.error("请输入服务名称")
        } else {
          let service_params = {}
          if (self.paramsData != null) {
            const l = self.paramsData.length
            for (let i = 0; i < l; i++) {
              service_params[`service_params_spec-${i}-name`] = self.paramsData[i].name
              service_params[`service_params_spec-${i}-default`] = self.paramsData[i].default
              service_params[`service_params_spec-${i}-desc`] = self.paramsData[i].description
            }
          }
          const res = await self.axios({
            method: "post",
            url: self.$store.state.baseurl + "api/service/create",
            params: {
              title: self.newServe.title,
              spec: self.jsonData,
              crawler_count: self.newServe.crawler_count,
              ...service_params
            }
          })
          // console.log(res)
          if (res.data.code == 0) {
            self.cancle()
          } else if (res.data.data == -1) {
            self.$Message.error(res.data.code)
          } else {
            self.$Message.error(res.data.error_message)
          }
        }
      } catch (error) {
        self.$Message.error("创建任务错误")
      }
    },
    onJsonChange(value) {
      console.log(value)
      this.jsonData = value
      let jsonData = value
      jsonData = JSON.stringify(jsonData)
      let res = jsonData.match(/\$.*?\$/g)
      let params = Array.from(new Set(res))
      for (let i = 0; i < params.length; i++) {
        let name = params[i].substr(1, params[i].length - 2)
        params[i] = {
          name: name,
          default: "1",
          description: ""
        }
      }
      this.paramsData = params
    }
  }
}
</script>

<style scoped>
>>> .ivu-modal {
  top: 0px !important;
  height: 100%;
  overflow: hidden;
}
>>> .ivu-modal-content {
  height: 100%;
}
>>> .ivu-modal-header {
  text-align: center;
}
>>> .ivu-modal-body {
  height: 100%;
}
.time-col {
  text-align: center;
}
.configure {
  width: 100%;
  height: 94%;
  border: 1px solid black;
  margin: 0 auto;
}
.configure-top {
  margin-top: 15px;
}
.configure-top-one {
  text-align: right;
}
.configure-top-one span {
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
>>> textarea.ivu-input {
  height: 32px;
}
.titleForm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: -12px;
}
</style>