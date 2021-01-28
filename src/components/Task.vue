<template>
  <div class="task">
    <div class="task-top">
      <i-row style="width:100%">
        <i-col
          span="8"
          class="task-button-group"
        >
          <i-button
            type="success"
            icon="md-checkmark"
            class="task-button"
            @click="batchRun('yes')"
          >批量启用</i-button>
          <i-button
            type="error"
            icon="md-remove"
            class="task-button"
            @click="batchRun('no')"
          >批量禁用</i-button>
        </i-col>
        <i-col
          span="8"
          class="task-search"
        >
          <i-input
            v-model="search"
            placeholder="关键词搜索"
            style="width: 200px"
            @on-clear="getTASKList"
            clearable
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
            @click="searchTask"
          >搜索</i-button>
        </i-col>
        <i-col span="8">
          <i-button
            style="color: #fff;background-color: #057009"
            onMouseOver="this.style.color='#b6f204'"
            onMouseOut="this.style.color='#fff'"
            icon="md-add"
            class="new-task"
            @click="handleNewTask"
          >新建任务</i-button>
        </i-col>
      </i-row>
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
        class="task-table"
        :columns="columns1"
        :data="TaskData"
        stripe
        border
        @on-filter-change="filter"
        @on-selection-change="selection_change"
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
              @click="handleTaskDetail(row)"
            >预览配置</i-button>
          </div>
        </template>
        <template
          slot="operation"
          slot-scope="{ row }"
        >
          <div>
            <!-- 提交 -->
            <i-poptip
              confirm
              :title="`确定启动${row.crawler_count}个爬虫立即运行`"
              @on-ok="handRunClick(row)"
              style="margin-right: 20px"
              placement="bottom"
            >
              <i-button
                type="success"
                size="small"
                icon="md-arrow-round-up"
              >
              </i-button>
            </i-poptip>
            <!-- 启用 -->
            <i-tooltip
              content="启用任务"
              style="margin-right: 20px"
              v-if="row.enabled === false"
            >
              <i-button
                type="success"
                size="small"
                icon="md-checkmark"
                @click="handBanClick(row,'yes')"
              >
              </i-button>
            </i-tooltip>
            <!-- 禁止 -->
            <i-tooltip
              content="禁用任务"
              style="margin-right: 20px"
              v-else
            >
              <i-button
                type="error"
                size="small"
                icon="md-remove"
                @click="handBanClick(row,'no')"
              >
              </i-button>
            </i-tooltip>
            <!-- 复制 -->
            <i-tooltip content="复制任务">
              <i-button
                type="primary"
                size="small"
                icon="md-copy"
                @click="handleCopyTask(row)"
              ></i-button>
            </i-tooltip>
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
    </div>

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
    <div
      v-if="isPress"
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
import NewTask from './Task/newTask'
import TaskDetail from './Task/taskDetail'
export default {
  name: "Task",
  data() {
    var global = this
    return {
      search: "",
      current: 1,
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
          minWidth: 230,
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
          filterMultiple: false,
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
          filterMultiple: false,
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
          // renderHeader(h, params) {
          //   global.columns2 = params.column._filterChecked
          //   if (params.index === 4) {
          //     if (params.column._filterChecked.length != 0) {
          //       let column_Ck = params.column._filterChecked
          //       let words = ''
          //       let line = 0
          //       for (let i = 0; i < column_Ck.length; i++) {
          //         words += column_Ck[i] + ',' + '\xa0\xa0'
          //         if ((i + 1) % 3 == 0 && i != 8) {
          //           words += '\n'
          //           line = line + 1
          //         } else if (line == 2 && i == 8) {
          //           words = words + '...'
          //           break
          //         }
          //       }
          //       words = words.trim()
          //       return h('span', [
          //         h('span', params.column.title),
          //         h('span', {
          //           style: {
          //             'white-space': 'pre-line',
          //             'font-size': '10px',
          //             'color': 'black'
          //           }
          //         }, '\n' + words + '\n')
          //       ])
          //     } else {
          //       return h('span', params.column.title)
          //     }
          //   }
          // }
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
              return row.enabled == false
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
      TaskData: [
      ],
      newTask: false,
      taskDetail: false,
      task: {},
      columns2: [],
      columns3: [],
      columns4: [],
      copyTask: {},
      isFilter: false,
      fData: {},
      showLoading: false,
      pageSize: null,
      setTitle: "",
      isPress: false,
      selection_id: []
    }
  },
  components: {
    "i-newtask": NewTask,
    "i-taskdetail": TaskDetail,
  },
  computed: {
    pageSizeC() {
      return this.$store.state.pageSize
    }
  },
  methods: {
    // 获取任务列表
    async getTASKList() {
      const self = this
      self.showLoading = true
      try {
        const xData = {
          p: self.current,
          psize: self.pageSize,
          search_key: self.search
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
              item.date = item.schedule.at
              item.date = "定点:" + self.$moment(item.date).format("llll")
            } else if (item.schedule.cron) {
              item.plan = "定期"
              item.date = "定期:" + item.schedule.cron.month + "月" + item.schedule.cron.day_of_month + "日" + item.schedule.cron.hour + "时" + item.schedule.cron.minute + "分" + item.schedule.cron.second + "秒" + "  星期" + item.schedule.cron.day_of_week
            } else {
              item.plan = "未计划"
            }
          })
          self.showLoading = false
        } else {
          self.showLoading = false
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("获取任务列表错误")
      }
    },
    // 禁用 启用任务
    async handBanClick(row, isBan) {
      const self = this
      let xData = {
        "ids-0": row.id,
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
          if (isBan == "yes") {
            row.enabled = true
          } else {
            row.enabled = false
          }
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 批量启用禁用
    async batchRun(isban) {
      const self = this
      if (self.selection_id.length == 0) {
        self.$Message.info("请选择任务 ")
      } else {
        let xData = {
          enable: isban
        }
        for (let i = 0; i < self.selection_id.length; i++) {
          xData[`ids-${i}`] = self.selection_id[i]
        }
        try {
          const res = await self.axios({
            method: "post",
            url: self.$store.state.baseurl + "api/job/enable",
            params: xData
          })
          if (res.data.code == 0) {
            self.getTASKList()
          } else {
            self.$Message.error(res.data.error_message)
          }
        } catch (err) {
          self.$Message.error("启用或禁用任务错误")
        }
      }
    },
    // 运行任务
    async handRunClick(row) {
      const self = this
      if (self.isPress == false) {
        self.isPress = true
        let xData = {
          id: row.id,
        }
        try {
          const res = await self.axios({
            method: "post",
            url: self.$store.state.baseurl + "api/job/run",
            params: xData
          })
          console.log(res);
          if (res.data.code == 0) {
            this.getTASKList()
            self.isPress = false
          } else {
            self.isPress = false
            self.$Message.error(res.data.error_message)
          }
        } catch (err) {
          console.log(err);
          self.$Message.error("运行任务错误")
        }
      }
    },
    // 搜索任务
    async searchTask() {
      this.current = 1
      this.getTASKList()
    },
    filter(col) {
      const self = this
      self.isFilter = true
      // console.log(col);
      if (col.title == "类型") {
        self.current = 1
        if (col._filterChecked.length == 2 || col._filterChecked.length == 0) {
          self.isFilter = false
          self.getTASKList()
        } else if (col._filterChecked[0] == "普通任务") {
          let xData = {
            p: self.current,
            psize: self.pageSize,
            category: "TASK"
          }
          self.fData = xData
          self.filterTASKList(xData)
        } else if (col._filterChecked[0] == "服务任务") {
          let xData = {
            p: self.current,
            psize: self.pageSize,
            category: "SERVICE"
          }
          self.fData = xData
          self.filterTASKList(xData)
        }
      } else if (col.title == "执行计划") {
        self.current = 1
        if (col._filterChecked.length == 3 || col._filterChecked.length == 0) {
          self.isFilter = false
          self.getTASKList()
        } else if (col._filterChecked.length == 1) {
          if (col._filterChecked[0] == "定点") {
            let xData = {
              p: self.current,
              psize: self.pageSize,
              schedule: "at"
            }
            self.fData = xData
            self.filterTASKList(xData)
          } else if (col._filterChecked[0] == "定期") {
            let xData = {
              p: self.current,
              psize: self.pageSize,
              schedule: "cron"
            }
            self.fData = xData
            self.filterTASKList(xData)
          } else if (col._filterChecked[0] == "未计划") {
            let xData = {
              p: self.current,
              psize: self.pageSize,
              schedule: "unknown"
            }
            self.fData = xData
            self.filterTASKList(xData)
          }
        }
      } else if (col.title == "状态") {
        self.current = 1
        console.log(col._filterChecked);
        if (col._filterChecked.length == 0) {
          self.isFilter = false
          self.getTASKList()
        } else if (col._filterChecked[0] == "启用") {
          let xData = {
            p: self.current,
            psize: self.pageSize,
            enabled: "yes"
          }
          self.fData = xData
          self.filterTASKList(xData)
        } else {
          let xData = {
            p: self.current,
            psize: self.pageSize,
            enabled: "no"
          }
          self.fData = xData
          self.filterTASKList(xData)
        }

      }
    },
    // 筛选任务列表
    async filterTASKList(paramsF) {
      const self = this
      try {
        const xData = paramsF
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/job/list",
          params: {
            ...xData,
            search_key: self.search
          }
        })
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
          })
        }
      } catch (err) {
        self.$Message.error("获取任务列表错误")
      }
    },
    handleCopyTask(row) {
      this.copyTask = row
      this.newTask = true
    },
    // page改变
    pageChange(index) {
      this.current = index
      if (this.isFilter) {
        this.fData.p = this.current
        this.filterTASKList(this.fData)
      } else {
        this.getTASKList()
      }
    },
    pageSizeChange(size) {
      this.pageSize = size
      localStorage.setItem("pageSize", size)
      this.$store.commit("changePageSize", size)
      if (this.isFilter) {
        this.fData.psize = this.pageSize
        this.filterTASKList(this.fData)
      } else {
        this.getTASKList()
      }
    },
    // 列表选中
    selection_change(selection) {
      this.selection_id = []
      if (selection.length > 0) {
        selection.forEach(item => {
          this.selection_id.push(item.id)
        })
      }

      console.log(this.selection_id)
    },
    toRecord(row) {
      this.$router.push({ path: "/record", query: { id: row.id, category: "job_id", name: row.title } })
    },
    // 模态框相关
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
        if (this.isFilter) {
          this.fData.p = this.current
          this.filterTASKList(this.fData)
        } else {
          this.getTASKList()
        }
      } else if (isOperation == "copy") {
        this.handleCopyTask(copyTask)
      }
    },
  },
  mounted() {
    const self = this
    self.pageSize = self.pageSizeC
    const item = document.getElementsByClassName("ivu-table-filter-select-item")
    if (item[1] != undefined) {
      item[1].innerHTML = "<i-icon class='ivu-icon ivu-icon-md-list' style='font-size:20px'></i-icon>普通任务"
    }
    if (item[2] != undefined) {
      item[2].innerHTML = "<i-icon class='ivu-icon ivu-icon-md-cloud' style='font-size:20px'></i-icon>服务任务"
    }
    self.getTASKList()
  },
}
</script>

<style scoped>
.task-top {
  margin-top: 10px;
  margin-bottom: 10px;
}
.task-button {
  margin-right: 5px;
}
.task-search {
  min-width: 302px;
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
  overflow-x: auto !important;
}
.task-table {
  overflow: visible;
}
>>> .ivu-icon-ios-help-circle {
  display: none !important;
}
</style>