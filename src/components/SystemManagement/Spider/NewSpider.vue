<!--  -->
<template>
<div>
    <i-modal
        :value="newspider"
        @on-cancel="cancle"
        @on-ok="ok"
        >
        <div slot="header" style="text-align:center" >
            <h2>增加爬虫</h2>
        </div>
        <div style="text-align:center">
            <i-row style="margin:15px 0 30px 0">
                <i-col span="6">
                  <span class="title">爬虫名:</span>
                </i-col>
                <i-col span="12">
                  <!-- <i-input
                        
                        placeholder="请输入爬虫名"
                        style="width: 200px"
                        clearable
                  >
                  </i-input> -->
                </i-col>
                <i-col span="6">
                    <span>挂起还是恢复?</span>
                </i-col>
            </i-row>
            <i-row style="margin:15px 0 30px 0">
                <i-col span="6">
                  <span class="title">新增进程树:</span>
                </i-col>
                <i-col span="18">
                  <!-- <i-input
                        
                        style="width: 200px"
                        clearable
                  >
                  </i-input> -->
                </i-col>
            </i-row>
        </div>
        <div slot="footer" style="text-align:center">
              <i-button type="primary" size="large" style="width:200px">确认</i-button>
        </div>
    </i-modal>
</div>
</template>

<script>


export default {

components: {},
data() {
return {
     SpiderName:''
};
},
props: {
    newspider: {
      type: Boolean,
      default: false
    },
  },
computed: {},

watch: {},

methods: {
    cancle() {
      this.$emit('cancleCreateSpider')
    },
    ok(){
      this.$emit('confirm')
    }
},

created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},

}
</script>
<style scoped>

</style>