<!--  -->
<template>
<div class="executor">
    <div class="executor-top">
        <div class="executor-search">
        <i-input
          v-model="search"
          placeholder="关键词搜索"
          style="width: 200px"
          clearable
        />
        <i-button
          type="info"
          icon="md-search"
          class="search"
          
        >搜索</i-button>
        </div>
        <i-button
        style="color: #fff;background-color: #057009"
        onMouseOver="this.style.color='#b6f204'"
        onMouseOut="this.style.color='#fff'"
        icon="md-power"
        class="new-executor"
        >增加包</i-button>
    </div>
    <div class="executor-main">
        <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        placement="bottom"
        :current="current"
        :page-size="pageSize"
    
        />
        <i-table
            :columns="columns1"
            :data="TaskData"
            stripe
            border
        >
        <template 
        slot="operation">
            <i-button type="error" size="small" >删除</i-button>
        </template>

        </i-table>
        <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        placement="top"
        :current="current"
        :page-size="pageSize"
      
        />
    </div>
</div>
</template>

<script>

export default {
name: "Executor",
components: {},
data() {
    //var global =this
    return {
        search: "",
        current: 1,
        pageSize: 10,
        total: 0,
        columns1:[
            {
                title: '包名',
                key: 'name',
                width: 200,
                align: 'center',
                resizable: true,
            },
            {
                title: '描述',
                key: 'description',
                minWidth: 150,
                align: 'center',
                resizable: true,
            },
            {
                title: '引用地址',
                key: 'address',
                slot:'address',
                minWidth: 200,
                align: 'center',
                resizable: true,
                render:(h,params)=>{
                  return h('span',
                    [
                    h('span',params.row.address),
                    h('i-button',{
                        props:{
                          type:"success",
                          size:"small",
                          icon:"ios-copy"
                        },
                        style:{
                          'margin-left':'10px'
                        }
                    }), 
                  ])
                }
            },
            {
                title: '操作',
                key: 'operation',
                slot:'operation',
                width: 150,
                align: 'center',
                resizable: true,
            }
        ],
        TaskData: [
            {
                id: 'id1',
                name: 'check_dup.py3.pyz',
                description:'description1',
                address: 'http://192.168.10.1/executor/check_dup.py3.pyz',
            },
        ],
    };
},

computed: {},

watch: {},

methods: {

},

created() {

},

mounted() {

},
}
</script>
<style scoped>
.executor-top {
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.executor-search {
  min-width: 302px;
  margin-left: 75px;
}
.executor-search .search {
  margin-left: 20px;
}
.new-executor {
  margin-left: 75px;
}
.executor-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
</style>