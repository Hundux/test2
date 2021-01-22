<template>
  <div class="project">
    <i-myHead></i-myHead>
    <div class="Management-projects-i-layout layout">
      <i-layout :default-collapsed="false">
        <i-sider
          class="layout-sider"
          hide-trigger
          collapsible
          :collapsed-width="71"
          v-model="isCollapsed"
          ref="side1"
        >
          <i-menu
            class="layout-sider-menu"
            theme="light"
            width="auto"
            :open-names="['task','server','3','4']"
            :active-name="selected"
          >
            <i-menuItem
              name="task"
              class="sidebar-item sidebar-title"
              to="/task"
            >
              <i-icon
                v-show="!collpsed"
                type="md-list"
                name="icon"
                size="22"
              ></i-icon>
              <div v-show="collpsed">
                <i-icon
                  type="md-list"
                  name="icon"
                ></i-icon>
                <span>任务管理</span>
              </div>
            </i-menuItem>
            <!-- <i-menuItem
              name="server"
              class="sidebar-item sidebar-title"
              to="/server"
            >
              <i-icon
                type="md-cloud"
                name="icon"
                size="22"
                v-show="!collpsed"
              ></i-icon>
              <div v-show="collpsed">
                <i-icon
                  type="md-cloud"
                  name="icon"
                ></i-icon>
                <span>服务管理</span>
              </div>
            </i-menuItem>
            <i-menuItem
              name="record"
              class="sidebar-item sidebar-title"
              to="/record"
            >
              <i-icon
                type="md-cloud"
                name="icon"
                size="22"
                v-show="!collpsed"
              ></i-icon>
              <div v-show="collpsed">
                <i-icon
                  type="md-recording"
                  name="icon"
                ></i-icon>
                <span>运行记录</span>
              </div>
            </i-menuItem> -->
            <i-submenu
              name="server"
              :class="!collpsed ? 'collapsed-menu':''"
            >
              <template slot="title">
                <i-poptip
                  class="mypiptip"
                  v-show="!collpsed"
                  trigger="hover"
                  :transfer="true"
                  placement="right-start"
                >
                  <i-icon
                    type="md-cloud"
                    name="icon"
                    size="22"
                  ></i-icon>
                  <div slot="content">
                    <i-menuItem
                      class="sidebar-item"
                      v-show="!collpsed"
                      name="server"
                      to="/server"
                    >
                      服务管理
                    </i-menuItem>
                    <i-menuItem
                      class="sidebar-item"
                      v-show="!collpsed"
                      name="record"
                      to="/record"
                    >
                      运行记录
                    </i-menuItem>
                  </div>
                </i-poptip>
                <div v-show="collpsed">
                  <i-icon
                    type="md-cloud"
                    name="icon"
                  ></i-icon>
                  <span>
                    服务管理
                  </span>
                </div>
              </template>
              <i-menuItem
                name="server"
                to="/server"
                class="sidebar-item"
                style="fontSize:13px"
                v-show="collpsed"
              >
                服务管理
              </i-menuItem>
              <i-menuItem
                name="record"
                to="/record"
                class="sidebar-item"
                style="fontSize:13px"
                v-show="collpsed"
              >
                运行记录
              </i-menuItem>
            </i-submenu>
            <i-menuItem
              name="3"
              class="sidebar-item sidebar-title sidebar-item-bao"
              to='/Executor'
            >
              <i-icon
                v-show="!collpsed"
                type="md-settings"
                name="icon"
                size="22"
              ></i-icon>
              <div v-show="collpsed">
                <i-icon
                  type="md-settings"
                  name="icon"
                ></i-icon>
                <span>executor包管理</span>
              </div>
            </i-menuItem>
            <i-submenu
              name="4"
              :class="!collpsed ? 'collapsed-menu':''"
            >
              <template slot="title">
                <i-poptip
                  class="mypiptip"
                  v-show="!collpsed"
                  trigger="hover"
                  :transfer="true"
                  placement="right-start"
                >
                  <i-icon
                    type="md-cube"
                    name="icon"
                    size="22"
                  ></i-icon>
                  <div slot="content">
                    <i-menuItem
                      class="sidebar-item"
                      v-show="!collpsed"
                      name="4-1"
                      to="/Spider"
                    >
                      爬虫
                    </i-menuItem>
                    <i-menuItem
                      class="sidebar-item"
                      v-show="!collpsed"
                      name="4-2"
                      to="/Dupdb"
                    >
                      查重db
                    </i-menuItem>
                  </div>
                </i-poptip>
                <div v-show="collpsed">
                  <i-icon
                    type="md-cube"
                    name="icon"
                  ></i-icon>
                  <span>
                    系统管理
                  </span>
                </div>
              </template>
              <i-menuItem
                name="4-1"
                class="sidebar-item"
                style="fontSize:13px"
                v-show="collpsed"
                to="/Spider"
              >
                爬虫
              </i-menuItem>
              <i-menuItem
                name="4-2"
                class="sidebar-item"
                style="fontSize:13px"
                v-show="collpsed"
                to="/Dupdb"
              >
                查重db
              </i-menuItem>
            </i-submenu>
          </i-menu>
        </i-sider>
        <i-layout>
          <i-content class="layout-content">
            <router-view></router-view>
          </i-content>
        </i-layout>
      </i-layout>
    </div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import MyHead from './MyHead'
export default {
  data() {
    return {
      isCollapsed: false,
      selected: "task"
    }
  },
  components: {
    "i-myHead": MyHead
  },
  computed: {
    ...mapState(['collpsed']),
  },
  watch: {
    collpsed: function () {
      this.collapsedSider()
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
  },
  mounted() {
    window.addEventListener("load", () => {
      const route = this.$route.path.substring(1)
      this.selected = route
    })
  },
}
</script>

<style scoped>
.Management-projects-i-layout {
  height: 100%;
}
.layout-sider {
  height: calc(100vh - 60px);
  background: #fff;
  width: 150px !important;
  min-width: 0px !important;
  flex: 0 0 150px !important;
  font-weight: bold;
}
.sidebar-item {
  color: #212990;
}
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected a,
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected i,
.sidebar-item span {
  color: white;
}
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected {
  color: white !important;
  background-color: #212990;
}

.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected a {
  color: white;
}
.ivu-poptip-body-content .sidebar-item.ivu-menu-item {
  padding-left: 5px !important;
}
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected span {
  color: white;
}
>>> .sidebar-item.ivu-menu-item:hover {
  background-color: #057009;
  color: #fff !important;
}
>>> li.sidebar-item.ivu-menu-item:hover a,
li.sidebar-item.ivu-menu-item:hover span {
  color: #fff !important;
}
.sidebar-title:hover {
  background-color: #057009;
}
.sidebar-title:hover i,
.sidebar-title:hover span {
  color: #fff !important;
}
.ivu-menu-submenu-title span,
.ivu-menu-submenu-title i {
  color: #057009;
}
.sidebar-title {
  padding-right: 47px !important;
}
.sidebar-title span,
.sidebar-title i {
  color: #057009;
}
.ivu-menu-submenu-title span {
  margin-right: 20px;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.layout-content {
  padding-top: 5px;
}
>>> .ivu-menu {
  color: #212990;
}
>>> .ivu-menu-vertical .ivu-menu-submenu-title-icon {
  right: 20px;
}
.collapsed-menu >>> .ivu-menu-submenu-title-icon {
  display: none;
}
</style>