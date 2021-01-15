<template>
  <div class="task-newtask">
    <i-modal
      title="新建任务"
      :value="newTask"
      @on-cancel="cancle(true)"
      width="100%"
      footer-hide
    >

      <i-row style="height:100%">
        <i-col
          span="18"
          style="height:100%"
        >
          <div
            class="configure"
            v-if="taskForm.category==='TASK'"
          >
            <i-vueJsonEditor
              name="jsonData"
              v-model="taskForm.content.spec"
              :mode="'code'"
              lang="zh"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
          </div>
          <div
            class="configure"
            v-if="taskForm.category==='SERVICE'"
          >
            <i-row
              class="configure-top"
              v-if="server.id"
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
              v-for="(item,index) in server.params"
              :key="index"
            >
              <i-col
                span="4"
                class="configure-body-one"
              ><span>{{item.name}}</span></i-col>
              <i-col span="8">
                <i-input
                  style="width:60%"
                  v-model="item.input"
                ></i-input>
              </i-col>
              <i-col span="8">
                <i-input
                  type="textarea"
                  style="width:60%"
                  v-model="item.description"
                ></i-input>
              </i-col>
              <i-col span="4">
                <i-input
                  style="width:60%"
                  v-model="item.default"
                ></i-input>
              </i-col>
            </i-row>
          </div>
        </i-col>
        <i-col span="6">
          <i-form
            label-position="right"
            :label-width="100"
          >
            <i-formItem
              label="执行计划："
              class="form-item"
            >
              <i-select
                v-model="taskForm.plan"
                style="width:250px"
                placeholder="未计划"
              >
                <i-option value="定点">单次</i-option>
                <i-option value="定期">周期</i-option>
              </i-select>
            </i-formItem>

            <i-row
              v-if="taskForm.plan==='定点'"
              class="dataRow"
            >
              <i-col span="12">
                <i-datePicker
                  type="date"
                  placeholder="Select date"
                  @on-change="dataChange"
                ></i-datePicker>
              </i-col>
            </i-row>
            <i-row
              v-if="taskForm.plan==='定点'"
              class="dataRow"
            >
              <i-col span="12">
                <i-timePicker
                  type="time"
                  placeholder="Select time"
                  @on-change="timeChange"
                ></i-timePicker>
              </i-col>
            </i-row>
            <i-row
              v-if="taskForm.plan==='定期'"
              class="period form-item"
              style="margin-left:20px"
            >
              <i-col
                span="3"
                class="time-col"
              ><span class="time">秒</span></i-col>
              <i-col
                span="4"
                class="time-col"
              ><span class="time">分钟</span></i-col>
              <i-col
                span="4"
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
              v-if="taskForm.plan==='定期'"
              class="form-item"
              style="margin-bottom:10px;margin-left:20px"
            >
              <i-col span="3"><input
                  style="width:40px"
                  v-model="taskForm.schedule.cron.second"
                /></i-col>
              <i-col span="4"><input
                  style="width:55px"
                  v-model="taskForm.schedule.cron.minute"
                /></i-col>
              <i-col span="4"><input
                  style="width:55px"
                  v-model="taskForm.schedule.cron.hour"
                /></i-col>
              <i-col span="3"><input
                  style="width:40px"
                  v-model="taskForm.schedule.cron.day_of_month"
                /></i-col>
              <i-col span="5"><input
                  style="width:68px"
                  v-model="taskForm.schedule.cron.day_of_week"
                /></i-col>
              <i-col span="3"><input
                  style="width:46px"
                  v-model="taskForm.schedule.cron.month"
                /></i-col>
            </i-row>
            <i-formItem
              label="名称："
              class="form-item"
            >
              <i-input
                v-model="taskForm.title"
                style="width:250px"
              ></i-input>
            </i-formItem>
            <i-formItem
              label="类型："
              class="form-item"
            >
              <i-select
                v-model="taskForm.category"
                style="width:250px"
              >
                <i-option value="TASK">执行配置</i-option>
                <i-option value="SERVICE">调用服务</i-option>
              </i-select>
            </i-formItem>
            <i-formItem
              label="服务："
              class="form-item"
              v-if="taskForm.category==='SERVICE'"
            >
              <i-input
                placeholder="服务搜索"
                style="width: 150px;marginRight:20px"
                v-model="searchServiceKey"
                clearable
              />
              <i-button
                type="info"
                icon="md-search"
                class="search"
                @click="searchService"
              >搜索</i-button>
            </i-formItem>
          </i-form>
          <div class="determine">
            <i-button
              type="primary"
              @click="createTask"
            >确定</i-button>
          </div>
        </i-col>
      </i-row>
    </i-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskForm: {
        plan: "",
        title: "",
        category: "TASK",
        content: {
          spec: {
            "appid": "~4.5.0",
            "crawlid": "~4.5.0",
            "url": "~4.5.0",
            "spiderid": "~4.5.0",
          },
        },
        schedule: {
          cron: {
            "day_of_month": "",
            "day_of_week": "",
            "hour": "",
            "minute": "",
            "month": "",
            "second": ""
          }
        },
        date: "",
        time: "",
      },
      searchServiceKey: "",
      server: {},
    }
  },
  props: {
    newTask: {
      type: Boolean,
      default: false
    },
    copyTask: {
      type: Object
    }
  },
  watch: {
    copyTask(newValue) {
      if (newValue) {
        if (newValue.id) {
          this.taskForm = newValue
          this.taskForm.title = this.taskForm.title + "(copy)"
        }
      }
    },
  },
  methods: {
    cancle(isCreate) {
      this.taskForm = {
        plan: "",
        title: "",
        category: "TASK",
        content: {
          spec: {
            "appid": "~4.5.0",
            "crawlid": "~4.5.0",
            "url": "~4.5.0",
            "spiderid": "~4.5.0",
          },
        },
        schedule: {
          cron: {
            "day_of_month": "",
            "day_of_week": "",
            "hour": "",
            "minute": "",
            "month": "",
            "second": ""
          }
        },
        date: "",
        time: "",
      }
      this.searchServiceKey = ""
      this.server = {}
      this.$emit("cancleNewTaskModal", isCreate)
    },
    async createTask() {
      const self = this
      try {
        if (self.taskForm.category == "TASK") {
          let xData = {
            title: self.taskForm.title,
            category: self.taskForm.category,
            spec: self.taskForm.content.spec,
          }
          if (self.taskForm.plan == "定点") {
            if (self.taskForm.date !== "" && self.taskForm.time !== "") {
              if (self.copyTask.id) {
                // console.log(self.taskForm.date)
                // console.log(self.taskForm.time)
                // console.log('copy');
                let schedule_at = null
                if (self.taskForm.date != undefined && self.taskForm.time != undefined) {
                  const scheduleAt = self.taskForm.date + " " + self.taskForm.time
                  schedule_at = self.$moment(new Date(scheduleAt)).format('YYYY-MM-DD HH:mm:ss')
                }
                xData = {
                  title: self.taskForm.title,
                  category: self.taskForm.category,
                  spec: self.taskForm.content.spec,
                  schedule_at: schedule_at,
                }
              } else {
                const scheduleAt = self.taskForm.date + " " + self.taskForm.time
                xData = {
                  title: self.taskForm.title,
                  category: self.taskForm.category,
                  spec: self.taskForm.content.spec,
                  schedule_at: self.$moment(new Date(scheduleAt)).format('YYYY-MM-DD HH:mm:ss'),
                }
              }
            }
          } else if (self.taskForm.plan == "定期") {
            xData = {
              title: self.taskForm.title,
              category: self.taskForm.category,
              spec: self.taskForm.content.spec,
              schedule_cron_second: self.taskForm.schedule.cron.second,
              schedule_cron_minute: self.taskForm.schedule.cron.minute,
              schedule_cron_hour: self.taskForm.schedule.cron.hour,
              schedule_cron_day_of_month: self.taskForm.schedule.cron.day_of_month,
              schedule_cron_month: self.taskForm.schedule.cron.month,
              schedule_cron_day_of_week: self.taskForm.schedule.cron.day_of_week,
            }
          }
          console.log(xData);
          if (xData.title == "") {
            self.$Message.error("请输入任务名称")
          } else {
            const res = await self.axios({
              method: "post",
              url: self.$store.state.baseurl + "api/job/create",
              params: xData
            })
            console.log(res);
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
        } else if (self.taskForm.category == "SERVICE") {
          if (self.server.id) {
            const l = self.server.params.length
            let service_params = {}
            for (let i = 0; i < l; i++) {
              service_params[`service_params-${i}-name`] = self.server.params[i].name
              service_params[`service_params-${i}-value`] = self.server.params[i].input
            }
            let xData = {
              title: self.taskForm.title,
              category: self.taskForm.category,
              service_id: self.server.id
            }
            if (self.taskForm.plan == "定点") {
              if (self.taskForm.date !== "" && self.taskForm.time !== "") {
                if (self.copyTask.id) {
                  let schedule_at = null
                  if (self.taskForm.date != undefined && self.taskForm.time != undefined) {
                    const scheduleAt = self.taskForm.date + " " + self.taskForm.time
                    schedule_at = self.$moment(new Date(scheduleAt)).format('YYYY-MM-DD HH:mm:ss')
                  }
                  xData = {
                    title: self.taskForm.title,
                    category: self.taskForm.category,
                    schedule_at: schedule_at,
                    service_id: self.server.id
                  }
                } else {
                  const scheduleAt = self.taskForm.date + " " + self.taskForm.time
                  xData = {
                    title: self.taskForm.title,
                    category: self.taskForm.category,
                    schedule_at: self.$moment(new Date(scheduleAt)).format('YYYY-MM-DD HH:mm:ss'),
                    service_id: self.server.id
                  }
                }
              }
            } else if (self.taskForm.plan == "定期") {
              xData = {
                title: self.taskForm.title,
                category: self.taskForm.category,
                service_id: self.server.id,
                schedule_cron_second: self.taskForm.schedule.cron.second,
                schedule_cron_minute: self.taskForm.schedule.cron.minute,
                schedule_cron_hour: self.taskForm.schedule.cron.hour,
                schedule_cron_day_of_month: self.taskForm.schedule.cron.day_of_month,
                schedule_cron_month: self.taskForm.schedule.cron.month,
                schedule_cron_day_of_week: self.taskForm.schedule.cron.day_of_week,
              }
            }
            console.log(xData);
            if (xData.title == "") {
              self.$Message.error("请输入任务名称")
            } else {
              const res = await self.axios({
                method: "post",
                url: self.$store.state.baseurl + "api/job/create",
                params: { ...xData, ...service_params }
              })
              console.log(res);
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
          } else {
            self.$Message.warning("请选择服务")
          }
        }
      } catch (err) {
        self.$Message.error("新建任务失败")
      }
    },
    dataChange(date) {
      this.taskForm.date = date
    },
    timeChange(time) {
      this.taskForm.time = time
    },
    async searchService() {
      // console.log(this.searchServiceKey);
      const self = this
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/list",
          params: {
            search_key: this.searchServiceKey
          }
        })
        console.log(res);
        if (res.data.code == 0) {
          self.server = res.data.data[0]
          self.server.params.forEach(item => {
            item["input"] = ""
          })
          console.log(self.server)
        }
      } catch (error) {
        self.$Message.error("获取服务列表错误")
      }
    }
  }
}
</script>

<style scoped>
>>> .ivu-modal-header {
  text-align: center;
}
>>> .ivu-modal-footer {
  text-align: center;
}
>>> .ivu-form-item-content {
  margin-left: 0 !important;
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
.time-col {
  text-align: center;
}
.configure {
  width: 100%;
  height: 94%;
  border: 1px solid black;
  margin: 0 auto;
}
.configure-top {
  margin-top: 15px;
}
.configure-top-one {
  text-align: center;
}
.configure-body {
  margin-top: 15px;
}
.configure-body-one {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
>>> .ivu-date-picker-rel {
  width: 250px;
}
.determine {
  display: flex;
  justify-content: center;
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
>>> textarea.ivu-input {
  height: 32px;
}
.dataRow {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  margin-left: 10px;
}
</style>