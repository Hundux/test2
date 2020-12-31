import Vue from "vue";
import VueRouter from "vue-router";
import Task from '../components/Task.vue'
import Server from '../components/Server.vue'
Vue.use(VueRouter);

const routes = [
  { path: '/task', component: Task },
  { path: '/server', component: Server },
  //可以配置重定向
  { path: '', redirect: "Task" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
