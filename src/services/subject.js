import request from '@/utils/request';
import { RestUrl } from '@/const/localConfig';

/**
 * 保存工作信息
 * @param id =0 代表新增，其它数值代表修改该信息
 * @returns {Promise<void>}
 */
export async function saveSubject(params) {

  return request(`${RestUrl}/subject/save`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}


export async function querySubjectList(params) {
  return request(`${RestUrl}/subject/getHTL`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function querySubject(key) {
  return request(`${RestUrl}/subject/get/${key}`, {
    mode: 'cors',
  });
}

export async function setSubjectPublish(payload) {
  return request(`${RestUrl}/subject/setPublish/${payload.key}/${payload.publish}`, {
    mode: 'cors',
  });
}

export async function setWechat(payload) {
  return request(`${RestUrl}/subject/setTrustwechat/${payload.key}/${payload.trustwechat}`, {
    mode: 'cors',
  });
}

export async function deleteSubject(payload) {
  return request(`${RestUrl}/subject/delete/${payload.key}`, {
    mode: 'cors',
  });
}

/**
 * 删除主题的轮播图片，flag=（1=工作信息,2,3,4），key=主键）
 * @param payload
 * @returns {Promise<void>}
 */
export async function deleteAltern(payload) {
  return request(`${RestUrl}/subject/removePic/${payload.id}`, {
    mode: 'cors',
  });
}

export async function getJB(payload) {
  return request(`${RestUrl}/jb/get/${payload.flag}`, {
    mode: 'cors',
  });
}

export async function queryNotifyUser(params) {
  return request(`${RestUrl}/api/query`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryNotityList(params) {
  return request(`${RestUrl}/notify/getList`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function extExcel(payload) {
  return request(`${RestUrl}/subject/expExcel/${payload.key}`, {
    mode: 'cors',
  });
}

export async function setNotifyAgree(payload) {
  return request(`${RestUrl}/notify/setAgree/${payload.key}/${payload.agree}`, {
    mode: 'cors',
  });
}

export async function sendNotifyMsg(payload) {
  return request(`${RestUrl}/notify/sendMsg/${payload.key}`, {
    mode: 'cors',
  });
}
