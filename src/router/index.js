import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/common/Home';
import Dashboard from '../components/page/Dashboard';

import UserManage from '../components/page/UserManage';

import UploadProduct from '../components/page/UploadProduct';
import ProductManage from '../components/page/ProductManage';

import BaseTable from '../components/page/BaseTable';
import Tabs from '../components/page/Tabs';
import BaseForm from '../components/page/BaseForm';
import VueEditor from '../components/page/VueEditor';
import Markdown from '../components/page/Markdown';
import Upload from '../components/page/Upload';
import BaseCharts from '../components/page/BaseCharts';
import DragList from '../components/page/DragList';
import Permission from '../components/page/Permission';
import Login from '../components/page/Login';
import NoFound from '../components/page/404';
import NoPermission from '../components/page/403';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/', component: Home, name: Home, meta: { title: '自述文件' },
      children: [
        { path: '/dashboard', component: Dashboard, meta: { title: '系统首页' } },

        { path: '/userManage', component: UserManage, meta: { title: '用户管理' } },

        { path: '/uploadProduct', component: UploadProduct, meta: { title: '产品上传' } },
        { path: '/productManage', component: ProductManage, meta: { title: '产品更新' } },

        { path: '/table', component: BaseTable, meta: { title: '基础表格' } },
        { path: '/tabs', component: Tabs, meta: { title: 'tab选项卡' } },
        { path: '/form', component: BaseForm, meta: { title: '基本表单' } },
        { path: '/editor', component: VueEditor, meta: { title: '富文本编辑器' } },
        { path: '/markdown', component: Markdown, meta: { title: 'markdown编辑器' } },
        { path: '/upload', component: Upload, meta: { title: '文件上传' } },
        { path: '/charts', component: BaseCharts, meta: { title: 'schart图表' } },
        { path: '/drag', component: DragList, meta: { title: '拖拽列表' } },
        { path: '/permission', component: Permission, meta: { title: '权限测试', permission: true } }
      ]
    },
    { path: '/login', component: Login },
    { path: '/404', component: NoFound },
    { path: '/403', component: NoPermission },
    { path: '*', redirect: '/404', },
  ],
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('ms_username');
  if(!role && to.path !== '/login'){
      next('/login');
  }else if(to.meta.permission){
      // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
      role === 'admin' ? next() : next('/403');
  }else{
      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
          Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
              confirmButtonText: '确定'
          });
      }else{
          next();
      }
  }
});

export default router;
