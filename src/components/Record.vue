<template>
  <div class="record">
    <div class="record-top">
      <i-row style="width:100%">
        <i-col
          span="12"
          class="record-button-group"
        >
          <span style="marginRight:20px;fontSize:20px">{{taskTitle}}</span>
          <i-button
            type="success"
            icon="md-checkmark"
            class="record-button"
          >批量恢复运行</i-button>
          <i-button
            type="error"
            icon="md-pause"
            class="record-button"
          >批量暂停</i-button>
          <i-button
            type="error"
            icon="md-close"
            class="record-button"
          >批量取消</i-button>
        </i-col>
        <i-col
          span="12"
          class="record-search"
        >
          <i-input
            v-model="search"
            placeholder="关键词搜索"
            style="width: 200px"
            @on-clear="getRecordList"
            clearable
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
            @click="searchRecord"
          >搜索</i-button>
        </i-col>
      </i-row>
    </div>
    <div class="record-main">
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
        :data="RecordData"
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
              @click="handleRecordDetail(row)"
            >查看配置</i-button>
          </div>
        </template>
        <template
          slot="operation"
          slot-scope="{ row }"
        >
          <div>
            <!-- 恢复运行 -->
            <i-tooltip
              content="恢复运行"
              style="margin-right: 20px"
            >
              <i-button
                type="success"
                size="small"
                icon="md-checkmark"
                @click="resume(row)"
              ></i-button>
            </i-tooltip>
            <!-- 暂停 -->
            <i-tooltip
              content="暂停运行"
              style="margin-right: 20px"
            >
              <i-button
                type="error"
                size="small"
                icon="md-pause"
                @click="pause(row)"
              ></i-button>
            </i-tooltip>
            <!-- 开启爬虫 -->
            <i-tooltip
              content="启动爬虫"
              style="margin-right: 20px"
            >
              <i-button
                type="success"
                size="small"
                icon="md-arrow-round-up"
                @click="start(row)"
              ></i-button>
            </i-tooltip>
            <!-- 停止爬虫 -->
            <i-tooltip
              content="停止爬虫"
              style="margin-right: 20px"
            >
              <i-button
                type="error"
                size="small"
                icon="md-radio-button-on"
                @click="stop(row)"
              ></i-button>
            </i-tooltip>
            <!-- 取消 -->
            <i-tooltip
              content="取消运行"
              style="margin-right: 20px"
            >
              <i-button
                type="error"
                size="small"
                icon="md-close"
                @click="cancel(row)"
              ></i-button>
            </i-tooltip>
          </div>
        </template>
        <template slot="log">
          <div>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px"
            >爬虫</i-button>
            <i-button
              type="primary"
              size="small"
              style="margin-right: 5px"
            >日志</i-button>
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
    </div>

    <i-recordDetail
      :recordDetail="recordDetail"
      :detail="detail"
      @cancleRecordDetailModal="handleCancleRecordDetail"
    ></i-recordDetail>
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
import recordDetail from './Record/RecordDetail'
export default {
  name: "Record",
  data() {
    var global = this
    return {
      columns1: [
        {
          type: 'selection',
          width: 30,
          align: 'center',
          resizable: true,
        },
        {
          title: "执行时间",
          key: "invoke_datetime",
          width: 280,
          align: 'center',
          resizable: true,
          renderHeader(h, params) {
            if (params.column.daterange) {
              let time = ""
              time = params.column.daterange[0] + "-" + params.column.daterange[1]
              return h('span', [
                h('span', '执行时间'),
                h('i-poptip', {
                  props: {
                    title: "日期过滤",
                    content: "content",
                    placement: "right-start",
                    transfer: true,
                    trigger: 'click',
                    width: 400
                  },
                  style: {
                    'margin-left': '5px',
                    'cursor': 'pointer'
                  }
                },
                  [h('i-icon', {
                    props: {
                      type: 'ios-funnel',
                      size: 16
                    }
                  }),
                  h("span", {
                    style: {
                      'white-space': 'pre-line',
                      'font-size': '10px',
                      'color': 'black'
                    }
                  }, time),
                  h('i-datePicker', {
                    slot: "content",
                    props: {
                      type: 'datetimerange',
                      placeholder: '选择日期时间区间',
                      transfer: false,
                      format: "yyyy/MM/dd HH:mm:ss"
                    },
                    style: {
                      position: 'static',
                      width: '320px'
                    },
                    on: {
                      'on-change': (daterange) => {
                        params.column.daterange = daterange
                        console.log(daterange)
                        global.daterange = daterange
                        global.TimeChange(daterange)
                      }
                    }
                  })
                  ])
              ])
            }
            else {
              return h('span', [
                h('span', '执行时间'),
                h('i-poptip', {
                  props: {
                    title: "日期过滤",
                    content: "content",
                    placement: "right-start",
                    transfer: true,
                    trigger: 'click',
                    width: 400
                  },
                  style: {
                    'margin-left': '5px',
                    'cursor': 'pointer'
                  }
                },
                  [h('i-icon', {
                    props: {
                      type: 'ios-funnel',
                      size: 16
                    }
                  }),
                  h('i-datePicker', {
                    slot: "content",
                    props: {
                      type: 'datetimerange',
                      placeholder: '选择日期时间区间',
                      transfer: false,
                      format: "yyyy/MM/dd HH:mm:ss"
                    },
                    style: {
                      position: 'static',
                      width: '320px'
                    },
                    on: {
                      'on-change': (daterange) => {
                        params.column.daterange = daterange
                        console.log(daterange)
                        global.daterange = daterange
                        global.TimeChange(daterange)
                      }
                    }
                  })
                  ])
              ])
            }
          }
        },
        {
          title: '名称',
          key: "title",
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
              label: "执行任务",
              value: "执行任务"
            },
            {
              label: "调用服务",
              value: "调用服务"
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === "执行任务") {
              return row.category == "JOB"
            } else if (value === "服务任务") {
              return row.category == "SERVICE"
            }
          },
          render: (h, params) => {
            if (params.row.category === "JOB") {
              return h('i-icon', { props: { type: "md-arrow-round-up", size: '20' } })
            } else if (params.row.category === "SERVICE") {
              return h('i-icon', { props: { type: 'md-open', size: '20' } })
            }
          },
          renderHeader(h, params) {
            global.columns4 = params.column._filterChecked
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
          title: '配置内容',
          key: 'configuration',
          slot: 'configuration',
          align: 'center',
          width: 120,
          resizable: true,
        },
        {
          title: "状态",
          key: 'status',
          width: 100,
          align: 'center',
          resizable: true,
          filters: [
            {
              label: "INIT, 刚提交",
              value: "INIT"
            },
            {
              label: "SENT, 已提交爬虫端",
              value: "SENT"
            },
            {
              label: "READY, 爬虫已启动。尚未开始运行任务；或任务已经全部完成，即将由scheduler关闭",
              value: "READY"
            },
            {
              label: "RUNNING, 正在爬取",
              value: "RUNNING"
            },
            {
              label: "PAUSED, 爬取暂停，爬虫待命，任务队列尚在，可恢复执行",
              value: "PAUSED"
            },
            {
              label: "STOPPED, 爬取停止，爬虫停止，任务队列尚在，可恢复执行",
              value: "STOPPED"
            },
            {
              label: "CANCELED, 结束状态：取消，任务队列已删除，不可恢复",
              value: "CANCELED"
            },
            {
              label: "DONE, 结束状态：爬取任务已经完成，等待标记为SUCCESS",
              value: "DONE"
            },
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "INIT") {
              return row.status == "INIT"
            } else if (value === "SENT") {
              return row.status == "SENT"
            } else if (value === "READY") {
              return row.status == "READY"
            } else if (value === "RUNNING") {
              return row.status == "RUNNING"
            } else if (value === "PAUSED") {
              return row.status == "PAUSED"
            } else if (value === "STOPPED") {
              return row.status == "STOPPED"
            } else if (value === "CANCELED") {
              return row.status == "CANCELED"
            } else if (value === "DONE") {
              return row.status == "DONE"
            }
          },
          renderHeader(h, params) {
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
          title: '运行结果',
          key: 'result',
          align: 'center',
          width: 100,
          resizable: true,
          filters: [
            {
              label: 'UNKNOWN',
              value: "UNKNOWN"
            },
            {
              label: 'SUCCESS',
              value: "SUCCESS"
            },
            {
              label: 'FAILURE',
              value: "FAILURE"
            }
          ],
          filterMethod(value, row) {
            if (value === "UNKNOWN") {
              return row.result == "UNKNOWN"
            } else if (value === "SUCCESS") {
              return row.result == "SUCCESS"
            } else if (value === "FAILURE") {
              return row.result == "FAILURE"
            }
          },
          renderHeader(h, params) {
            if (params.index === 7) {
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
          title: "查看",
          key: 'log',
          slot: 'log',
          align: 'center',
          width: 120,
          resizable: true,
        },

      ],
      RecordData: [],
      search: "",
      current: 1,
      total: 0,
      pageSize: null,
      showLoading: false,
      recordDetail: false,
      detail: {},
      isFilter: false,
      daterange: [],
      filterData: {},
      queryID: "",
      queryCategory: "",
      taskTitle: ""
    }
  },
  computed: {
    pageSizeC() {
      return this.$store.state.pageSize
    }
  },
  components: {
    "i-recordDetail": recordDetail,
  },
  methods: {
    // 模态框
    handleRecordDetail(row) {
      this.recordDetail = true
      this.detail = row
      // console.log(row);
    },
    handleCancleRecordDetail() {
      this.recordDetail = false
    },
    // page改变
    pageChange(index) {
      this.current = index
      if (this.isFilter == true) {
        this.getRecordList("", this.filterData)
      } else {
        this.getRecordList()
      }
    },
    pageSizeChange(size) {
      this.pageSize = size
      localStorage.setItem("pageSize", size)
      this.$store.commit("changePageSize", size)
      if (this.isFilter == true) {
        this.getRecordList("", this.filterData)
      } else {
        this.getRecordList()
      }
    },
    // 获取运行记录列表
    async getRecordList(search, filter) {
      const self = this
      let searchKey = ""
      self.showLoading = true
      if (search) {
        searchKey = search
      }
      try {
        let res = {}
        if (self.queryID != "") {
          if (self.queryCategory == "job_id") {
            res = await self.axios({
              method: "get",
              url: self.$store.state.baseurl + "api/run_log/list",
              params: {
                p: self.current,
                psize: self.pageSize,
                search_key: searchKey,
                job_id: self.queryID,
                ...filter
              }
            })
          } else {
            res = await self.axios({
              method: "get",
              url: self.$store.state.baseurl + "api/run_log/list",
              params: {
                p: self.current,
                psize: self.pageSize,
                search_key: searchKey,
                service_id: self.queryID,
                ...filter
              }
            })
          }
        } else {
          res = await self.axios({
            method: "get",
            url: self.$store.state.baseurl + "api/run_log/list",
            params: {
              p: self.current,
              psize: self.pageSize,
              search_key: searchKey,
              ...filter
            }
          })
        }
        console.log(res);
        if (res.data.code == 0) {
          self.RecordData = res.data.data.page
          self.total = res.data.data.total
          self.showLoading = false
        } else {
          self.$Message.error(res.data.error_message)
        }
        self.showLoading = false
      } catch (err) {
        self.$Message.error("获取任务列表错误")
      }
    },
    // 搜索运行记录
    searchRecord() {
      this.current = 1
      this.getRecordList(this.search)
    },
    // 筛选时间
    TimeChange(daterange) {
      console.log()
      if (daterange[0] != "") {
        this.isFilter = true
        const data = {
          start_time: this.$moment(new Date(daterange[0])).format('YYYY-MM-DD HH:mm:ss'),
          end_time: this.$moment(new Date(daterange[1])).format('YYYY-MM-DD HH:mm:ss')
        }
        this.filterData = data
        this.getRecordList("", data)
      } else {
        this.isFilter = false
        this.getRecordList()
      }
    },
    // 筛选
    filter(col) {
      const self = this
      self.isFilter = true
      if (col.title == "状态") {
        self.current = 1
        if (col._filterChecked.length == 8 || col._filterChecked.length == 0) {
          self.isFilter = false
          self.getRecordList()
        } else {
          // console.log(col._filterChecked)
          const l = col._filterChecked.length
          let data = {}
          for (let i = 0; i < l; i++) {
            data[`status-${i}`] = col._filterChecked[i]
          }
          self.filterData = data
          self.getRecordList("", data)
        }
      } else if (col.title == "运行结果") {
        self.current = 1
        if (col._filterChecked.length == 3 || col._filterChecked.length == 0) {
          self.isFilter = false
          self.getRecordList()
        } else {
          console.log(col._filterChecked)
          const l = col._filterChecked.length
          let data = {}
          for (let i = 0; i < l; i++) {
            data[`result-${i}`] = col._filterChecked[i]
          }
          self.filterData = data
          self.getRecordList("", data)
        }
      }
    },
    // 恢复运行
    async resume(col) {
      // console.log(col);
      const self = this
      let xData = {
        id: col.id
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/run_log/resume",
          params: xData
        })
        // console.log(res);
        if (res.data.code == 0) {
          self.getRecordList()
        } else if (res.data.data == -2) {
          self.$Message.error(res.data.code)
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 暂停运行
    async pause(col) {
      // console.log(col);
      const self = this
      let xData = {
        id: col.id
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/run_log/pause",
          params: xData
        })
        console.log(res);
        if (res.data.code == 0) {
          self.getRecordList()
        } else if (res.data.data == -2) {
          self.$Message.error(res.data.code)
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 取消运行
    async cancel(col) {
      // console.log(col);
      const self = this
      let xData = {
        id: col.id
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/run_log/cancel",
          params: xData
        })
        console.log(res)
        if (res.data.code == 0) {
          self.getRecordList()
        } else if (res.data.data == -2) {
          self.$Message.error(res.data.code)
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 开启爬虫
    async start(col) {
      // console.log(col);
      const self = this
      let xData = {
        id: col.id
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/run_log/start",
          params: xData
        })
        console.log(res);
        if (res.data.code == 0) {
          self.getRecordList()
        } else if (res.data.data == -2) {
          self.$Message.error(res.data.code)
        }
        else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 停止爬虫
    async stop(col) {
      // console.log(col);
      const self = this
      let xData = {
        id: col.id
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/run_log/stop",
          params: xData
        })
        console.log(res);
        if (res.data.code == 0) {
          self.getRecordList()
        } else if (res.data.data == -2) {
          self.$Message.error(res.data.code)
        }
        else {
          self.$Message.error(res.data.error_message)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    }
  },
  mounted() {
    const self = this
    self.pageSize = self.pageSizeC
    self.queryID = self.$route.query.id
    self.queryCategory = self.$route.query.category
    if (self.queryCategory == "job_id") {
      self.taskTitle = `当前任务：${self.$route.query.name}`
    } else if (self.queryCategory == "service_id") {
      self.taskTitle = `当前服务：${self.$route.query.name}`
    }
    self.getRecordList()
  },
}
</script>

<style  scoped>
.record-top {
  margin-top: 10px;
  margin-bottom: 10px;
}
.record-button {
  margin-right: 5px;
}
.search {
  margin-left: 20px;
}
.record-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
</style>