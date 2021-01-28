<!--  -->
<template>
<div class="spider">
    <div class="spider-top">
          <i-button
            style="color: #fff;background-color: #057009;"
            onMouseOver="this.style.color='#b6f204'"
            onMouseOut="this.style.color='#fff'"
            icon="md-power"
            class="spider-task"
            @click="handleNewSpider"
          >新建爬虫</i-button>
    </div>
    <div class="spider-main">
        <i-table
            class="spider-table"
            :columns="columns1"
            :data="SpiderData"
            stripe
            border
            row-key='NAME'
        >
        <template 
        slot="operation"
        slot-scope="{ row }"
        v-if="row.showButton === true"
        >
            <!--停止-->
            <i-button type="error" size="small" style="margin-right: 15px" icon="md-square" @click="handStopClick(row)"></i-button>
            <!--恢复-->
            <i-button type="success" size="small" icon="md-play" @click="handPauseClick(row,'resume')" v-if="row.STATUS === 'PAUSED'"></i-button>
            <!--暂停-->
            <i-button type="success" size="small" icon="md-pause" @click="handPauseClick(row,'pause')"    v-if="row.STATUS === 'RUNNING'||row.STATUS === 'READY'"></i-button>
            <i-button type="primary" size="small" style="margin-left: 15px" @click="handleLog">查看日志</i-button>
            <i-button type="primary" size="small" style="margin-left: 15px" @click="changeSpiderCount(row)">修改爬虫数</i-button>
        </template>
        </i-table>

        <!-- 隐藏组件 -->
        <i-log
        :log="log"
        @cancleLogModal="cancleLogModal"
      ></i-log>
      <i-newspider
      :newspider="newspider"
      @cancleCreateSpider="cancleCreateSpider"
      @confirm="confirm"
      @close="close"
      :spiderData="changeSpiderData"
      :create ="create"
      ></i-newspider>

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
</div>
</template>

