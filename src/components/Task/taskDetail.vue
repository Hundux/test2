<template>
  <div>
    <i-modal
      title="任务详情"
      :value="taskDetail"
      @on-cancel="cancle(true)"
      width="100%"
      class="taskDetailModal"
      footer-hide
    >
      <i-row class="taskDetail-wrap">
        <i-col
          span="18"
          class="taskDetail-configure"
          style="height:98%"
        >
          <div
            class="configure"
            v-if="task.category=='TASK'"
          >
            <div
              v-if="task.content"
              style="height:100%"
            >
              <i-vueJsonEditor
                name="jsonData"
                :mode="'code'"
                lang="zh"
                v-if="task.content.spec"
                v-model="task.content.spec"
                class="vueJsonEditor"
              ></i-vueJsonEditor>
            </div>
          </div>
          <i-row
            v-else
            style="height:98%"
          >
            <i-col
              span="12"
              class="service_configure"
            >
              <div style="height:100%;position:relative">
                <p
                  class="copy_btn"
                  v-clipboard:copy="copy_spec"
                  v-clipboard:success="onCopy"
                >复制结果配置</p>
                <i-vueJsonEditor
                  name="jsonData"
                  :mode="'code'"
                  lang="zh"
                  v-model="spec"
                  @json-change="onJsonChange"
                  class="vueJsonEditor"
                >
                </i-vueJsonEditor>
              </div>
            </i-col>
            <i-col
              span="12"
              style="height:100%"
            >
              <div
                v-if="task.category=='SERVICE'"
                style="width:100%"
                class="params"
              >
                <div v-if="task.content.service_inst.params">
                  <i-row
                    class="configure-top"
                    style="width:100%;marginBottom:10px"
                  >
                    <i-col
                      span="4"
                      class="configure-top-one"
                    ><span>参数名</span></i-col>
                    <i-col span="8">参数值</i-col>
                    <i-col span="8">描述</i-col>
                    <i-col span="4">默认值</i-col>
                  </i-row>
                  <i-row
                    class="configure-body"
                    style="marginBottom:10px"
                    :key="index"
                    v-for="(item,index) in task.content.service_inst.service.params"
                  >
                    <i-col
                      span="4"
                      class="configure-body-one"
                      style="marginTop:8px"
                    ><span>{{item.name}}</span>
                    </i-col>
                    <i-col span="8">
                      <i-input
                        style="width:85%"
                        v-model="task.content.service_inst.params[item.name]"
                      ></i-input>
                    </i-col>
                    <i-col span="8">
                      <div class="description">{{item.description}}</div>
                    </i-col>
                    <i-col span="4">
                      <div class="description">{{item.default}}</div>
                    </i-col>
                  </i-row>
                </div>
              </div>
            </i-col>
          </i-row>
        </i-col>
        <i-col
          span="6"
          class="taskDetail-task"
        >
          <i-form
            label-position="right"
            :label-width="100"
            class="taskDetail-form"
          >
            <i-formItem label="名称：">
              <i-input
                style="width:250px"
                v-model="task.title"
              ></i-input>
            </i-formItem>
            <i-formItem label="执行计划：">
              <span>{{task.date ? task.date : '未计划'}}</span>
            </i-formItem>
            <i-formItem label="修改计划：">
              <i-select
                style="width:250px"
                v-model="updateTask.plan"
              >
                <i-option value="定点">定点</i-option>
                <i-option value="定期">定期</i-option>
              </i-select>
            </i-formItem>
            <i-row
              class="dataRow"
              v-if="updateTask.plan==='定点'"
              style="marginBottom:10px"
            >
              <i-col>
                <i-datePicker
                  type="date"
                  formate="date"
                  placeholder="Select date"
                  @on-change="dataChange"
                  v-model="updateTask.date"
                ></i-datePicker>
              </i-col>
            </i-row>
            <i-row
              class="dataRow"
              v-if="updateTask.plan==='定点'"
              style="marginBottom:10px"
            >
              <i-col>
                <i-timePicker
                  type="time"
                  placeholder="Select time"
                  @on-change="timeChange"
                  v-model="updateTask.time"
                ></i-timePicker>
              </i-col>
            </i-row>
            <i-row
              v-if="updateTask.plan==='定期'"
              class="period form-item"
              style="margin-left:20px"
            >
              <i-col
                span="3"
                class="time-col"
              ><span class="time">秒</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">分钟</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">小时</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">天</span></i-col>
              <i-col
                span="5"
                class="time-col"
              ><span class="time">星期几</span></i-col>
              <i-col
                span="3"
                class="time-col"
              ><span class="time">月</span></i-col>
            </i-row>
            <i-row
              v-if="updateTask.plan==='定期'"
              class="form-item"
              style="margin-bottom:10px;margin-left:20px"
            >
              <i-col span="3">
                <i-input
                  size="large"
                  style="width:40px;"
                  v-model="updateTask.second"
                ></i-input>
              </i-col>
              <i-col span="3">
                <i-input
                  size="large"
                  style="width:40px;"
                  v-model="updateTask.minute"
                >
                </i-input>
              </i-col>
              <i-col span="3">
                <i-input
                  size="large"
                  style="width:40px;"
                  v-model="updateTask.hour"
                ></i-input>
              </i-col>
              <i-col span="3">
                <i-input
                  size="large"
                  style="width:40px;"
                  v-model="updateTask.day"
                ></i-input>
              </i-col>
              <i-col span="5">
                <i-input
                  size="large"
                  style="width:68px;"
                  v-model="updateTask.week"
                ></i-input>
              </i-col>
              <i-col span="3">
                <i-input
                  size="large"
                  style="width:40px;s"
                  v-model="updateTask.month"
                ></i-input>
              </i-col>
            </i-row>
            <i-formItem
              label="所需爬虫数："
              class="form-item"
            >
              <i-input
                v-model="task.crawler_count"
                style="width:250px"
                type="number"
              ></i-input>
            </i-formItem>
            <i-formItem label="类型：">
              <i-select
                style="width:250px"
                disabled
                :placeholder="task.category"
              >
                <i-option value="执行配置">执行配置</i-option>
                <i-option value="调用服务">调用服务</i-option>
              </i-select>
            </i-formItem>
          </i-form>
          <div
            v-if="task.category=='SERVICE'"
            style="marginBottom:20px"
          >
            <span>服务名称：{{task.content.service_inst.service.title}}</span>
            <i-button
              type="text"
              style="color:#057009"
              @click="handleServerDetail()"
            >查看服务详情</i-button>
          </div>
          <!-- 服务详情模态框 -->
          <i-serverDetail
            :serverDetail="serverDetail"
            :serveDetailData="serveDetailData"
            @cancleServerDetailModal="handleCancleServerDetailModal"
          ></i-serverDetail>

          <div>
            <i-button
              type="primary"
              class="task-determine"
              @click="undateTask"
            >确定</i-button>
          </div>
          <p class="taskDetail-wrap-operation">操作栏</p>
          <i-buttongroup
            vertical
            style="width:80%"
          >
            <i-button
              type="success"
              icon="md-play"
              @click="runTask"
              :loading="isPress"
            >立即执行</i-button>
            <i-button
              type="success"
              iicon="md-checkmark"
              v-if="task.enabled === false"
              @click="handBanClick('yes')"
            >启用</i-button>
            <i-button
              type="error"
              icon="md-trash"
              @click="handBanClick('no')"
              v-else
            >禁用</i-button>
            <i-button
              type="primary"
              icon="md-copy"
              @click="handleCopy(task)"
            >复制</i-button>
          </i-buttongroup>
        </i-col>
      </i-row>
    </i-modal>
  </div>
