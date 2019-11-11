import request from '@/utils/request';
import { RestUrl } from '../../../const/localConfig';

/**
 * 保存基础数据菜单
 * @param id =0 代表新增，其它数值代表修改该信息
 * @returns {Promise<void>}
 */
export async function saveObj(params) {
  return request(`${RestUrl}/base/save`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryList() {
  return request(`${RestUrl}/base/getMenu`, {
    mode: 'cors',
  });
}

export async function queryObj(payload) {
  return request(`${RestUrl}/base/get/${payload.key}`, {
    mode: 'cors',
  });
}

export async function deleteObj(payload) {
  return request(`${RestUrl}/base/delete/${payload.key}`, {
    mode: 'cors',
  });
}
