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
        <i-col span="18" style="height:100%">
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
        <i-col span="6">
          <i-form
            label-position="right"
            :label-width="60"
            class="titleForm"
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
                span="6"
                class="configure-top-one"
              ><span>参数</span></i-col>

              <i-col span="6">默认值</i-col>
              <i-col span="12">描述</i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="6"
                class="configure-body-one"
              ><span>参数1：</span></i-col>

              <i-col span="6">
                <i-input
                  style="width:85%"
                  value='"1"'
                ></i-input>
              </i-col>
              <i-col span="12">
                <i-input
                  type="textarea"
                  style="width:85%"
                ></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="6"
                class="configure-body-one"
              ><span>参数2：</span></i-col>

              <i-col span="6">
                <i-input
                  style="width:85%"
                  value='"1"'
                ></i-input>
              </i-col>
              <i-col span="12">
                <i-input
                  type="textarea"
                  style="width:85%"
                ></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="6"
                class="configure-body-one"
              ><span>参数3：</span></i-col>

              <i-col span="6">
                <i-input
                  style="width:85%"
                  value='"1"'
                ></i-input>
              </i-col>
              <i-col span="12">
                <i-input
                  type="textarea"
                  style="width:85%"
                ></i-input>
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
      jsonData: {}
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
>>> .ivu-modal-body{
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
>>> textarea.ivu-input{
  height: 32px;
}
.titleForm{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -12px;
}
</style>