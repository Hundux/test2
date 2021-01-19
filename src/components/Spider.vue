<!--  -->
<template>
<div class="spider">
    <div class="spider-top">
        <div class="spider-button-group">
        <i-button
          type="success"
          icon="md-checkmark"
          class="spider-button"
        >批量启用</i-button>
        <i-button
          type="error"
          icon="md-close"
          class="spider-button"
        >批量停止</i-button>
        <i-button
          type="warning"
          icon="md-pause"
          style="width:140px"
          class="spider-button"
        >批量挂起</i-button>
      </div>
        <div class="spider-search">
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
        class="new-spider"
        @click="handleNewSpider"
        >新增爬虫</i-button>
    </div>
    <div class="spider-main">
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
            :data="SpiderData"
            stripe
            border
        >
        <template 
        slot="operation">
            <i-button type="error" size="small" style="margin-right: 5px">停止</i-button>
            <i-button type="success" size="small">恢复</i-button>
            <!-- <i-button type="success" size="small">挂起</i-button> -->
            <i-button type="primary" size="small" style="margin-left: 5px" @click="handleLog">查看日志</i-button>
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
        <!-- 隐藏组件 -->
        <i-log
        :log="log"
        @cancleLogModal="cancleLogModal"
      ></i-log>
      <i-newspider
      :newspider="newspider"
      @cancleCreateSpider="cancleCreateSpider"
      @confirm="confirm"
      ></i-newspider>

    </div>
</div>
</template>

<script>
import Log from './Log'
import NewSpider from './SystemManagement/Spider/NewSpider'
export default {
name: "spider",
components: {
    "i-log": Log,
    'i-newspider':NewSpider
},
data() {
    //var global =this
    return {
        search: "",
        current: 1,
        pageSize: 10,
        total: 0,
        columns1:[
            {
                type: 'selection',
                width: 50,
                align: 'center',
                resizable: true,
            },
            {
                title: '爬虫名',
                key: 'name',
                width: 150,
                align: 'center',
                resizable: true,
            },
            {
                title: '爬虫idx',
                key: 'id',
                width: 200,
                align: 'center',
                resizable: true,
            },
            {
                title: '所在机器',
                key: 'machine',
                minWidth: 150,
                align: 'center',
                resizable: true,
                filters:[
                    {
                        label:'机器1',
                        value:'机器1'
                    }
                ],
                filterMultiple: true,
                filterMethod(value, row) {
                    return row
                },
            },
            {
                title: '状态',
                key: 'status',
                minWidth: 200,
                align: 'center',
                resizable: true,
                filters:[
                    {
                        label:'运行中',
                        value:'运行中'
                    },
                    {
                        label: "暂停中",
                        value: "暂停中"
                    },
                    {
                        label:'准备就绪',
                        value:'准备就绪'
                    },
                    {
                        label: "已终止",
                        value: "已终止"
                    },
                    {
                        label:'禁用',
                        value:'禁用'
                    },
                ],
                filterMultiple: true,
                filterMethod(value, row) {
                    if (value === "运行中") {
                    return row.status == "RUNNING"
                    } else if (value === "暂停中") {
                    return row.status == "PAUSED"
                    } else if (value === "准备就绪") {
                    return row.status == "READY"
                    } else if (value === "已终止") {
                    return row.status == "STOPPED"
                    } else if (value === "禁用") {
                    return row.status == "unenabled"
                    }
                },
                render: (h, params) => {
                    if (params.row.status === "READY") {
                    return h('span', "准备就绪")
                    } else if (params.row.status === "PAUSED") {
                    return h("span", "暂停中")
                    } else if (params.row.status === "STOPPED") {
                    return h("span", "已终止")
                    } else if (params.row.status === "unenabled") {
                    return h("span", "禁用")
                    } else if (params.row.status === "RUNNING") {
                    return h("span", "运行中")
                    } else {
                    return h("span", params.row.status)
                    }
                },
                renderHeader(h, params) {
            //global.columns3 = params.column._filterChecked
                    if (params.column._filterChecked.length != 0) {
                        let column_Ck = params.column._filterChecked
                        let words = ''
                        let line = 0
                        for (let i = 0; i < column_Ck.length; i++) {
                        words += column_Ck[i] + ',' + '\xa0\xa0'
                        if ((i + 1) % 3 == 0 && i != 8) {
                            words += '\n'
                            line = line + 1
                        } else if (line == 2 && i == 8) {
                            words = words + '...'
                            break
                        }
                        }
                        words = words.trim()
                        return h('span', [
                        h('span', params.column.title),
                        h('span', {
                            style: {
                            'white-space': 'pre-line',
                            'font-size': '10px',
                            'color': 'black'
                            }
                        }, '\n' + words + '\n')
                        ])
                    } else {
                        return h('span',params.column.title)
                    }
                    
                }
            },
              {
                title: '运行时间',
                key: 'runtime',
                minWidth: 200,
                align: 'center',
                resizable: true,
            },
            {
                title: '操作',
                key: 'operation',
                slot:'operation',
                minWidth: 150,
                align: 'center',
                resizable: true,
            }
        ],
        SpiderData: [
        ],
        log:false,
        newspider:false
    };
},

computed: {},

methods: {
    //获取爬虫列表
    async getSpiderList() {
      let self = this
      try {
          const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/spider/list",
        })
        console.log(res);
      } catch (err) {
          self.$Message.error("获取爬虫列表错误")
        }
    },
    handleLog() {
      this.log = true
    },
    cancleLogModal() {
      this.log = false
    },
    cancleCreateSpider(){
        this.newspider=false
        console.log('aa',this.newspider)
    },
    handleNewSpider(){
         this.newspider=true
         console.log(this.newspider)
    },
    confirm(){
        //this.newspider=false
        console.log('bb',this.newspider)
    },
},

created() {

},

mounted() {
  const self = this
  self.getSpiderList()
},
}
</script>
<style scoped>
.spider-top {
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.spider-button-group {
  margin-left: 5px;
}
.spider-button {
  margin-right: 5px;
}
.spider-search {
  min-width: 302px;
  margin-left: 75px;
}
.spider-search .search {
  margin-left: 20px;
}
.new-spider {
  margin-left: 75px;
}
.spider-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
</style>