<template>
  <div class="server">
    <div class="server-top">
      <div class="server-button-group">
        <i-button
          type="success"
          icon="md-play"
          class="server-button"
        >批量执行</i-button>
        <i-button
          type="error"
          icon="md-trash"
          class="server-button"
        >批量禁用</i-button>
        <i-button
          type="success"
          icon="md-checkmark"
          class="server-button"
        >批量启用</i-button>
        <i-button
          type="warning"
          icon="md-pause"
          class="server-button"
        >批量暂停</i-button>
        <i-button
          type="success"
          icon="md-refresh"
          style="width:140px"
          class="server-button"
        >批量恢复</i-button>
        <i-button
          type="error"
          icon="md-close"
        >批量终止</i-button>
      </div>
      <div class="server-search">
        <i-input
          placeholder="关键词搜索"
          style="width: 200px"
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
        class="new-server"
        @click="handleNewServer"
      >新建服务</i-button>
    </div>
    <div class="server-main">
      <i-page
        :total="ServeData.length"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
      />
      <i-table
        :columns="columns1"
        :data="ServeData"
        stripe
        border
      >
        <template slot="configuration">
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px;width:150px"
              @click="handleServerDetail()"
            >预览配置</i-button>
          </div>
        </template>
        <template
          slot="operation"
          slot-scope="{ row }"
        >
          <div>
            <i-button
              type="success"
              size="small"
              icon="md-play"
              style="margin-right: 20px"
              @click="handleTestServer"
            ></i-button>
            <i-button
              type="success"
              size="small"
              style="margin-right: 20px"
              v-if="row.isban === true"
              icon="md-checkmark"
              @click="handBanClick(row)"
            ></i-button>
            <i-button
              type="error"
              size="small"
              icon="md-trash"
              style="margin-right: 20px"
              v-else
              @click="handBanClick(row)"
            ></i-button>
            <i-button
              type="primary"
              size="small"
              icon="md-copy"
            ></i-button>
          </div>
        </template>
        <template slot="log">
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px"
            >查看任务日志</i-button>
          </div>
        </template>
      </i-table>
      <i-page
        :total="ServeData.length"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
      />
    </div>

    <i-newServer
      :newServer="newServer"
      @cancleNewServerModal="handleCancleNewServerModal"
    ></i-newServer>
    <i-serverDetail
      :serverDetail="serverDetail"
      @cancleServerDetailModal="handleCancleServerDetailModal"
    ></i-serverDetail>
    <i-testServer
      :testServer="testServer"
      @cancleTestServerModal="cancleTestServerModal"
    ></i-testServer>
  </div>
</template>

<script>
import NewServe from './Server/NewServer'
import ServerDetail from './Server/ServerDetail'
import TestServer from './Server/TestServer'
export default {
  data() {
    return {
      columns1: [
        {
          type: 'selection',
          width: 30,
          align: 'center',
          resizable: true,
        },
        {
          title: '名称',
          key: 'title',
          width: 230,
          align: 'center',
          resizable: true,
        },
        {
          title: '配置内容',
          key: 'configuration',
          slot: 'configuration',
          align: 'center',
          minWidth: 100,
          resizable: true,
        },
        {
          title: '参数',
          key: 'params',
          width: 250,
          align: 'center',
          resizable: true,
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: "运行中",
              value: "运行中"
            },
            {
              label: "准备就绪",
              value: "准备就绪"
            },
            {
              label: "禁用",
              value: "禁用"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "运行中") {
              return row.status == "RUNNING"
            } else if (value === "准备就绪") {
              return row.status == "READY"
            } else if (value === "禁用") {
              return row.status == "DISABLED"
            }
          },
          renderHeader(h, params) {
            if (params.index === 4) {
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
                return h('span', params.column.title)
              }
            }
          }
        },
        {
          title: '操作',
          key: 'operation',
          slot: 'operation',
          align: 'center',
          minWidth: 150,
          resizable: true,
        },
        {
          title: '日志',
          key: 'log',
          slot: 'log',
          align: 'center',
          minWidth: 120,
          resizable: true,
        },
      ],
      ServeData: [
      ],
      newServer: false,
      serverDetail: false,
      testServer: false
    }
  },
  methods: {
    handBanClick(row) {
      row.isban = !row.isban
    },
    handleNewServer() {
      this.newServer = true
    },
    handleCancleNewServerModal() {
      this.newServer = false
    },
    handleServerDetail() {
      this.serverDetail = true
    },
    handleCancleServerDetailModal() {
      this.serverDetail = false
    },
    handleTestServer() {
      this.testServer = true
    },
    cancleTestServerModal() {
      this.testServer = false
    },
    // 获取服务列表
    async getServe() {
      const self = this
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/list",
          params: {
          }
        })
        console.log(res)
        if (res.data.code == 0) {
          self.ServeData = res.data.data
        }
      } catch (error) {
        self.$Message.error("获取服务列表错误")
      }
    }
  },
  components: {
    "i-newServer": NewServe,
    "i-serverDetail": ServerDetail,
    "i-testServer": TestServer
  },
  mounted() {
    this.getServe()
  },
}
</script>

<style scoped>
.server-top {
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.server-button-group {
  margin-left: 5px;
}
.server-button {
  margin-right: 5px;
}
.server-search {
  min-width: 302px;
  margin-left: 75px;
}
.server-search .search {
  margin-left: 20px;
}
.new-server {
  margin-left: 75px;
}
.server-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
</style>