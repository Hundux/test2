<template>
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
            class="sidebar-item"
            to="/task"
          >
            <span>任务管理</span>
          </i-menuItem>
          <i-menuItem
            name="2"
            class="sidebar-item"
            to="/server"
          >
            <span>服务管理</span>
          </i-menuItem>
          <i-menuItem
            name="3"
            class="sidebar-item sidebar-item-bao"
          >
            <p><span>executor</span></p>
            <p><span>包管理</span></p>
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
            >
              爬虫
            </i-menuItem>
            <i-menuItem
              name="4-2"
              class="sidebar-item"
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
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
      selected: "1"
    }
  },
}
</script>

<style scoped>
.Management-projects-i-layout {
  margin-top: 60px;
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
.sidebar-item span {
  color: white;
}
.sidebar-item.ivu-menu-item {
  padding-left: 30px !important;
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
.ivu-menu-submenu-title span,
.ivu-menu-submenu-title i {
  color: #057009;
}
.ivu-menu-submenu-title span {
  margin-right: 50px;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
>>> .ivu-menu-submenu-title {
  padding: 14px 5px !important;
}
.sidebar-item.ivu-menu-item {
  padding-left: 30px !important;
}
.sidebar-item span {
  color: #212990;
}
.sidebar-item-bao {
  font-size: 10px;
}

.layout-content {
  padding-top: 5px;
}
>>> .ivu-menu {
  color: #212990;
}
</style>