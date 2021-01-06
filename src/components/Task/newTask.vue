<template>
  <div class="task-newtask">
    <i-modal
      title="新建任务"
      :value="newTask"
      @on-cancel="cancle"
      width="1000px"
      footer-hide
    >

      <i-row>
        <i-col span="15">
          <div
            class="configure"
            v-if="taskForm.type==='执行配置'"
          >
            <i-vueJsonEditor
              name="jsonData"
              v-model="jsonData"
              :mode="'code'"
              lang="zh"
              v-if="jsonData"
              class="vueJsonEditor"
            ></i-vueJsonEditor>
          </div>
          <div
            class="configure"
            v-if="taskForm.type==='调用服务'"
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
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数1：</span></i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input type="textarea"  style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数2：</span></i-col>
              <i-col span="8">
                <i-input  style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input type="textarea" style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
            <i-row class="configure-body">
              <i-col
                span="4"
                class="configure-body-one"
              ><span>参数3：</span></i-col>
              <i-col span="8">
                <i-input style="width:60%"></i-input>
              </i-col>
              <i-col span="8">
                <i-input type="textarea" style="width:60%"></i-input>
              </i-col>
              <i-col span="4">
                <i-input style="width:60%"></i-input>
              </i-col>
            </i-row>
          </div>
        </i-col>
        <i-col span="9">
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
                <i-option value="单次">单次</i-option>
                <i-option value="周期">周期</i-option>
              </i-select>
            </i-formItem>

            <i-row>
              <i-formItem
                class="form-item"
                label="定时："
                v-if="taskForm.plan==='单次'"
              >
                <i-col span="12">
                  <i-datePicker
                    type="date"
                    placeholder="Select date"
                    v-model="taskForm.date"
                  ></i-datePicker>
                </i-col>
                <i-col span="12">
                  <i-timePicker
                    type="time"
                    placeholder="Select time"
                    v-model="taskForm.time"
                  ></i-timePicker>
                </i-col>
              </i-formItem>
            </i-row>

            <i-row
              v-if="taskForm.plan==='周期'"
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
              <i-col
                span="3"
                class="time-col"
              ><span class="time">年</span></i-col>
            </i-row>
            <i-row
              v-if="taskForm.plan==='周期'"
              class="form-item"
              style="margin-bottom:10px;margin-left:20px"
            >
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="5"><input
                  type="number"
                  min="0"
                  style="width:73px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
              <i-col span="3"><input
                  type="number"
                  min="0"
                  style="width:46px"
                /></i-col>
            </i-row>
            <i-formItem
              label="名称："
              class="form-item"
            >
              <i-input
                v-model="taskForm.name"
                style="width:250px"
              ></i-input>
            </i-formItem>
            <i-formItem
              label="类型："
              class="form-item"
            >
              <i-select
                v-model="taskForm.type"
                style="width:250px"
              >
                <i-option value="执行配置">执行配置</i-option>
                <i-option value="调用服务">调用服务</i-option>
              </i-select>
            </i-formItem>
            <i-formItem
              label="服务："
              class="form-item"
              v-if="taskForm.type==='调用服务'"
            >
              <i-select
                v-model="taskForm.service"
                style="width:250px"
              >
                <i-option value="服务1">服务1</i-option>
                <i-option value="服务2">服务2</i-option>
              </i-select>
            </i-formItem>
          </i-form>
          <div class="determine">
            <i-button type="primary">确定</i-button>
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
        plan: '未计划',
        name: '',
        type: '执行配置',
        date: '',
        time: '',
        service: ''
      },
      jsonData: {}
    }
  },
  props: {
    newTask: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    cancle() {
      this.$emit("cancleNewTaskModal")
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
  top: 15px !important;
}
.time-col {
  text-align: center;
}
.configure {
  width: 600px;
  height: 610px;
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
>>> textarea.ivu-input{
  height: 32px;
}
</style>