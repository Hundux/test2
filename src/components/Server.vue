<template>
  <div class="server">
    <i-row class="server-top">
      <i-col
        span="8"
        class="server-button-group"
      >
        <i-button
          type="success"
          icon="md-checkmark"
          class="server-button"
        >批量启用</i-button>
        <i-button
          type="error"
          icon="md-remove"
          class="server-button"
        >批量禁用</i-button>
      </i-col>
      <i-col
        span="8"
        class="server-search"
      >
        <i-input
          placeholder="关键词搜索"
          style="width: 200px"
          v-model="search_key"
          @on-clear="getServe"
          clearable
        />
        <i-button
          type="info"
          icon="md-search"
          class="search"
          @click="searchService"
        >搜索</i-button>
      </i-col>
      <i-col span="8">
        <i-button
          style="color: #fff;background-color: #057009"
          onMouseOver="this.style.color='#b6f204'"
          onMouseOut="this.style.color='#fff'"
          icon="md-power"
          class="new-server"
          @click="handleNewServer"
        >新建服务</i-button>
      </i-col>
    </i-row>
    <div class="server-main">
      <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        :current="current"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <i-table
        class="Servel-table"
        :columns="columns1"
        :data="ServeData"
        stripe
        border
        @on-filter-change="filter"
      >
        <template
          slot="configuration"
          slot-scope="{ row }"
        >
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px;width:95px"
              @click="handleServerDetail(row)"
            >预览配置</i-button>
          </div>
        </template>
        <template
          slot="params"
          slot-scope="{ row }"
        >
          <div>
            <div
              v-for="(item,index) in row.params"
              :key="index"
              class="params"
            >
              <span>{{item.name}}</span>
              <span class="params_">:</span>
              <span class="params_desc">{{item.description}}</span>
            </div>
          </div>
        </template>
        <template
          slot="operation"
          slot-scope="{ row }"
        >
          <div>
            <!-- 调用 -->
            <i-poptip
              confirm
              :title="`确定启动${row.crawler_count}个爬虫立即调用`"
              @on-ok="callServer(row)"
              placement="right"
            >
              <i-button
                type="success"
                size="small"
                icon="md-open"
              >
              </i-button>
            </i-poptip>
            <!-- 启用 -->
            <i-button
              type="success"
              size="small"
              style="margin:0 20px"
              v-if="row.isban === true"
              icon="md-checkmark"
              @click="handBanClick(row)"
            ></i-button>
            <!-- 禁用 -->
            <i-button
              type="error"
              size="small"
              icon="md-remove"
              style="margin:0 20px"
              v-else
              @click="handBanClick(row)"
            ></i-button>
            <i-button
              type="primary"
              size="small"
              icon="md-copy"
              @click="handCopyClick(row)"
            ></i-button>
          </div>
        </template>
        <template
          slot="log"
          slot-scope="{ row }"
        >
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="toRecord(row)"
            >查看</i-button>
          </div>
        </template>
      </i-table>
      <i-page
        :total="total"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
        :current="current"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>

    <i-newServer
      :newServer="newServer"
      :copyServe="copyServer"
      @cancleNewServerModal="handleCancleNewServerModal"
    ></i-newServer>
    <i-serverDetail
      :serverDetail="serverDetail"
      :serveDetailData="serveDetailData"
      @handleCopy="handCopyClick"
      @cancleServerDetailModal="handleCancleServerDetailModal"
    ></i-serverDetail>
    <i-testServer
      :testServer="testServer"
      @cancleTestServerModal="cancleTestServerModal"
    ></i-testServer>

    <!-- loading-->
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
          minWidth: 400,
          align: 'center',
          resizable: true,
        },
        {
          title: '参数',
          key: 'params',
          slot: 'params',
          minWidth: 385,
          align: 'center',
          resizable: true,
        },
        {
          title: "状态",
          key: 'enabled',
          width: 100,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: '启用',
              value: "启用"
            },
            {
              label: '禁用',
              value: "禁用"
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === "启用") {
              return row.enabled == true
            } else if (value === "禁用") {
              return row.status == false
            }
          },
          render: (h, params) => {
            if (params.row.enabled === true) {
              return h('span', "启用")
            } else if (params.row.enabled === false) {
              return h('span', "禁用")
            }
          },
          renderHeader(h, params) {
            if (params.index === 3) {
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
          width: 150,
          resizable: true,
        },
        {
          title: '配置内容',
          key: 'configuration',
          slot: 'configuration',
          align: 'center',
          width: 120,
          resizable: true,
        },
        {
          title: '运行记录',
          key: 'log',
          slot: 'log',
          align: 'center',
          width: 120,
          resizable: true,
        },
      ],
      ServeData: [
      ],
      newServer: false,
      serverDetail: false,
      testServer: false,
      serveDetailData: {},
      current: 1,
      isFilter: false,
      total: 0,
      search_key: "",
      showLoading: false,
      pageSize: null,
      copyServer: {}
    }
  },
  methods: {
    // 模态框相关
    handBanClick(row) {
      row.isban = !row.isban
    },
    handleNewServer() {
      this.newServer = true
    },
    handleCancleNewServerModal() {
      this.getServe()
      this.newServer = false
    },
    handleServerDetail(row) {
      this.serveDetailData = row
      this.serverDetail = true
    },
    handleCancleServerDetailModal() {
      this.getServe()
      this.serverDetail = false
    },
    handleTestServer() {
      this.testServer = true
    },
    cancleTestServerModal() {
      this.testServer = false
    },
    // 获取服务列表
    async getServe(search, filter) {
      const self = this
      self.showLoading = true
      let searchKey = ""
      if (search) {
        searchKey = search
      }
      let filterKey = ""
      if (filter) {
        filterKey = filter
      }
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/list",
          params: {
            p: self.current,
            psize: self.pageSize,
            search_key: searchKey,
            enabled: filterKey
          }
        })
        console.log(res)
        if (res.data.code == 0) {
          self.total = res.data.data.total
          self.ServeData = res.data.data.page
          self.showLoading = false
        }
      } catch (error) {
        self.$Message.error("获取服务列表错误")
      }
    },
    // page改变
    pageChange(index) {
      this.current = index
      this.getServe()
    },
    pageSizeChange(size) {
      this.pageSize = size
      localStorage.setItem("pageSize", size)
      this.$store.commit("changePageSize", size)
      this.getServe()
    },
    // 搜索任务
    async searchService() {
      this.current = 1
      this.getServe(this.search_key)
    },
    // 筛选功能
    filter(col) {
      // console.log(col)
      const self = this
      self.current = 1
      if (col._filterChecked.length == 0) {
        self.getServe()
        self.isFilter = false
      } else {
        let filterChecked = col._filterChecked[0]
        if (filterChecked == "启用") {
          self.getServe("", "yes")
        } else {
          self.getServe("", "no")
        }
      }
    },
    handCopyClick(row) {
      console.log(row);
      this.copyServer = row
      this.newServer = true
    },
    // 调用服务
    async callServer(row) {
      const self = this
      let xData = {
        id: row.id,
      }
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/call",
          params: xData
        })
        console.log(res);
        // if (res.data.code == 0) {
        // } else {
        //   self.$Message.error(res.data.error_message)
        // }
      } catch (err) {
        console.log(err);
        self.$Message.error("运行任务错误")
      }
    },
    toRecord(row) {
      this.$router.push({ path: "/record", query: { id: row.id, category: "service_id", name: row.title } })
    },
  },
  components: {
    "i-newServer": NewServe,
    "i-serverDetail": ServerDetail,
    "i-testServer": TestServer
  },
  computed: {
    pageSizeC() {
      return this.$store.state.pageSize
    }
  },
  mounted() {
    this.pageSize = this.pageSizeC
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
.Servel-table {
  font-weight: 450;
  overflow: auto;
}
.params {
  text-align: left;
  padding-left: 20px;
  position: relative;
}
.params_ {
  position: absolute;
  left: 70px;
}
.params_desc {
  position: absolute;
  left: 80px;
}
>>> .ivu-icon-ios-help-circle {
  display: none !important;
}
</style>