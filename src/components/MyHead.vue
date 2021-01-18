<template>
  <div class="Myhead">
    <div class="head-part1">
      <h1 class="Mymenu-title">爬虫管理平台</h1>
      <div class="Mymenu-collpse" name="collpse" >
            <span class="Mymenu-collpse-collpse" title="隐藏侧边栏" v-if="collpsed" @click="changeCollpsed(false)">
                <el-icon class="el-icon-s-fold"></el-icon>
            </span>
            <span class="Mymenu-collpse-collpse" title="展开侧边栏" v-else @click="changeCollpsed(true)">
                <el-icon class="el-icon-s-unfold"></el-icon>
            </span>
        </div>
    </div>
    <i-menu
      class="Mymenu"
      mode="horizontal"
    >
      <i-submenu
        name="user"
        class="Mymenu-user"
      >
        <template slot="title">
          <i-icon type="ios-contact" />
          1
        </template>
        <i-menuItem
          class="Mymenu-user-sub Mymenu-user-disable"
          name="user-department"
        >
          <i-icon type="md-people"></i-icon>
          技术部
        </i-menuItem>
        <i-menuItem
          class="Mymenu-user-sub"
          name="user-signout"
        >
          <i-icon type="md-exit"></i-icon>
          退出登录
        </i-menuItem>
      </i-submenu>
      <div class="dummy"></div>
    </i-menu>
  </div>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'
import { Icon } from 'element-ui';
export default {
  components: {
    'el-icon': Icon
  },
  computed: {
    ...mapState(['collpsed']),
  },
  methods: {
    ...mapMutations(['changeCollpsed',])
  },
}
</script>

<style scoped>
.Myhead {
  position: sticky;
  margin: 0;
  top: 0px;
  z-index: 999 !important;
  display: flex;
  height: 60px;
  background-color: #fff;
  align-items: center;
  border-bottom: 1px solid #dcdee2;
}

.head-part1 {
  text-align: left;
  flex: 1;
  margin: 0 15px;
}

.Mymenu {
  flex: 1;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  justify-content: flex-end;
}

.dummy {
  width: 30px;
}

.Mymenu-title {
  flex: 4;
  font-size: 1.7rem;
  color: #212891 !important;
  text-align: left;
  display: inline-block;
  margin-right: 10px;
}

.Mymenu-collpse {
  margin-left: 10px;
  margin-right: 10px;
  flex: 1;
  font-size: 1.5rem;
  color: #057009 !important;
  text-align: left;
  display: inline-block;
}

.Mymenu-collpse-collpse {
  font-size: 1.5rem;
  cursor: pointer;
}

.Mymenu-collpse-collpse:hover {
  padding: 5px 0;
  background-color: #e0dbd9;
  box-shadow: 1px 1px 1px #888888;
}

.Mymenu-collpse-refresh {
  margin-left: 10px;
  color: #057009;
  cursor: pointer;
  font-size: 1.5rem;
}

.Mymenu-collpse-refresh:hover {
  padding: 5px 0;
  box-shadow: 1px 1px 1px #888888;
  background-color: #e0dbd9;
}

.Mymenu-collpse-projectView {
  margin-left: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #057009;
}

.Mymenu-collpse-projectView:hover {
  padding: 5px 0;
  box-shadow: 1px 1px 1px #888888;
  background-color: #e0dbd9;
}

.Mymenu-user-sub {
  text-align: left;
}

.Mymenu-user-disable {
  pointer-events: none;
}

.Mymenu-collpse {
  font-size: 1.3rem;
}

h1:hover {
  cursor: pointer;
}
</style>