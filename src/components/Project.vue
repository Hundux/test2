<template>
  <div>
    <i-myHead></i-myHead>
    <div class="Management-projects-i-layout layout">
      <i-layout :default-collapsed="false">
        <i-sider
          class="layout-sider"
          hide-trigger
          collapsible
          :collapsed-width="50"
          v-model="isCollapsed"
        >
          <i-menu
            class="layout-sider-menu"
            theme="light"
            width="auto"
            :open-names="['1','2','3','4']"
            :active-name="selected"
          >
            <i-menuItem
              name="1"
              class="sidebar-item sidebar-title"
              to="/task"
            >
              <i-icon
                type="md-list"
                name="icon"
              ></i-icon>
              <span>任务管理</span>
            </i-menuItem>
            <i-menuItem
              name="2"
              class="sidebar-item sidebar-title"
              to="/server"
            >
              <i-icon
                type="md-cloud"
                name="icon"
              ></i-icon>
              <span>服务管理</span>
            </i-menuItem>
            <i-menuItem
              name="3"
              class="sidebar-item sidebar-title sidebar-item-bao"
            >
              <i-icon
                type="md-settings"
                name="icon"
              ></i-icon>
              <span>executor包管理</span>
              <!-- <p><span>executor</span></p>
            <p><span>包管理</span></p> -->
            </i-menuItem>
            <i-submenu name="4">
              <template slot="title">
                <i-icon
                  type="md-cube"
                  name="icon"
                ></i-icon>
                <span>
                  系统管理
                </span>
              </template>
              <i-menuItem
                name="4-1"
                class="sidebar-item"
                style="fontSize:13px"
              >
                爬虫
              </i-menuItem>
              <i-menuItem
                name="4-2"
                class="sidebar-item"
                style="fontSize:13px"
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
import MyHead from './MyHead'
export default {
  data() {
    return {
      isCollapsed: false,
      selected: "1"
    }
  },
  components: {
    "i-myHead": MyHead
  },
}
</script>

<style scoped>
.Management-projects-i-layout {
  height: 100%;
}
.layout-sider {
  height: 100vh;
  background: #fff;
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  flex: 0 0 150px !important;
  font-weight: bold;
}
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected {
  color: white !important;
  background-color: #212990;
}
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected a,
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected i,
.sidebar-item span {
  color: white;
}
/* .sidebar-item.ivu-menu-item {
  padding-left: 30px !important;
} */

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
.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected {
  color: white !important;
  background-color: #212990;
}

.sidebar-item.ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected span {
  color: white;
}
>>> li.sidebar-item.ivu-menu-item:hover {
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
</style>