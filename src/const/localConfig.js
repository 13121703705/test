// 前端发布系统地址 http://www.bjcsghxh.com localhost
export const nginxUri = 'http://www.bjcsghxh.com:8000';
//export const nginxUri = 'http://localhost:8000';
export const tomcatUri = 'http://www.bjcsghxh.com'; // 'http://localhost';
export const plannerUrl = 'http://localhost:8000';
// 后台接口地址，有可能后台接接口跟前端界面没有部署在一台服务器上 39.107.72.184
const serverApiUri = `${tomcatUri}/bmicpd`;

// 后台管理系统地址
export const adminHostUrl = `${nginxUri}`;

export const RestUrl = `${serverApiUri}`;

export const myUrl = `${plannerUrl}`;
// 浏览主题模板，地址
export const viewPubUrl = `${tomcatUri}/pub/template.html`;

// 责任规划师工作信息管理平台入口
export const userHostUrl = `${adminHostUrl}/jcsj.html`;


// 轮播图片的显示地址
export const alternUrl = `${tomcatUri}/data/altern`;

// 微信小程序图标存放地址
export const miniICON = `${tomcatUri}/data/mini`;

// 视频本地url存放地址
export const videoUrl = `${tomcatUri}/data/video`;

// 视频本地url存放地址
export const headUrl = `${tomcatUri}/data/head`;

// 普通文件本地url存放地址
export const fileUrl = `${tomcatUri}/data/file`;

// 普通文件本地url存放地址
export const excelUrl = `${tomcatUri}/data/excel`;
