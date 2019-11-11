import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/manage',
          component: '../layouts/MyLayout',
          routes: [
            {
              name: 'monthly',
              path: '/manage/monthly',
              icon: 'container',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'monthlyTable',
                  path: '/manage/monthly/monthlyTable',
                  component: './monthly/monthlyTable',
                  icon: 'file',
                },

              ],
            },
            {
              name: 'planner',
              path: '/manage/planner',
              icon: 'container',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'plannerTable',
                  path: '/manage/planner/plannerTable',
                  component: './planner/plannerTable',
                  icon: 'file',
                },

              ],
            },
            {
              name: 'feedback',
              path: '/manage/feedback',
              icon: 'container',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'feedbackTable',
                  path: '/manage/feedback/feedbackTable',
                  component: './feedback/feedbackTable',
                  icon: 'file',
                },

              ],
            },
            {
              component: './Welcome',
            },
          ],

        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: 'sysmanage',
              path: '/sysmanage',
              icon: 'container',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'workinfo',
                  path: '/sysmanage/workinfo',
                  component: './sysmanage/work-info',
                  icon: 'file',
                },
                {
                  name: 'workrule',
                  path: '/sysmanage/workrule',
                  component: './sysmanage/work-rule',
                  icon: 'code',
                },
                {
                  name: 'projectshow',
                  path: '/sysmanage/projectshow',
                  component: './sysmanage/project-show',
                  icon: 'dashboard',
                },
              ],
            },
            {
              name: 'other',
              path: '/other',
              icon: 'laptop',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'planningdata',
                  path: '/other/planningdata',
                  component: './other/planning-data',
                  icon: 'form',
                },
                {
                  name: 'planningroom',
                  path: '/other/planningroom',
                  component: './other/planning-room',
                  icon: 'video-camera',
                },

                {
                  name: 'basedata',
                  path: '/other/basedata',
                  component: './other/base-data',
                  icon: 'database',
                },
              ],
            },
            {
              name: 'notify',
              path: '/notify',
              icon: 'laptop',
              authority: ['admin', 'notify'],
              routes: [
                {
                  name: 'notifyman',
                  path: '/notify/notifyman',
                  component: './notify/notify-man',
                  icon: 'user',
                },
              ],
            },
            {
              component: './Welcome',
            },
          ],
        },

        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
    'menu-dark-bg': '#0B4D7F',
    'menu-dark-submenu-bg': '#0B4D7F',
    'layout-sider-background': '#0B4D7F',
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  /*base: '/ht',
  publicPath: './dist/ht',
  outputPath: '/ht/',*/
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
};
