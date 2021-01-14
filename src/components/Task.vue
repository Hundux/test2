<template>
  <div class="task">
    <div class="task-top">
      <div class="task-button-group">
        <i-button
          type="success"
          icon="md-play"
          class="task-button"
        >批量执行</i-button>
        <i-button
          type="error"
          icon="md-trash"
          class="task-button"
        >批量禁用</i-button>
        <i-button
          type="success"
          icon="md-checkmark"
          class="task-button"
        >批量启用</i-button>
        <i-button
          type="warning"
          icon="md-pause"
          class="task-button"
        >批量暂停</i-button>
        <i-button
          type="success"
          icon="md-refresh"
          style="width:140px"
          class="task-button"
        >批量恢复</i-button>
        <i-button
          type="error"
          icon="md-close"
        >批量终止</i-button>
      </div>
      <div class="task-search">
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
          @click="searchTask"
        >搜索</i-button>
      </div>
      <i-button
        style="color: #fff;background-color: #057009"
        onMouseOver="this.style.color='#b6f204'"
        onMouseOut="this.style.color='#fff'"
        icon="md-power"
        class="new-task"
        @click="handleNewTask"
      >新建任务</i-button>
    </div>
    <div class="task-main">
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
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <i-table
        :columns="columns1"
        :data="TaskData"
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
              style="margin-right: 5px;minWidth:95px"
              @click="handleTaskDetail(row)"
            >预览配置</i-button>
          </div>
        </template>
        <template
          slot="operation"
          slot-scope="{ row }"
        >
          <div>
            <!-- 执行 -->
            <i-button
              type="success"
              size="small"
              icon="md-play"
              style="margin-right: 5px"
              @click="handRunClick(row)"
            ></i-button>
            <!-- 启用 -->
            <i-button
              type="success"
              size="small"
              style="margin-right: 5px"
              v-if="row.enabled === false"
              icon="md-checkmark"
              @click="handBanClick(row,'yes')"
            ></i-button>
            <!-- 禁止 -->
            <i-button
              type="error"
              size="small"
              icon="md-trash"
              style="margin-right: 5px"
              v-else
              @click="handBanClick(row,'no')"
            ></i-button>
            <!-- 复制 -->
            <i-button
              type="primary"
              size="small"
              icon="md-copy"
              style="margin:0 20px 0 15px"
              @click="handleCopyTask(row)"
            ></i-button>
            <!-- 暂停 -->
            <i-button
              type="warning"
              size="small"
              icon="md-pause"
              style="margin-right: 5px"
              v-if="row.status=='RUNNING'"
              @click="handPausedClick(row)"
            ></i-button>
            <!-- 恢复 -->
            <i-button
              type="success"
              size="small"
              style="margin-right: 5px"
              icon="md-refresh"
              v-else
              @click="handRunClick(row)"
            ></i-button>
            <!-- 终止 -->
            <i-button
              type="error"
              size="small"
              icon="md-close"
              style="margin-right: 5px"
              @click="handStoppedClick(row)"
            ></i-button>
          </div>
        </template>
        <template slot="log">
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="handleLog"
            >查看任务日志</i-button>
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
        placement="top"
        :current="current"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <i-newtask
        :newTask="newTask"
        :copyTask="copyTask"
        @cancleNewTaskModal="handleCancleNewTaskModal"
      ></i-newtask>
      <i-taskdetail
        :taskDetail="taskDetail"
        :task.sync="task"
        @cancleTaskDetailModal="handleCancleTaskDetailModal"
      ></i-taskdetail>
      <i-log
        :log="log"
        @cancleLogModal="cancleLogModal"
      ></i-log>
    </div>
  </div>
</template>

