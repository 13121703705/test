import React, { Component } from "react";
import { Form, Modal, Row, Col, Input ,Button,message} from 'antd';
import styles from '../layouts/MyLayout.less';
import { connect } from 'dva';
import { getCurrentUser } from '../utils/utils';

@connect(({user,loading}) => ({
  currentUser:user.currentUser,
  statusFlag:user.statusFlag,
  loading:loading.models.user
}))

 class CommonHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
     user:""
    };
  }
  componentDidMount() {
 this.setState({user:JSON.parse(getCurrentUser()).data.name});

 //   this.setState({user:"xxxx"});
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  changePwd=()=> {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    this.cancelModal();
    validateFields((err, values) => {
      if (!err) {

        dispatch({
          type: 'user/change',
          payload: {
             password: values.password,
            newpwd: values.newpwd,
            userName: 1600
          }
        }).then(() => {
          const { statusFlag }  = this.props;
          message.error(statusFlag.data.msg, 1 );

        });
      }
    });

  };
  //关闭modal
  cancelModal = () => {

    this.setState({
      visible: false,
    });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newpwd')) {
      callback('两次密码输入必须一致!');
    } else {
      callback();
    }
  };
  render() {
    const {visible,user}= this.state;
    const { getFieldDecorator } = this.props.form;
    const form = () => {
      return (
        <Form >
          <Row>
            <Col span={3}>
              <h2>原密码：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入原密码!',
                    },
                  ],
                })(
                  <Input.Password size="large" placeholder="请输入原密码" />,
                )}
              </Form.Item>
            </Col>

          </Row>
          <Row>
            <Col span={3}>
              <h2>新密码:</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('newpwd', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码!',
                    },
                  ],
                })(
                  <Input.Password size="large" placeholder="请输入新密码"  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <h2>再次新密码:</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '请再次输入新密码!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <Input.Password size="large" placeholder="请输入新密码"  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>

            <Col span={20}>
              <Form.Item>
                <Button size="large" type="primary" onClick={this.changePwd}>保存基本信息</Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      );

    };
 return(

   <div >
     <img src='http://www.bjcsghxh.com/data/altern/logo3.png'  height='100%'  width='100%'/>
     <div className={styles.logo}>
       欢迎{user}&nbsp;
       <img src="http://www.bjcsghxh.com/data/altern/设置按钮.png" width="14px" height="14px"/>  &nbsp;
       <a onClick={this.showModal}>修改密码</a>&nbsp;
       <img src="http://www.bjcsghxh.com/data/altern/退出按钮.png" width="14px" height="14px"/>&nbsp;
       <a href="http://www.bjcsghxh.com:8000/user/login" >退出</a>

     </div>
     <Modal
       width="80%"
       title="修改密码"
       visible={visible}
       destroyOnClose
       onCancel={this.cancelModal}
       mask={false}
       footer={null}
       style={{ paddingTop: 0 }}
     >
       {form()}
     </Modal>
   </div>
 )
  }

}

const CommonForm = Form.create()(CommonHeader);
export default CommonForm;
