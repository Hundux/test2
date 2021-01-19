<!--  -->
<template>
<div class="spider">
    <div class="spider-top">
      <i-row style="width:100%">
        <i-col
          span="8"
        >
          <i-button
            type="success"
            icon="md-checkmark"
            class="spider-button"
          >批量启用</i-button>
          <i-button
            type="error"
            icon="md-remove"
            class="spider-button"
          >批量停止</i-button>
          <i-button
            type="warning"
            icon="md-pause"
            class="spider-button"
          >批量挂起</i-button>
        </i-col>
        <i-col
          span="8"
          class="spider-search"
        >
          <i-input
            placeholder="关键词搜索"
            style="width: 200px"
            clearable
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
          >搜索</i-button>
        </i-col>
        <i-col span="8">
          <i-button
            style="color: #fff;background-color: #057009"
            onMouseOver="this.style.color='#b6f204'"
            onMouseOut="this.style.color='#fff'"
            icon="md-power"
            class="spider-task"
          >新建爬虫</i-button>
        </i-col>
      </i-row>
    </div>
    <div class="spider-main">
        <i-table
            class="spider-table"
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
                key: 'spider_name',
                width: 150,
                align: 'center',
                resizable: true,
            },
            {
                title: '爬虫idx',
                key: 'INDEX',
                width: 200,
                align: 'center',
                resizable: true,
            },
            {
                title: '所在机器',
                key: 'NODE',
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
                key: 'STATUS',
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
                    return row.STATUS == "RUNNING"
                    } else if (value === "暂停中") {
                    return row.STATUS == "PAUSED"
                    } else if (value === "准备就绪") {
                    return row.STATUS == "READY"
                    } else if (value === "已终止") {
                    return row.STATUS == "STOPPED"
                    } else if (value === "禁用") {
                    return row.STATUS == "unenabled"
                    }
                },
                render: (h, params) => {
                    if (params.row.STATUS === "READY") {
                    return h('span', "准备就绪")
                    } else if (params.row.STATUS === "PAUSED") {
                    return h("span", "暂停中")
                    } else if (params.row.STATUS === "STOPPED") {
                    return h("span", "已终止")
                    } else if (params.row.STATUS === "unenabled") {
                    return h("span", "禁用")
                    } else if (params.row.STATUS === "RUNNING") {
                    return h("span", "运行中")
                    } else {
                    return h("span", params.row.STATUS)
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
                render:(h, params)=>{
                  //console.log(params.row['CURRENT STATE'])
                  //console.log(params.row['DESIRED STATE'])
                  let runtime = ''
                  runtime=params.row['CURRENT STATE'].replaceAll(params.row['DESIRED STATE'],"")
                  return h('span',runtime)
                }
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
        newspider:false,
        showLoading: false,
        singleArr:[],
        testArr:[],
        name:''
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
        console.log(res.data.data);
        
        if(res.data.code == 0){
          var resValues = Object.values(res.data.data)
          for(var i in resValues){
                self.singleArr=resValues[i]
                self.SpiderData=self.SpiderData.concat(self.singleArr)
                //console.log(i)
           }
            self.showLoading = false          
        }
        
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
.spider-table {
  font-weight: 450;
  overflow: auto !important;
}
</style>