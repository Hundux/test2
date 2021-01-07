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
        class="new-task"
        @click="handleNewTask"
      >新建任务</i-button>
    </div>
    <div class="task-main">
      <i-page
        :total="TaskData.length"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
      />
      <i-table
        :columns="columns1"
        :data="TaskData"
        stripe
        border
      >
        <template
          slot="configuration"
          slot-scope="{ row }"
        >
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px;width:150px"
              @click="handleTaskDetail(row)"
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
              style="margin-right: 5px"
            ></i-button>
            <i-button
              type="success"
              size="small"
              style="margin-right: 5px"
              v-if="row.isban === true"
              icon="md-checkmark"
              @click="handBanClick(row)"
            ></i-button>
            <i-button
              type="error"
              size="small"
              icon="md-trash"
              style="margin-right: 5px"
              v-else
              @click="handBanClick(row)"
            ></i-button>
            <i-button
              type="primary"
              size="small"
              icon="md-copy"
              style="margin:0 20px 0 15px"
            ></i-button>
            <i-button
              type="success"
              size="small"
              style="margin-right: 5px"
              icon="md-refresh"
              v-if="row.isSuspend===true"
              @click="handSuspendClick(row)"
            ></i-button>
            <i-button
              type="warning"
              size="small"
              icon="md-pause"
              style="margin-right: 5px"
              v-else
              @click="handSuspendClick(row)"
            ></i-button>
            <i-button
              type="error"
              size="small"
              icon="md-close"
              style="margin-right: 5px"
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
        :total="TaskData.length"
        :page-size-opts=[10,20,30,40,50,100]
        size="small"
        show-elevator
        show-sizer
        show-total
      />
      <i-newtask
        :newTask="newTask"
        @cancleNewTaskModal="handleCancleNewTaskModal"
      ></i-newtask>
      <i-taskdetail
        :taskDetail="taskDetail"
        :task.sync="task"
        @cancleTaskDetailModal="handleCancleTaskDetailModal"
        @changePlan="hangleChangePlan"
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
  data() {
    var global = this
    return {
      search: '',
      columns1: [
        {
          type: 'selection',
          width: 30,
          align: 'center',
          resizable: true,
        },
        {
          title: '名称',
          key: 'name',
          width: 80,
          align: 'center',
          resizable: true,
        },
        {
          title: "类型",
          key: 'type',
          width: 100,
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
              return row.type == '执行配置'
            } else if (value === "服务任务") {
              return row.type == '调用服务'
            }
          },
          render: (h, params) => {
            if (params.row.type === '执行配置') {
              return h('i-icon', { props: { type: 'md-list', size: '20' } })
            } else if (params.row.type === '调用服务') {
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
          minWidth: 150,
          resizable: true,
        },
        {
          title: '执行计划',
          key: 'plan',
          width: 200,
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
          key: 'state',
          width: 100,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: '运行中',
              value: "运行中"
            },
            {
              label: '准备就绪',
              value: "准备就绪"
            },
            {
              label: '禁用',
              value: "禁用"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === 1) {
              return row.state == '运行中'
            } else if (value === 2) {
              return row.state == '准备就绪'
            } else if (value === 3) {
              return row.state == '禁用'
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
          width: 300,
          resizable: true,
        },
        {
          title: '日志',
          key: 'log',
          slot: 'log',
          align: 'center',
          minWidth: 150,
          resizable: true,
        },
      ],
      TaskData: [
        {
          name: '名称1',
          type: '执行配置',
          plan: '定期',
          state: '运行中',
          isSuspend: true,
          isban: false
        },
        {
          name: "名称2",
          type: "调用服务",
          plan: "定点",
          state: "准备就绪",
          isSuspend: false,
          isban: false
        },
        {
          name: "名称3",
          type: "执行配置",
          plan: "未计划",
          state: "禁用",
          isSuspend: true,
          isban: true
        }
      ],
      newTask: false,
      taskDetail: false,
      task: {},
      log: false,
      columns2: [],
      columns3: [],
      columns4: []
    }
  },
  components: {
    "i-newtask": NewTask,
    "i-taskdetail": TaskDetail,
    "i-log": Log
  },
  methods: {
    handBanClick(row) {
      row.isban = !row.isban
    },
    handSuspendClick(row) {
      row.isSuspend = !row.isSuspend
    },
    handleNewTask() {
      this.newTask = true
    },
    handleCancleNewTaskModal() {
      this.newTask = false
    },
    handleTaskDetail(task) {
      this.task = task
      this.taskDetail = true
    },
    handleCancleTaskDetailModal() {
      this.taskDetail = false
    },
    handleLog() {
      this.log = true
    },
    cancleLogModal() {
      this.log = false
    },
    hangleChangePlan(newPlan) {
      this.task.plan = newPlan
    }
  },
  async mounted() {
    const self = this
    const res = await self.axios({
      methods: "get",
      url: self.$store.state.baseurl + "/api/job/list"
    })
    console.log(res)
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
  min-width: 715px;
  margin-left: 35px;
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