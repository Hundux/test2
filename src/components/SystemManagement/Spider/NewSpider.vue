<!--  -->
<template>
<div>
    <i-modal
        :value="newspider"
        @on-cancel="cancle"
        @on-ok="ok"
        >
        <div slot="header" style="text-align:center" >
            <h2 v-if="this.create">增加爬虫</h2>
            <h2 v-else>修改爬虫数</h2>
        </div>
        <div style="text-align:center">
            <i-row style="margin:15px 0 30px 0">
                <i-col span="6">
                  <span class="title" style="float:right">爬虫名:</span>
                </i-col>
                <i-col span="18">
                  <i-input
                        placeholder="请输入爬虫名"
                        style="width: 200px"
                        clearable
                        v-model="newSpider_name"
                         v-if="this.create"
                  >
                  </i-input>
                  <i-input
                        style="width: 200px"
                        clearable
                        v-model="spiderData.NAME"
                         disabled
                        v-else
                  >
                  </i-input>
                </i-col>
            </i-row>
            <i-row style="margin:15px 0 30px 0">
                <i-col span="6">
                  <span class="title" style="float:right">新增进程树:</span>
                </i-col>
                <i-col span="18">
                    <i-inputNumber  :min="1" style="width: 200px" v-model="newSpider_count"></i-inputNumber>
                </i-col>
            </i-row>
                <i-radioGroup v-model="force">
                  是否允许强制减少爬虫进程数？
        <i-radio label="yes">
            <span>是</span>
        </i-radio>
        <i-radio label="no">
            <span>否</span>
        </i-radio>
    </i-radioGroup>
        </div>
        <div slot="footer" style="text-align:center">
              <i-button type="primary" size="large" style="width:200px" @click="ok">确认</i-button>
        </div>
    </i-modal>
    <div
      v-if="showLoading"
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
  components: {},
  data() {
    return {
      force: 'yes',
      SpiderName: "",
      showLoading: false,
      newSpider_name: "",
      newSpider_count: "",
      create_yes_no: "yes"
    };
  },
  props: {
    newspider: {
      type: Boolean,
      default: false
    },
    spiderData: {
      type: Object
    },
    create: {
      type: Boolean
    }
  },
  computed: {},

  watch: {},

  methods: {
    cancle() {
      console.log(this.spiderData);
      this.$emit("cancleCreateSpider");
      //this.$Message.info('Clicked no');
    },
    confirm() {
      this.$emit("confirm");
    },
    close() {
      this.$emit("close");
    },
    async ok() {
      //this.$Message.info('Clicked ok');
      const self = this;
      self.close();
      self.showLoading = true;
      try {
        if (!this.create) {
          this.newSpider_name = this.spiderData.NAME;
          this.create_yes_no = "no";
        } else if (this.newSpider_name == "") {
          self.$Message.error("请输入爬虫名称");
          self.showLoading = false;
        }
        //判断爬虫名是否为数字和字母组合
        var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
        var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
        if (
          regNumber.test(this.newSpider_name) &&
          regString.test(this.newSpider_name)
        ) {
          const res = await self.axios({
            method: "post",
            url: self.$store.state.baseurl + "api/spider/scale",
            params: {
              name: this.newSpider_name,
              count: this.newSpider_count,
              create: this.create_yes_no,
              force: this.force
            }
          });
          console.log(res);
          if (res.data.code == 0) {
            self.confirm();
            self.showLoading = false;
          } else {
            self.$Message.error(res.data.error_message);
            self.showLoading = false;
            console.log(res.data.code);
          }
        } else {
          self.$Message.error("爬虫名，必须为数字和字母的组合");
          self.showLoading = false;
        }
      } catch (error) {
        self.$Message.error("创建爬虫错误");
        self.showLoading = false;
      }
    }
  },

  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
</style>