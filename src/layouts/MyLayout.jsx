
import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Modal, Row, Col, Input,Form } from 'antd';
import styles from './MyLayout.less';
import SideMenu from '../common/SideMenu';
import CommonHeader from '../common/CommonHeader';

/**
 * use Authorized check all menu item
 */

const { Header, Footer,Content } = Layout;


const footerRender = () => {
  return (
    <div
      style={{
        padding: '0px 24px 24px',
        textAlign: 'center',
      }}
    >
        版权所有:北京城市规划学会	   地址：北京市西城区三里河东路乙10号	  <br/><br/>
        <img src="http://www.bjcsghxh.com/data/altern/警徽.png" width="14px" height="14px"/> &nbsp;
      京ICP备15042304

    </div>

  );
};
const MyLayout = props => {

  return (
    <Layout>
      <Header className={styles.header}>
        <CommonHeader{...props}/>
      </Header>

      <Layout >

         < SideMenu {...props}/>

        <Layout style={{ padding: '0' }}>
          <Content
            style={{
              background: '#fff',
              marginTop:20,
              marginLeft:20,
              marginRight:20,
              minHeight: 300,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
      <Footer>
        {footerRender()}
      </Footer>
    </Layout>
  );
};

export default connect(({ global, settings }) => ({

}))(MyLayout);
