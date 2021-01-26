<template>
  <div>
    <i-modal
      :value="log"
      @on-cancel="cancle"
      width="100%"
      class="logModal"
      footer-hide
    >
      <i-row style="margin:15px 0 30px 0">
        <i-col
          span="4"
          style="marginTop:-8px"
        >
          <span class="title">{{logDetail.title}}</span>
        </i-col>
        <i-col span="8">
          <i-datePicker
            type="datetimerange"
            placeholder="Select date and time"
            style="width: 320px"
            v-model="date"
            @on-change="dateChange"
            @on-clear="dateClear"
          ></i-datePicker>
        </i-col>
        <i-col
          span="7"
          class="log-search"
        >
          <i-input
            placeholder="关键词搜索"
            style="width: 200px"
            v-model="search"
            clearable
            @on-clear="getLogList()"
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
            @click="getLogList()"
          >搜索</i-button>
        </i-col>
        <i-col span="2">
          <i-select
            style="width:100px"
            placeholder="爬虫序号"
            v-model="reptile"
            @on-change="indexChange"
            clearable
          >
            <i-option
              :value="item"
              :key="index"
              v-for="(item,index) in reptileArr"
            >{{item}}</i-option>
          </i-select>
        </i-col>
        <i-col span="3">
          <i-select
            style="width:100px"
            placeholder="级别筛选"
            v-model="level"
            @on-change="levelChange"
            clearable
          >
            <i-option :value="'DEBUG'">DEBUG</i-option>
            <i-option :value="'INFO'">INFO</i-option>
            <i-option :value="'WARNING'">WARNING</i-option>
            <i-option :value="'ERROR'">ERROR</i-option>
            <i-option :value="'CRITICAL'">CRITICAL</i-option>
          </i-select>
        </i-col>
      </i-row>
      <i-table
        :columns="columns1"
        :data="LogData"
        border
      >

        <template
          slot="message"
          slot-scope="{ row }"
        >
          <div v-html="row.message">
          </div>
        </template>
        <template
          slot="screenshot"
          slot-scope="{ row }"
        >
          <div>
            <a
              href=""
              style="color:#057009;"
            >{{row.screenshot}}</a>
          </div>
        </template>
      </i-table>
      <div class="page">
        <i-page
          :total="total"
          :page-size-opts=[50,100]
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
    </i-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: "级别",
          key: "level",
          width: 200,
          align: 'center',
          resizable: true,
          render: (h, params) => {
            if (params.row.level == "WARNING") {
              return h("span", { class: ["waring"] }, params.row.level)
            } else if (params.row.level == "ERROR") {
              return h("span", { class: ["error"] }, params.row.level)
            } else {
              return h("span", params.row.level)
            }
          }
        },
        {
          title: "时间",
          key: "add_time",
          width: "300",
          align: 'center',
          resizable: true,
        },
        {
          title: "消息",
          key: "message",
          slot: "message",
          align: 'center',
          resizable: true,
        },
        {
          title: "截图",
          key: "screenshot",
          slot: "screenshot",
          width: 250,
          align: 'center',
          resizable: true,
        }
      ],
      LogData: [
      ],
      reptile: 0,
      reptileArr: [],
      level: "",
      current: 1,
      pageSize: 50,
      total: 0,
      search: "",
      isfilter: false,
      filterData: {},
      logDataIO: [],
      id: "",
      date: ""
    }
  },
  props: {
    log: {
      type: Boolean,
      default: false
    },
    logDetail: {
      type: Object
    }
  },
  watch: {
    logDetail(newValue) {
      if (newValue.id != null) {
        if (newValue.crawler_count > 0) {
          for (let i = 0; i < newValue.crawler_count; i++) {
            this.reptileArr[i] = i + 1
          }
        }
        this.id = newValue.id
        this.getLogList()
      }
    }
  },
  methods: {
    cancle() {
      this.reptile = 0
      this.search = ""
      this.level = ""
      this.date = ""
      this.$emit('cancleLogModal')
    },
    // 获取log列表
    async getLogList(data) {
      setTimeout(() => {
        let waringList = document.getElementsByClassName("waring")
        let errorList = document.getElementsByClassName("error")
        for (let i = 0; i < waringList.length; i++) {
          waringList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
            item.style.background = "#fff"
          })
        }
        for (let i = 0; i < errorList.length; i++) {
          errorList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
            item.style.background = "#fff"
          })
        }
      }, 0)
      const self = this
      const xData = {
        p: self.current,
        psize: self.pageSize,
        run_log_id: self.id,
        search_key: self.search,
        level: self.level,
        index: self.reptile,
        ...data
      }
      const res = await self.axios({
        method: "get",
        url: self.$store.state.baseurl + "api/log/list",
        params: xData
      })
      console.log(xData)
      console.log(res.data)
      if (res.data.code == 0) {
        this.LogData = res.data.data.page
        this.total = res.data.data.total
        this.LogData.forEach(item => {
          item.add_time = self.$moment(new Date(item.add_time * 1000)).format("llll")
        })
        setTimeout(() => {
          let waringList = document.getElementsByClassName("waring")
          let errorList = document.getElementsByClassName("error")
          for (let i = 0; i < waringList.length; i++) {
            waringList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
              item.style.background = "yellow"
            })
          }
          for (let i = 0; i < errorList.length; i++) {
            errorList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
              item.style.background = "red"
            })
          }
        }, 0)
      } else {
        self.$Message.error(res.data.error_message)
      }
    },
    // page改变
    pageChange(index) {
      this.current = index
      if (this.isfilter) {
        this.getLogList(this.filterData)
      } else {
        this.getLogList()
      }
    },
    pageSizeChange(size) {
      this.pageSize = size
      if (this.isfilter) {
        this.getLogList(this.filterData)
      } else {
        this.getLogList()
      }
    },
    dateChange(value) {
      console.log(value);
      if (value.length > 0) {
        if (value[0] != "") {
          this.isfilter = true
          const data = {
            start_time: value[0],
            end_time: value[1]
          }
          this.filterData = data
          this.getLogList(data)
        }
      }
    },
    dateClear() {
      this.isfilter = false
      this.getLogList()
    },
    levelChange() {
      this.getLogList()
    },
    indexChange(value) {
      if (value == undefined) {
        this.reptile = 0
      }
      this.getLogList()
    }
  },
  // sockets: {
  //   connect: function () {
  //     console.log("connect");
  //   },
  //   "streaming-log": function (res) {
  //     console.log(res)
  //   }
  // }
}
</script>

<style  scoped>
>>> .ivu-modal {
  top: 0px !important;
  height: 100%;
  overflow: hidden;
}
>>> .ivu-modal-content {
  height: 100%;
}
>>> .ivu-modal-body {
  height: 100%;
}
>>> .ivu-table-column-center {
  height: 24px !important;
}
.title {
  color: #212891;
  font-size: 1.7rem;
}
.search {
  margin-left: 50px;
}
.page {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
</style>