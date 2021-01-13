<template>
  <div>
    <i-modal
      :value="log"
      @on-cancel="cancle"
      width="100%"
      class="logModal"
      footer-hide
      @on-visible-change="modalShow()"
    >
      <i-row style="margin:15px 0 30px 0">
        <i-col span="4" style="marginTop:-8px">
          <span class="title">任务名/爬虫名</span>
        </i-col>
        <i-col span="8">
          <i-datePicker
            type="date"
            placeholder="Select date"
          ></i-datePicker>
          <i-timePicker
            type="time"
            placeholder="Select time"
          ></i-timePicker>
        </i-col>
        <i-col
          span="7"
          class="log-search"
        >
          <i-input
            placeholder="关键词搜索"
            style="width: 200px"
          />
          <i-button
            type="info"
            icon="md-search"
            class="search"
          >搜索</i-button>
        </i-col>
        <i-col span="2">
          <i-select
            style="width:100px"
            placeholder="爬虫序号"
            :value="reptile"
          >
          </i-select>
        </i-col>
        <i-col span="3">
          <i-select
            style="width:100px"
            placeholder="级别筛选"
            :value="level"
          >
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
          :total="LogData.length"
          :page-size-opts=[10,20,30,40,50,100]
          size="small"
          show-elevator
          show-sizer
          show-total
          placement="top"
          :current="current"
          :page-size="pageSize"
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
            if (params.row.level === "WARNING") {
              return h("span", { class: ["waring"] }, params.row.level)
            } else if (params.row.level === "ERROR") {
              return h("span", { class: ["error"] }, params.row.level)
            } else {
              return h("span", params.row.level)
            }
          }
        },
        {
          title: "时间",
          key: "时间",
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
        {
          "level": "INFO",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        },
        {
          "level": "WARNING",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        },
        {
          "level": "ERROR",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        },
        {
          "level": "INFO",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        },
        {
          "level": "WARNING",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        },
        {
          "level": "ERROR",
          "时间": "2021年1月12日10:35:29",
          "message": "这是一条日志",
          "screenshot": "截图名称点击可查看"
        }
      ],
      time: "",
      reptile: "",
      level: "",
      current: 1,
      pageSize: 10
    }
  },
  props: {
    log: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit('cancleLogModal')
    },
    modalShow() {
      if (this.log == true) {
        let waringList = document.getElementsByClassName("waring")
        for (let i = 0; i < waringList.length; i++) {
          waringList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
            item.style.background = "yellow"
          })
        }
        let errorList = document.getElementsByClassName("error")
        for (let i = 0; i < errorList.length; i++) {
          errorList[i].parentNode.parentNode.parentNode.childNodes.forEach((item) => {
            item.style.background = "red"
          })
        }

      }
    }
  },
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