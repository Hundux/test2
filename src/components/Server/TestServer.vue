<template>
  <div>
    <i-modal
      title="测试调用"
      :value="testServer"
      @on-cancel="cancle"
      class="serverDetailModal"
    >
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
          <i-input style="width:60%" value='"1"'></i-input>
        </i-col>
      </i-row>
      <i-row class="configure-body">
        <i-col
          span="11"
          class="configure-body-one"
        ><span>参数2：</span></i-col>
        <i-col span="13">
          <i-input style="width:60%"  value='"1"'></i-input>
        </i-col>
      </i-row>
      <i-row class="configure-body">
        <i-col
          span="11"
          class="configure-body-one"
        ><span>参数3：</span></i-col>
        <i-col span="13">
          <i-input style="width:60%"  value='"1"'></i-input>
        </i-col>
      </i-row>
      <template slot="footer">
          <i-button type="primary">调用</i-button>
      </template>
    </i-modal>
  </div>
</template>

<script>
export default {
  props: {
    testServer: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit('cancleTestServerModal')
    }
  },
}
</script>

<style scoped>
>>> .ivu-modal-header {
  text-align: center;
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
>>>.ivu-modal-footer{
    text-align: center;
}
</style>