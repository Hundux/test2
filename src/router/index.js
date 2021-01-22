import Vue from "vue";
import VueRouter from "vue-router";
import Task from '../components/Task.vue'
import Server from '../components/Server.vue'
import Record from '../components/Record.vue'
import Dupdb from '../components/Dupdb.vue'
import Executor from '../components/Executor.vue'
import Spider from '../components/Spider.vue'
Vue.use(VueRouter);

const routes = [
  { path: '/task', component: Task },
  { path: '/server', component: Server },
  { path: '/dupdb', component: Dupdb },
  { path: '/executor', component: Executor },
  { path: '/spider', component: Spider },
  { path: '/record', component: Record },
  //可以配置重定向
  { path: '', redirect: "/task" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
