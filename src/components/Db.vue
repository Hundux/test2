<template>
<div class="db">
    <div class="db-top">
        <div class="db-search">
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
    </div>
    <div class="db-main">
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
        ></i-table>
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
    </div>
</div>
</template>

<script>
export default {
name: "db",
components: {},
data() {
    //var global =this
    return {
        columns1:[
            {
                title: 'db名',
                key: 'name',
                minWidth: 150,
                align: 'center',
                resizable: true,
            },
            {
                title: 'url数',
                key: 'num',
                minWidth: 150,
                align: 'center',
                resizable: true,
            },
            {
                title: '所属任务',
                key: 'task',
                minWidth: 150,
                align: 'center',
                resizable: true,
            },
        ],
        TaskData:[]
    }
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
.db-top {
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.db-search {
  min-width: 302px;
  margin-left: 75px;
}
.db-search .search {
  margin-left: 20px;
}
.db-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
</style>