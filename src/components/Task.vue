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
        :task="task"
        @cancleTaskDetailModal="handleCancleTaskDetailModal"
      ></i-taskdetail>
    </div>
  </div>
</template>

<script>
import NewTask from './Task/newTask'
import TaskDetail from './Task/taskDetail'
export default {
  data() {
    return {
      search: '',
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
          title: '类型',
          key: 'type',
          width: 100,
          align: 'center',
          resizable: true,
          fixed: 'left',
          filters: [
            {
              label: '普通任务',
              value: 1
            },
            {
              label: '服务任务',
              value: 2
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.type == '执行配置'
            } else if (value === 2) {
              return row.type == '调用服务'
            }
          },
          render: (h, params) => {
            if (params.row.type === '执行配置') {
              return h('i-icon', { props: { type: 'md-list', size: '20' } })
            } else if (params.row.type === '调用服务') {
              return h('i-icon', { props: { type: 'md-cloud', size: '20' } })
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
          fixed: 'left'
        },
        {
          title: '执行计划',
          key: 'plan',
          width: 200,
          align: 'center',
          resizable: true,
          fixed: 'left',
          filters: [
            {
              label: '定期',
              value: 1
            },
            {
              label: '定点',
              value: 2
            },
            {
              label: '未计划',
              value: 3
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.plan == '定期'
            } else if (value === 2) {
              return row.plan == '定点'
            } else if (value === 3) {
              return row.plan == '未计划'
            }
          }
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
          minWidth: 300,
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
      task: {}
    }
  },
  components: {
    'i-newtask': NewTask,
    'i-taskdetail': TaskDetail
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
      console.log(task);
      this.task = task
      this.taskDetail = true
    },
    handleCancleTaskDetailModal() {
      this.taskDetail = false
    }
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
  margin-left: 35px;
}
.task-button {
  margin-right: 5px;
}
.task-search {
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