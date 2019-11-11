import { parse } from 'querystring';
import { adminHostUrl, userHostUrl, myUrl } from '../const/localConfig';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

export const getMyHeaders = () => {
const token = sessionStorage.getItem('x-auth-token');
  //const token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiLljJfkuqzluILotJ_otKPkurosMS5wbmciLCJpYXQiOjE1NzI4MzYxOTEsImV4cCI6MTU3MjkyMjE5MX0.K_Tj2wjSJPkM3UhY9k9jxN88oWGS8OVhw0HYDyGp38c";
  return ({
    authorization: `Bearer ${token}`,
  })
};
export const getCurrentUser = () => {
  const currentUser = sessionStorage.getItem('currentUser');
  return `${currentUser}`;
};

export const isLogined = () => {
  const token = sessionStorage.getItem('x-auth-token');
  if (token) {
    return true;
  }
  return false;
}

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 登录后，查询相关权限，获取登录后的重定向URL
 */
export function getRedirectUrl() {
  return `${adminHostUrl}/sysmanage/workinfo`;
}
export function getPlannerUrl() {
  return `${adminHostUrl}/manage/monthly/monthlyTable`;
}
export function getRedirectUrlNotify() {
  return `${adminHostUrl}/notify/notifyman`;
}

export function getUserRedirectUrl(id) {
  return `${userHostUrl}`;
}

// 保存当前用户信息到回话
export function setCurrentUser(userInfo) {
  return sessionStorage.setItem('currentUser', userInfo);
}


// 保存当前用户信息到回话
export function setAuthToken(token) {
  return sessionStorage.setItem('x-auth-token', token);
}

export function getDefaultImg() {
  return "http://www.bjcsghxh.com/data/altern/暂无附件.png";
}
export function getDefaultAction() {
  return "http://39.107.72.184/bmicpd/api/fileUpload";
}
