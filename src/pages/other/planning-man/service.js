import request from '@/utils/request';
import { RestUrl } from '../../../const/localConfig';

/**
 * 保存工作信息
 * @param id =0 代表新增，其它数值代表修改该信息
 * @returns {Promise<void>}
 */
export async function saveDutyUser(params) {
  return request(`${RestUrl}/user/save`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryDutyUserList(params) {
  return request(`${RestUrl}/user/getList`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryDutyUser(payload) {
  return request(`${RestUrl}/user/get/${payload.key}`, {
    mode: 'cors',
  });
}

export async function deleteDutyUser(payload) {
  return request(`${RestUrl}/user/delete/${payload.key}`, {
    mode: 'cors',
  });
}
