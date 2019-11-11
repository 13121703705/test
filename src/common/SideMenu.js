import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "rc-drawer/assets/index.css";
import { Layout, Menu, Icon } from "antd";
  import { urlToList } from "../common/pathTools";
import pathToRegexp from "path-to-regexp";
import styles from '../layouts/MyLayout.less';
const { Sider } = Layout;
const { SubMenu } = Menu;

const menuData = [
  // {
  //   path: "/manage/planner",
  //   name: "责任规划师",
  //   icon: "mail",
  //   children: [
  //     {
  //       name: "管理",
  //       path: "/manage/planner/plannerTable"
  //     },
  //
  //   ]
  // },
  {
    name: "月报管理",
    path: "/manage/monthly",
    icon: "appstore",
    children: [
      {
        name: "工作月报",
        path: "/manage/monthly/monthlyTable"
      }
    ]
  },
  {
    name: "问题管理",
    path: "/manage/feedback",
    icon: "appstore",
    children: [
      {
        name: "问题反馈",
        path: "/manage/feedback/feedbackTable"
      }
    ]
  },
  {
    name: "责任规划师管理",
    path: "/manage/planner",
    icon: "appstore",
    children: [
      {
        name: "责任规划师管理",
        path: "/manage/planner/plannerTable"
      }
    ]
  },
];
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

class SiderMenu extends Component {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }

  getDefaultCollapsedSubMenus(props) {
    const {
      location: { pathname }
    } = props;
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
  }
 isMainMenu = key => {
    return this.flatMenuKeys.some(item => key && (item.key === key || item.path === key));
  };

  onOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys]
    });
  };

  MenuItem(dataSource) {
    return (
      dataSource.map((menu, index) => {
        if (menu.children) {
          return (
            <SubMenu key={menu.path} title={<span><Icon type={menu.icon}/><span>{menu.name}</span></span>}>
              {this.MenuItem(menu.children)}
            </SubMenu>
          );
        } else {
          return (<Menu.Item key={menu.path}><Icon type={menu.icon}/><span>{menu.name}</span><Link
            to={menu.path}/></Menu.Item>);
        }
      })
    );
  }

  getSelectedMenuKeys = () => {
    const {
      location: { pathname }
    } = this.props;
    return getMenuMatchKeys(this.flatMenuKeys, urlToList(pathname));
  };

  render() {

    const { collapsed } = this.props;
    const { openKeys} = this.state;
    const menuProps = collapsed
      ? {}
      : {
        openKeys
      };

    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];

    }
    return(
      <Sider width={200}
           style={{ background: '#fff' }}>
        <div className="logo"/>
        <Menu style={{background:"#fff"}}  mode="inline"
              {...menuProps}

              onOpenChange={this.onOpenChange}
              selectedKeys={selectedKeys}
        >
          {
            this.MenuItem(menuData)
          }
        </Menu>
      </Sider>
    );}
  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (nextProps.location.pathname !== location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      });
    }
  }
}

export default withRouter(SiderMenu);
