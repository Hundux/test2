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
          fixed: 'left'
        },
        {
          title: '名称',
          key: 'name',
          width: 80,
          align: 'center',
          resizable: true,
          fixed: 'left'
        },
        {
          title: '配置内容',
          key: 'configuration',
          slot: 'configuration',
          align: 'center',
          minWidth: 150,
          resizable: true,
          fixed: 'left'
        },
        {
          title: '参数',
          key: 'params',
          width: 250,
          align: 'center',
          resizable: true,
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'state',
          width: 100,
          align: 'center',
          resizable: true,
          fixed: 'left',
          filters: [
            {
              label: '运行中',
              value: 1
            },
            {
              label: '准备就绪',
              value: 2
            },
            {
              label: '禁用',
              value: 3
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.state == '运行中'
            } else if (value === 2) {
              return row.state == '准备就绪'
            } else if (value === 3) {
              return row.state == '禁用'
            }
          }
        },
        {
          title: '操作',
          key: 'operation',
          slot: 'operation',
          align: 'center',
          minWidth: 200,
          resizable: true,
          fixed: 'right'
        },
        {
          title: '日志',
          key: 'log',
          slot: 'log',
          align: 'center',
          minWidth: 150,
          resizable: true,
          fixed: 'right',
        },
      ],
      ServeData: [
        {
          name: "id1",
          params: "参数1",
          state: '运行中',
          isban: false
        },
        {
          name: "id2",
          params: "参数1,参数3,参数4",
          state: '运行中',
          isban: true
        }
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
    }
  },
  components: {
    "i-newServer": NewServe,
    "i-serverDetail": ServerDetail,
    "i-testServer": TestServer
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
  margin-left: 35px;
}
.server-button {
  margin-right: 5px;
}
.server-search {
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