<template>
  <div>
    <i-modal
      title="配置详情"
      :value="recordDetail"
      @on-cancel="cancle"
      width="50%"
      class="taskDetailModal"
      footer-hide
    >
      <i-row class="taskDetail-wrap">
        <i-col
          span="24"
          class="taskDetail-configure"
          style="height:100%"
        >
          <div class="configure">
            <i-vueJsonEditor
              name="jsonData"
              :mode="'code'"
              lang="zh"
              v-model="spec"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
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
      spec: {}
    }
  },
  props: {
    recordDetail: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object
    }
  },
  watch: {
    detail(newValue) {
      // console.log(newValue)
      this.spec = newValue.spec
    }
  },
  methods: {
    cancle() {
      this.$emit("cancleRecordDetailModal")
    }
  },
}
</script>

<style scoped>
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
>>> .ivu-modal-body {
  height: 100%;
}
>>> .jsoneditor-vue {
  height: 100%;
}
.vueJsonEditor {
  height: 100%;
}
.taskDetail-wrap,
.configure {
  height: 100%;
}
>>> .jsoneditor {
  border: none;
}
>>> .jsoneditor-poweredBy {
  display: none !important;
}
</style>