<script>
import NewTask from './Task/newTask'
import TaskDetail from './Task/taskDetail'
import Log from './Log'
export default {
  name: "Task",
  data() {
    var global = this
    return {
      search: "",
      current: 1,
      pageSize: 10,
      total: 0,
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
          title: "类型",
          key: 'category',
          width: 80,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: "普通任务",
              value: "普通任务"
            },
            {
              label: "服务任务",
              value: "服务任务"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "普通任务") {
              return row.category == "TASK"
            } else if (value === "服务任务") {
              return row.category == "SERVICE"
            }
          },
          render: (h, params) => {
            if (params.row.category === "TASK") {
              return h('i-icon', { props: { type: 'md-list', size: '20' } })
            } else if (params.row.category === "SERVICE") {
              return h('i-icon', { props: { type: 'md-cloud', size: '20' } })
            }
          },
          renderHeader(h, params) {
            global.columns4 = params.column._filterChecked
            if (params.index === 2) {
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
          title: '配置内容',
          key: 'configuration',
          slot: 'configuration',
          align: 'center',
          minWidth: 100,
          resizable: true,
        },
        {
          title: '执行计划',
          key: 'plan',
          minWidth: 200,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: '定期',
              value: "定期"
            },
            {
              label: '定点',
              value: "定点"
            },
            {
              label: '未计划',
              value: "未计划"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "定期") {
              return row.plan == '定期'
            } else if (value === "定点") {
              return row.plan == '定点'
            } else if (value === "未计划") {
              return row.plan == '未计划'
            }
          },
          render: (h, params) => {
            if (params.row.plan === "定点") {
              return h('span', params.row.date)
            } else if (params.row.plan === "定期") {
              return h("span", params.row.date)
            } else if (params.row.plan === "未计划") {
              return h("span", "未计划")
            }
          },
          renderHeader(h, params) {
            global.columns2 = params.column._filterChecked
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
          title: '状态',
          key: 'status',
          width: 100,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: '运行中',
              value: "运行中"
            },
            {
              label: "暂停中",
              value: "暂停中"
            },
            {
              label: '准备就绪',
              value: "准备就绪"
            }, {
              label: "已终止",
              value: "已终止"
            },
            {
              label: '禁用',
              value: "禁用"
            }
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
            global.columns3 = params.column._filterChecked
            if (params.index === 5) {
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
          width: 250,
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
      TaskData: [
      ],
      newTask: false,
      taskDetail: false,
      task: {},
      log: false,
      columns2: [],
      columns3: [],
      columns4: [],
      copyTask: {}
    }
  },
  components: {
    "i-newtask": NewTask,
    "i-taskdetail": TaskDetail,
    "i-log": Log
  },
  methods: {
    // 获取任务列表
    async getTASKList(search) {
      const self = this
      let searchKey = ""
      if (search) {
        searchKey = search
      }
      try {
        const xData = {
          p: self.current,
          psize: self.pageSize,
          search_key: searchKey
        }
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/job/list",
          params: xData
        })
        console.log(xData)
        console.log(res);
        if (res.data.code == 0) {
          self.TaskData = res.data.data.page
          self.total = res.data.data.total
          self.TaskData.forEach(item => {
            if (item.schedule.at) {
              item.plan = "定点"
              item.date = item.schedule.at.$date
              item.date = "定点:" + self.$moment(item.date).format("llll")
            } else if (item.schedule.cron) {
              item.plan = "定期"
              item.date = "定期:" + item.schedule.cron.month + "月" + item.schedule.cron.day_of_month + "日" + item.schedule.cron.hour + "时" + item.schedule.cron.minute + "分" + item.schedule.cron.second + "秒" + "  星期" + item.schedule.cron.day_of_week
            } else {
              item.plan = "未计划"
            }
            if (item.enabled == false) {
              item.status = "unenabled"
            }
          })
        }
      } catch (err) {
        self.$Message.error("获取任务列表错误")
      }
    },
    // 禁用 启用任务
    async handBanClick(row, isBan) {
      const self = this
      let xData = {
        ids: [row.id],
        enable: isBan
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/enable",
          params: xData
        })
        console.log(res);
        if (res.data.code == 0) {
          this.getTASKList()
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 终止任务
    async handStoppedClick(row) {
      const self = this
      let xData = {
        id: row.id,
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/stop",
          params: xData
        })
        if (res.data.code === 0) {
          this.getTASKList()
        }
      } catch (err) {
        self.$Message.error("终止任务错误")
      }
    },
    // 运行 恢复任务
    async handRunClick(row) {

      const self = this
      let xData = {
        id: row.id,
        crawler_count: 1
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/run",
          params: xData
        })
        if (res.data.code === 0) {
          this.getTASKList()
        }
      } catch (err) {
        self.$Message.error("运行任务错误")
      }
    },
    // 暂停任务
    async handPausedClick(row) {
      const self = this
      let xData = {
        id: row.id,
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/pause",
          params: xData
        })
        if (res.data.code === 0) {
          this.getTASKList()
        }
      } catch (err) {
        self.$Message.error("运行任务错误")
      }
    },
    // 搜索任务
    async searchTask() {
      this.current = 1
      this.getTASKList(this.search)
    },
    filter(col) {
      console.log(col);
    },
    handleCopyTask(row) {
      this.copyTask = row
      this.newTask = true
    },
    pageChange(index) {
      this.current = index
      this.getTASKList()
    },
    pageSizeChange(size) {
      this.pageSize = size
      this.getTASKList()
    },
    handleNewTask() {
      this.newTask = true
    },
    handleCancleNewTaskModal(isCreate) {
      this.copyTask = {}
      this.newTask = false
      if (isCreate) {
        this.getTASKList()
      }
    },
    handleTaskDetail(task) {
      this.task = task
      this.taskDetail = true
    },
    handleCancleTaskDetailModal(isOperation, copyTask) {
      this.taskDetail = false
      if (isOperation == true) {
        this.getTASKList()
      } else if (isOperation == "copy") {
        this.handleCopyTask(copyTask)
      }
    },
    handleLog() {
      this.log = true
    },
    cancleLogModal() {
      this.log = false
    },
  },
  mounted() {
    const self = this
    self.getTASKList()
  },
}
</script>

<style scoped>
.task-top {
  margin-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.task-button-group {
  margin-left: 5px;
}
.task-button {
  margin-right: 5px;
}
.task-search {
  min-width: 302px;
  margin-left: 75px;
}
.task-search .search {
  margin-left: 20px;
}
.new-task {
  margin-left: 75px;
}
.task-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
</style>