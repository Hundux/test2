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
          span="6"
          class="configure-top-one"
        ><span>参数</span></i-col>
        <i-col span="10">值</i-col>
        <i-col span="8">描述</i-col>
      </i-row>
      <i-row
        class="configure-body"
        v-for="(item,index) in params.params"
        :key="index"
      >
        <i-col
          span="6"
          class="configure-body-one"
        ><span class="text">{{item.name}}：</span></i-col>
        <i-col span="10">
          <i-input
            style="width:80%"
            :placeholder="'默认值：'+item.default"
            v-model="item.value"
          ></i-input>
        </i-col>
        <i-col span="8"  class="configure-body-two">
          <!-- v-model="item.description" -->
          <span class="text">{{item.description}}</span>
        </i-col>
      </i-row>
      <template slot="footer">
        <i-button
          type="primary"
          @click="callServer(params)"
        >调用</i-button>
      </template>
    </i-modal>

    <div
      v-if="isPress"
      class="demo-spin-col"
      span="8"
    >
      <i-spin fix>
        <i-icon
          type="ios-loading"
          size=18
          class="demo-spin-icon-load"
        ></i-icon>
        <div>Loading</div>
      </i-spin>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPress: false
    }
  },
  props: {
    testServer: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object
    }
  }, watch: {
    params: {
      deep: true,
      handler: function (newValue) {
        if (newValue.params.length > 0) {
          for (let i = 0; i < newValue.params.length; i++) {
            newValue.params[i].value = ""
          }
        }
      }
    }
  },
  methods: {
    cancle() {
      this.$emit('cancleTestServerModal')
    },
    // 调用服务
    async callServer(row) {
      const self = this
      self.cancle()
      self.isPress = true
      let data = {}
      if (row.params.length > 0) {
        for (let i = 0; i < row.params.length; i++) {
          data[row.params[i].name] = row.params[i].value
        }
      }
      let xData = {
        id: row.id,
        ...data
      }
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/call",
          params: xData
        })
        console.log(res);
        if (res.data.code == 0) {
          self.isPress = false
        } else {
          self.isPress = false
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        console.log(err);
        self.isPress = false
        self.$Message.error("运行任务错误")
      }
    },
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
.configure-body-two{
  height: 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
>>> .ivu-modal-footer {
  text-align: center;
}
>>> textarea.ivu-input {
  height: 32px;
}
.text {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*禁止换行*/
  text-overflow: ellipsis; /*省略号*/
}
</style>