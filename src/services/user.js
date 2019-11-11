import request from '../utils/request';

const url = "http://39.107.72.184/bmicpd/user/chgPwd";
export async function queryCurrent() {
  const user = sessionStorage.getItem('currentUser');
  if (user === 'null' || user === null || user === undefined || user === 'undefined') {
    return {
      name: undefined,
      avatar: undefined,
      id: undefined,
    };
  }
  const userObj = JSON.parse(user).data;
  return userObj;
}
export async function changPwd(params) {
  return request(url,{
    mode: 'cors',
    method: 'POST',
     data:params,
    requestType: 'form'
  });
}