</template>

<script>
import ServerDetail from '../Server/ServerDetail'
export default {
  data() {
    return {
      serverDetail: false,
      updateTask: {
        plan: "",
        date: "",
        time: "",
        second: "",
        minute: "",
        hour: "",
        day: "",
        month: "",
        week: "",
      },
      serverTaskDetail: {},
      serveDetailData: {},
      spec: {},
      copy_spec: "",
      isPress: false,
    }
  },
  props: {
    taskDetail: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
    }
  },
  watch: {
    task: {
      deep: true,
      handler: function (newValue) {
        console.log(newValue)
        if (newValue.plan == "定期") {
          this.updateTask.plan = "定期"
          this.updateTask.second = newValue.schedule.cron.second
          this.updateTask.minute = newValue.schedule.cron.minute
          this.updateTask.hour = newValue.schedule.cron.hour
          this.updateTask.day = newValue.schedule.cron.day_of_month
          this.updateTask.week = newValue.schedule.cron.day_of_week
          this.updateTask.month = newValue.schedule.cron.month
        } else if (newValue.plan == "定点") {
          this.updateTask.plan = "定点"
          this.updateTask.date = this.$moment(new Date(newValue.schedule.at)).format("YYYY-MM-DD")
          this.updateTask.time = this.$moment(newValue.schedule.at).format("HH:mm:ss")
        }
        if (newValue.content.service_inst != null) {
          let spec = JSON.stringify(newValue.content.service_inst.service.spec)
          let copy_spec = spec
          let params = newValue.content.service_inst.params
          console.log(params);
          if (params !== null) {
            for (const key in params) {
              spec = spec.replace(`$${key}$`, `$${key}:${params[key]}$`)
              copy_spec = copy_spec.replace(`$${key}$`, params[key])
              while (copy_spec.indexOf(`$${key}$`) != -1) {
                copy_spec = copy_spec.replace(`$${key}$`, params[key])
              }
              while (spec.indexOf(`$${key}$`) != -1) {
                spec = spec.replace(`$${key}$`, `$${key}:${params[key]}$`)
              }
            }
          }
          this.copy_spec = copy_spec
          this.spec = JSON.parse(spec)
        }
      }
    }
  },
  methods: {
    cancle(isOperation, task) {
      this.updateTask = {
        plan: "",
        date: "",
        time: "",
        second: "",
        minute: "",
        hour: "",
        day: "",
        month: "",
        week: "",
      }
      this.serverTaskDetail = {}
      this.$emit("cancleTaskDetailModal", isOperation, task)
    },
    handleServerDetail() {
      if (this.task.content.service_inst != null) {
        this.serveDetailData = this.task.content.service_inst.service
      }
      this.serverDetail = true
    },
    async handleCancleServerDetailModal() {
      const self = this
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/list",
          params: {
            search_key: self.task.content.service_inst.service.title
          }
        })
        console.log(res)
        if (res.data.code == 0) {
          if (res.data.data.page.length > 0) {
            self.task.content.service_inst.service = res.data.data.page[0]
          } else {
            self.$Message.error("更新服务数据出现错误")
          }
          self.serverDetail = false
        } else {
          this.serverDetail = false
          self.$Message.error(res.data.error_message)
        }
      } catch (error) {
        self.$Message.error("获取服务列表错误")
      }
    },
    async runTask() {
      const self = this
      self.isPress = true
      let xData = {
        id: self.task.id,
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/run",
          params: xData
        })
        if (res.data.code === 0) {
          self.isPress = false
          self.cancle(true)
        }
      } catch (err) {
        self.$Message.error("运行任务错误")
      }
    },
    async handBanClick(isBan) {
      const self = this
      let xData = {
        "ids-0": self.task.id,
        enable: isBan
      }
      try {
        const res = await self.axios({
          method: "post",
          url: self.$store.state.baseurl + "api/job/enable",
          params: xData
        })
        if (res.data.code == 0) {
          self.cancle(true)
        }
      } catch (err) {
        self.$Message.error("启用或禁用任务错误")
      }
    },
    // 修改任务
    async undateTask() {
      const self = this
      let xData = {
        id: self.task.id,
        title: self.task.title,
        spec: self.task.content.spec,
        crawler_count: self.task.crawler_count
      }
      try {
        if (self.updateTask.plan == "定点") {
          if (self.updateTask.date !== "" && self.updateTask.time !== "") {
            self.updateTask.date = self.$moment(new Date(self.updateTask.date)).format("YYYY-MM-DD")
            const scheduleAt = self.updateTask.date + " " + self.updateTask.time
            console.log(scheduleAt)
            xData = {
              id: self.task.id,
              title: self.task.title,
              spec: self.task.content.spec,
              category: self.task.category,
              schedule_at: self.$moment(new Date(scheduleAt)).format("YYYY-MM-DD HH:mm:ss"),
              crawler_count: self.task.crawler_count
            }
            console.log(xData);
          }
        } else if (self.updateTask.plan == "定期") {
          try {
            xData = {
              id: self.task.id,
              title: self.task.title,
              category: self.task.category,
              spec: self.task.content.spec,
              schedule_cron_second: self.updateTask.second,
              schedule_cron_minute: self.updateTask.minute,
              schedule_cron_hour: self.updateTask.hour,
              schedule_cron_day_of_month: self.updateTask.day,
              schedule_cron_month: self.updateTask.month,
              schedule_cron_day_of_week: self.updateTask.week,
              crawler_count: self.task.crawler_count
            }
          } catch (err) {
            self.$Message.error(err.message)
          }
        }
        let check
        if (self.updateTask.plan == "定期") {
          check = true
          let sArr = self.updateTask.second.split(",")
          sArr.forEach(item => {
            let res = item.match(/^([1-5]?\d)|\*([/-][1-5]?\d)?|\*$/)
            if (res == null) {
              check = false
              self.$Message.warning(`秒${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`秒${item}不符合周期输入规范`)
              }
            }
          })
          let mArr = self.updateTask.minute.split(",")
          mArr.forEach(item => {
            // const reg = /^(:?[1-5]?\d([\/|-][1-5]?\d)?|\*)$/
            let res = item.match(/^([1-5]?\d)|\*([/-][1-5]?\d)?|\*$/)
            if (res == null) {
              check = false
              self.$Message.warning(`分${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`分${item}不符合周期输入规范`)
              }
            }
          })
          let hArr = self.updateTask.hour.split(",")
          hArr.forEach(item => {
            let res = item.match(/^(2[0-3]|[0-1]?\d)|\*([/-](2[0-3]|[0-1]?\d))?|\*$/)
            console.log(res);
            if (res == null) {
              check = false
              self.$Message.warning(`时${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`时${item}不符合周期输入规范`)
              }
            }
          })
          let dArr = self.updateTask.day.split(",")
          dArr.forEach(item => {
            let res = item.match(/^(3[0-1]|[0-2]?\d)|\*([/-](3[0-1]|[0-2]?\d))?|\*$/)
            console.log(res);
            if (res == null) {
              check = false
              self.$Message.warning(`天${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`天${item}不符合周期输入规范`)
              }
            }
          })
          let monArr = self.updateTask.month.split(",")
          monArr.forEach(item => {
            let res = item.match(/^(1[0-2]|[0-9])|\*([/-](1[0-1]|[0]?\d))?|\*$/)
            if (res == null) {
              check = false
              self.$Message.warning(`月${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`月${item}不符合周期输入规范`)
              }
            }
          })
          let wArr = self.updateTask.week.split(",")
          wArr.forEach(item => {
            let res = item.match(/^([1-7])|\*([/-]([1-7]))?|\*$/)
            if (res == null) {
              check = false
              self.$Message.warning(`星期几${item}不符合周期输入规范`)
            } else {
              if (res[0] != item) {
                check = false
                self.$Message.warning(`星期几${item}不符合周期输入规范`)
              }
            }
          })

        } else {
          check = true
        }
        if (check == true) {
          if (xData.title == "") {
            self.$Message.error("请输入任务名称")
          } else {
            let service_params = {}
            if (self.task.category == "SERVICE") {
              let i = 0
              for (let key in self.task.content.service_inst.params) {
                service_params[`service_params-${i}-name`] = key
                service_params[`service_params-${i}-value`] = self.task.content.service_inst.params[key]
                i = i + 1
              }
            }
            const res = await self.axios({
              method: "patch",
              url: self.$store.state.baseurl + "api/job/update",
              params: { ...xData, ...service_params }
            })
            // console.log(res)
            if (res.data.code !== 0) {
              if (res.data.data == -2) {
                self.$Message.error("任务名不可重复。有相同名称的任务已存在")
              } else {
                self.$Message.error(res.data.error_message)
              }
            } else {
              self.cancle(true)
            }
          }
        }
      } catch (error) {
        console.log(error);
        self.$Message.error("修改任务错误")
      }
    },
    handleCopy(task) {
      // console.log(task);
      this.cancle("copy", task)
    },
    dataChange(date) {
      console.log("sss");
      this.updateTask.date = date
    },
    timeChange(time) {
      this.updateTask.time = time
    },
    onCopy() {
      this.$Message.success("配置内容已复制到剪切板！")
    },
    onJsonChange() {
      this.$Message.warning("不可修改")
      this.$nextTick(() => {
        this.spec = this.task.content.service_inst.service.spec
      })
    }
  },
  components: {
    "i-serverDetail": ServerDetail,
  },
}
</script>

<style  scoped>
>>> .ivu-modal-header {
  text-align: center;
}
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
.taskDetail-task {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.taskDetail-form {
  min-width: 352px;
}
.taskitem {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.taskDetail-wrap {
  height: 100%;
}
.taskDetail-wrap-operation {
  margin-top: 100px;
  margin-bottom: 10px;
}
.taskDetail-configure-plan {
  margin-left: 110px;
}
.configure {
  width: 98%;
  height: 94%;
  border: 1px solid black;
  margin: 0 auto;
  position: relative;
}
.service_configure {
  border: 1px solid black;
  height: 98%;
}
.params {
  width: 98%;
  height: 98%;
  border-right: 1px solid black;
  position: relative;
  padding: 20px 0 0 20px;
}
.noConfigure {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 28px;
  color: #ccc;
  transform: translate(-50%, -50%);
}
.vueJsonEditor {
  height: 100%;
}
>>> .jsoneditor-vue {
  height: 100%;
}
>>> .jsoneditor {
  border: none;
}
>>> .jsoneditor-poweredBy {
  display: none !important;
}
.time-col {
  text-align: center;
}
>>> .ivu-form-item-content {
  margin-left: 0px !important;
}
.dataRow {
  display: flex;
  justify-content: center;
  margin-left: 50px;
}
>>> textarea.ivu-input {
  height: 32px;
}
.description {
  width: 80%;
  height: 32px;
  line-height: 32px;
  word-break: break-all;
  overflow-y: auto;
}
.copy_btn {
  position: absolute;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  top: 7px;
  right: 10%;
  z-index: 999;
}
</style>