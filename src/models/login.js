import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, setCurrentUser, getRedirectUrl, getUserRedirectUrl, setAuthToken, getRedirectUrlNotify, getPlannerUrl, setPlannerToken ,setPlannerUser} from '@/utils/utils';
import { headUrl } from '../const/localConfig';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      setCurrentUser(undefined);
      if (response.status === 'ok') {
        const { status, type, currentAuthority, token,
          currentUser: { id, name, phone, avatar, street } } = response;
        const userInfo = {
          status,
          type,
          currentAuthority,
          data: {
            id,
            name,
            phone,
            street,
            avatar: `${headUrl}/${avatar}`,
          },
        };
        setAuthToken(token);
        setCurrentUser(JSON.stringify(userInfo));
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

          redirect = getRedirectUrl();

        if (userInfo.currentAuthority === 'admin' || userInfo.currentAuthority === 'notify') {
          if (userInfo.currentAuthority === 'notify') {
            redirect = getPlannerUrl();
          }
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
        } else {
          window.location.href = getUserRedirectUrl(id);
          return;
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
}