<script>
import Log from "./Log";
import NewSpider from "./SystemManagement/Spider/NewSpider";
export default {
  name: "spider",
  components: {
    "i-log": Log,
    "i-newspider": NewSpider
  },
  data() {
    //var global =this
    return {
      search: "",
      columns1: [
        {
          type: "selection",
          width: 50,
          align: "center",
          resizable: true
        },
        {
          title: "爬虫名",
          key: "NAME",
          width: 180,
          align: "left",
          resizable: true,
          tree: true,
          filters: [],
          filterMultiple: true,
          filterMethod(value, row) {
            if (row.NAME == value) {
              return row;
            }
          },
          renderHeader: h => {
            return h(
              "span",
              {
                style: {
                  "text-align": "center !important",
                  display: "inline-block"
                }
              },
              "爬虫名"
            );
          }
        },
        {
          title: "爬虫idx",
          key: "INDEX",
          width: 200,
          align: "center",
          resizable: true
        },
        {
          title: "所在机器",
          key: "NODE",
          minWidth: 150,
          align: "center",
          resizable: true,
          filters: [
            {
              label: "crawer-1",
              value: "crawer-1"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "crawer-1") {
              return row.NODE == "crawer-1";
            }
          }
        },
        {
          title: "运行时间",
          key: "runtime",
          minWidth: 150,
          align: "center",
          resizable: true,
          render: (h, params) => {
            //console.log(params.row['CURRENT STATE'])
            //console.log(params.row['DESIRED STATE'])
            let runtime = "";
            runtime = params.row["CURRENT STATE"].replaceAll(
              params.row["DESIRED STATE"],
              ""
            );
            return h("span", runtime);
          }
        },
        {
          title: "状态",
          key: "STATUS",
          minWidth: 150,
          align: "center",
          resizable: true,
          filters: [
            {
              label: "RUNNING",
              value: "RUNNING"
            },
            {
              label: "PAUSED",
              value: "PAUSED"
            },
            {
              label: "READY",
              value: "READY"
            },
            {
              label: "STOPPED",
              value: "STOPPED"
            },
            {
              label: "unenabled",
              value: "unenabled"
            },
            {
              label: "DONE",
              value: "DONE"
            }
          ],
          filterMultiple: true,
          filterMethod(value, row) {
            if (value === "RUNNING") {
              return row.STATUS == "RUNNING";
            } else if (value === "PAUSED") {
              return row.STATUS == "PAUSED";
            } else if (value === "READY") {
              return row.STATUS == "READY";
            } else if (value === "STOPPED") {
              return row.STATUS == "STOPPED";
            } else if (value === "unenabled") {
              return row.STATUS == "unenabled";
            } else if (value === "DONE") {
              return row.STATUS == "DONE";
            }
          },
          render: (h, params) => {
            if (params.row.STATUS === "READY") {
              return h("span", "READY");
            } else if (params.row.STATUS === "PAUSED") {
              return h("span", "PAUSED");
            } else if (params.row.STATUS === "STOPPED") {
              return h("span", "STOPPED");
            } else if (params.row.STATUS === "unenabled") {
              return h("span", "unenabled");
            } else if (params.row.STATUS === "RUNNING") {
              return h("span", "RUNNING");
            } else if (params.row.STATUS === "DONE") {
              return h("span", "DONE");
            } else {
              return h("span", params.row.STATUS);
            }
          },
          renderHeader(h, params) {
            //global.columns3 = params.column._filterChecked
            if (params.column._filterChecked.length != 0) {
              let column_Ck = params.column._filterChecked;
              let words = "";
              let line = 0;
              for (let i = 0; i < column_Ck.length; i++) {
                words += column_Ck[i] + "," + "\xa0\xa0";
                if ((i + 1) % 3 == 0 && i != 8) {
                  words += "\n";
                  line = line + 1;
                } else if (line == 2 && i == 8) {
                  words = words + "...";
                  break;
                }
              }
              words = words.trim();
              return h("span", [
                h("span", params.column.title),
                h(
                  "span",
                  {
                    style: {
                      "white-space": "pre-line",
                      "font-size": "10px",
                      color: "black"
                    }
                  },
                  "\n" + words + "\n"
                )
              ]);
            } else {
              return h("span", params.column.title);
            }
          }
        },
        {
          title: "操作",
          key: "operation",
          slot: "operation",
          minWidth: 150,
          align: "center",
          resizable: true
        }
      ],
      SpiderData: [],
      log: false,
      newspider: false,
      showLoading: false,
      singleArr: [],
      spiderNameFilters: [],
      changeSpiderData: 0,
      create: true
    };
  },

  computed: {},

  methods: {

    //获取爬虫列表
    async getSpiderList() {
      let self = this;
      self.showLoading = true;
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/spider/list"
        });
        console.log(res.data.data);
        if (res.data.code == 0) {
          //加入_showChildren属性
          for (let key of res.data.data) {
            key._showChildren = true;
            key.showButton = true;
          }
          //获取爬虫名filters
          for (let ele in res.data.data) {
            self.spiderNameFilters.push({
              label: res.data.data[ele].NAME,
              value: res.data.data[ele].NAME
            });
          }
          //数据去重
          let arr = self.spiderNameFilters;
          var newArr = []; //存新数组
          var obj = {}; //存处理后转成字符串的对象
          for (var i = 0; i < arr.length; i++) {
            var keys = Object.keys(arr[i]);
            keys.sort(function(a, b) {
              return Number(a) - Number(b);
            });
            var str = "";
            for (var j = 0; j < keys.length; j++) {
              str += JSON.stringify(keys[j]);
              str += JSON.stringify(arr[i][keys[j]]);
            }
            if (!Object.prototype.hasOwnProperty.call(obj, str)) {
              newArr.push(arr[i]);
              obj[str] = true;
            }
          }
          self.columns1[1].filters = newArr;
          //获取爬虫列表数据
          var resValues = Object.values(res.data.data);
          for (var ii in resValues) {
            self.singleArr = resValues[ii];
            self.SpiderData = self.SpiderData.concat(self.singleArr);
          }
          self.showLoading = false;
        }
        console.log(resValues)
      } catch (err) {
        self.$Message.error("获取爬虫列表错误");
      }
    },
    //暂停爬虫队列
    async handPauseClick(row, isUse) {
      const self = this;
      let xData = {
        name: row.NAME,
        do: isUse
      };
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/spider/operate",
          params: xData
        });
        console.log(xData);
        console.log(res);
        if (res.data.code == 0) {
          if (row.STATUS == "RUNNING") {
            row.STATUS = "PAUSED";
          } else {
            row.STATUS = "RUNNING";
          }
        }
      } catch (error) {
        self.$Message.error("挂起或恢复爬虫进程错误");
      }
    },
    //停止爬虫队列
    async handStopClick(row) {
      const self = this;
      self.showLoading = true;
      let xData = {
        name: row.NAME
      };
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/spider/stop",
          params: xData
        });
        console.log(res);
        self.SpiderData = [];
        self.getSpiderList();
        self.showLoading = false;
      } catch (error) {
        self.$Message.error("停止爬虫进程错误");
      }
    },
    handleLog() {
      this.log = true;
    },
    cancleLogModal() {
      this.log = false;
    },
    cancleCreateSpider() {
      this.newspider = false;
      console.log("aa", this.newspider);
    },
    handleNewSpider() {
      this.create = true;
      this.newspider = true;
      console.log(this.newspider);
    },
    changeSpiderCount(row) {
      this.changeSpiderData = row;
      this.create = false;
      this.newspider = true;
    },
    confirm() {
      this.newspider = false;
      this.SpiderData = [];
      this.getSpiderList();
      console.log("bb", this.newspider);
    },
    close() {
      this.newspider = false;
    }
  },

  created() {},

  mounted() {
    const self = this;
    self.getSpiderList();
  }
};
</script>
<style scoped>
.spider-top {
  margin-top: 10px;
  margin-bottom: 10px;
}
.spider-task {
  margin-left: 1000px;
}
.spider-main {
  padding: 0 20px;
}
>>> .ivu-table-cell {
  padding: 5px !important;
}
>>> .ivu-table-overflowX {
  overflow-x: unset !important;
}
.spider-table {
  font-weight: 450;
  overflow: auto !important;
}
</style>