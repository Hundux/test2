<template>
  <div class="task-newtask">
    <i-modal
      :title="titleModal"
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
          <i-row
            v-if="taskForm.category==='SERVICE'"
            class="service_configure"
          >
            <i-col
              span="12"
              class="server_spec"
            >
              <div
                v-if="server != null"
                style="height:100%;position:relative"
              >
                <p
                  class="copy_btn"
                  v-clipboard:copy="copy_spec"
                  v-clipboard:success="onCopy"
                >复制结果配置</p>
                <i-vueJsonEditor
                  name="jsonData"
                  v-model="spec"
                  :mode="'code'"
                  lang="zh"
                  @json-change="onJsonChange"
                  class="vueJsonEditor"
                >
                </i-vueJsonEditor>
              </div>
            </i-col>
            <i-col
              span="12"
              class="service_col"
            >
              <i-row class="configure-top">
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
                  <div class="description">{{item.description}}</div>
                </i-col>
                <i-col span="4">
                  <div class="description">{{item.default}}</div>
                </i-col>
              </i-row>
            </i-col>
          </i-row>
        </i-col>

        <i-col span="6">
          <i-form
            label-position="right"
            :label-width="100"
            :rules="ruleValidate"
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
              <i-col span="3">
                <i-formItem prop="second">
                  <i-input
                    size="large"
                    style="width:40px"
                    v-model="taskForm.schedule.cron.second"
                  ></i-input>
                </i-formItem>
              </i-col>
              <i-col span="4">
                <i-formItem>
                  <i-input
                    style="width:50px"
                    size="large"
                    v-model="taskForm.schedule.cron.minute"
                  ></i-input>
                </i-formItem>
              </i-col>
              <i-col span="4">
                <i-formItem>
                  <i-input
                    style="width:50px"
                    size="large"
                    v-model="taskForm.schedule.cron.hour"
                  ></i-input>
                </i-formItem>
              </i-col>
              <i-col span="3">
                <i-formItem>
                  <i-input
                    style="width:40px"
                    size="large"
                    v-model="taskForm.schedule.cron.day_of_month"
                  ></i-input>
                </i-formItem>
              </i-col>
              <i-col span="5">
                <i-formItem>
                  <i-input
                    style="width:70px"
                    size="large"
                    v-model="taskForm.schedule.cron.day_of_week"
                  ></i-input>
                </i-formItem>
              </i-col>
              <i-col span="3">
                <i-formItem>
                  <i-input
                    style="width:40px"
                    size="large"
                    v-model="taskForm.schedule.cron.month"
                  ></i-input>
                </i-formItem>
              </i-col>
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
              label="所需爬虫数："
              class="form-item"
            >
              <i-input
                v-model="taskForm.crawler_count"
                style="width:250px"
                type="number"
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
              class="form-item serverList"
              v-if="taskForm.category==='SERVICE'"
            >
              <i-input
                placeholder="服务搜索"
                style="width: 250px;marginRight:20px"
                v-model="searchServiceKey"
                @on-focus="handleSearch"
                @on-change="handleChange"
                clearable
                search
              />
              <div
                class="serverListWrap"
                ref="serverListWrap"
              >
                <div
                  v-for="(item,index) in  serverList"
                  :key="index"
                  class="serverListDiv"
                  @click="selectServer($event,item)"
                >
                  {{item.title}}
                </div>
              </div>
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
        crawler_count: 1,
      },
      ruleValidate: {
        second: [{ required: false, message: 'The name cannot be empty', trigger: 'blur' }]
      },
      searchServiceKey: "",
      server: {},
      serverList: [],
      copy_spec: "",
      spec: {},
      titleModal: "新建任务"
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
      console.log(newValue);
      if (newValue) {
        if (newValue.id) {
          this.taskForm = newValue
          this.titleModal = "复制"
          if (newValue.content.service_inst != null) {
            this.server = newValue.content.service_inst.service
          }
          this.taskForm.title = this.taskForm.title + "(copy)"
        }
      }
    },
    server: {
      deep: true,
      handler: function (newValue) {
        console.log(newValue);
        let spec = ""
        let copy_spec = ""
        if (newValue.spec != null) {
          spec = JSON.stringify(newValue.spec)
        }
        copy_spec = spec
        let params = newValue.params
        if (params != null) {
          for (let i = 0; i < params.length; i++) {
            spec = spec.replace(`$${params[i].name}$`, `$${params[i].name}:${params[i].input}$`)
            while (spec.indexOf(`$${params[i].name}$`) != -1) {
              spec = spec.replace(`$${params[i].name}$`, `$${params[i].name}:${params[i].input}$`)
            }
            copy_spec = copy_spec.replace(`$${params[i].name}$`, params[i].input)
            while (copy_spec.indexOf(`$${params[i].name}$`) != -1) {
              copy_spec = copy_spec.replace(`$${params[i].name}$`, params[i].input)
            }
          }
        }
        if (spec != "") {
          this.copy_spec = copy_spec
          this.spec = JSON.parse(spec)
        }
      }
    }
  },
  methods: {
    cancle(isCreate) {
      this.taskForm = {
        plan: "",
        title: "",
        category: "TASK",
        content: {
          spec: {
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
      this.titleModal = "新建服务"
      this.searchServiceKey = ""
      this.server = {}
      this.$emit("cancleNewTaskModal", isCreate)
      this.serverList = {}
    },
    async createTask() {
      const self = this
      try {
        if (self.taskForm.category == "TASK") {
          let xData = {
            title: self.taskForm.title,
            category: self.taskForm.category,
            spec: self.taskForm.content.spec,
            crawler_count: self.taskForm.crawler_count
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
                  crawler_count: self.taskForm.crawler_count
                }
              } else {
                const scheduleAt = self.taskForm.date + " " + self.taskForm.time
                console.log(scheduleAt)
                xData = {
                  title: self.taskForm.title,
                  category: self.taskForm.category,
                  spec: self.taskForm.content.spec,
                  schedule_at: self.$moment(new Date(scheduleAt)).format('YYYY-MM-DD HH:mm:ss'),
                  crawler_count: self.taskForm.crawler_count
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
              crawler_count: self.taskForm.crawler_count
            }
          }
          console.log(xData);
          let check
          if (self.taskForm.plan == "定期") {
            check = true
            let sArr = self.taskForm.schedule.cron.second.split(",")
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
            let mArr = self.taskForm.schedule.cron.minute.split(",")
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
            let hArr = self.taskForm.schedule.cron.hour.split(",")
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
            let dArr = self.taskForm.schedule.cron.day_of_month.split(",")
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
            let monArr = self.taskForm.schedule.cron.month.split(",")
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
            let wArr = self.taskForm.schedule.cron.day_of_week.split(",")
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
          if (xData.title == "") {
            self.$Message.error("请输入任务名称")
          } else {
            if (check == true) {
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
          }
        } else if (self.taskForm.category == "SERVICE") {
          if (self.server.id) {
            let service_params = {}
            if (self.server.params != null) {
              const l = self.server.params.length
              for (let i = 0; i < l; i++) {
                service_params[`service_params-${i}-name`] = self.server.params[i].name
                service_params[`service_params-${i}-value`] = self.server.params[i].input
              }
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
            let check
            if (self.taskForm.plan == "定期") {
              check = true
              let sArr = self.taskForm.schedule.cron.second.split(",")
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
              let mArr = self.taskForm.schedule.cron.minute.split(",")
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
              let hArr = self.taskForm.schedule.cron.hour.split(",")
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
              let dArr = self.taskForm.schedule.cron.day_of_month.split(",")
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
              let monArr = self.taskForm.schedule.cron.month.split(",")
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
              let wArr = self.taskForm.schedule.cron.day_of_week.split(",")
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
            if (xData.title == "") {
              self.$Message.error("请输入任务名称")
            } else {
              if (check == true) {
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
            }
          } else {
            self.$Message.warning("请选择服务")
          }
        }
      } catch (err) {
        console.log(err);
        self.$Message.error("新建任务失败")
      }
    },
    dataChange(date) {
      this.taskForm.date = date
    },
    timeChange(time) {
      this.taskForm.time = time
    },
    async handleSearch() {
      this.$refs.serverListWrap.style.display = "block"
      const self = this
      try {
        const res = await self.axios({
          method: "get",
          url: self.$store.state.baseurl + "api/service/list",
          params: {
            search_key: self.searchServiceKey,
          }
        })
        console.log(res)
        if (res.data.code == 0) {
          self.serverList = res.data.data.page
        } else {
          self.$Message.error(res.data.error_message)
        }
      } catch (error) {
        self.$Message.error("获取服务列表错误")
      }
    },
    selectServer(e, server) {
      this.$refs.serverListWrap.style.display = "none"
      this.server = server
      this.searchServiceKey = server.title
      this.spec = server.spec
      if (this.server.params != null) {
        for (let i = 0; i < this.server.params.length; i++) {
          this.$set(this.server.params[i], "input", "")
        }
      }
    },
    handleChange() {
      this.$refs.serverListWrap.style.display = "block"

      this.handleSearch()
    },
    handleBlur() {
      this.serverList = []
    },
    onCopy() {
      this.$Message.success("配置内容已复制到剪切板！")
    },
    onJsonChange() {
      this.$Message.warning("不可修改")
      this.$nextTick(() => {
        this.spec = this.server.spec
      })
    }
  },
  mounted() {
    console.log(this.vueJsonEditor)
  },
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
.service_configure {
  width: 100%;
  height: 94%;
  margin: 0 auto;
}
.service_col {
  height: 100%;
  border-right: 1px solid black;
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
.serverListWrap {
  cursor: pointer;
}
.serverList {
  display: flex;
}
.serverListDiv {
  border: 1px solid #dcdee2;
  border-radius: 5px;
  padding-left: 4px;
  width: 250px;
}
.selected {
  background: #057009;
  color: #fff;
}
.server_spec {
  height: 100%;
  border: 1px solid black;
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