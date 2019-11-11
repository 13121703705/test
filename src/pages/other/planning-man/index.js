import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Layout,
  Modal,
  Table,
  Popconfirm,
  Form,
  Input,
  Button,
  Divider,
  Card,
  Select,
  Col, Row, Upload, Icon, TreeSelect, message,
} from 'antd';
import { headUrl, RestUrl } from '../../../const/localConfig';
import { getMyHeaders, getBase64 } from '../../../utils/utils';
import { cityTreeData as treeData } from '../../../const/localData';
import '../../../global.less';

const { Search } = Input;
const { Option } = Select;
const fileUpAction = `${RestUrl}/api/fileUpload`;

@connect(({ dutyuser, loading }) => ({
  listObj: dutyuser.listObj,
  resultList: dutyuser.resultList,
  resultVo: dutyuser.resultVo,
  loading: loading.models.dutyuser,
}))
class DutyMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      selectedRowKeys: [],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      total: 0,
    };
    this.key = 0;
    this.picFile = '';
    this.pageSize = 10;
    this.current = 1;
  }

  componentDidMount() {
    this.initDataSource({
      page: this.current,
      results: this.pageSize,
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { name, sex, ofyear, profile, street, loginname, phone } = values;
        const submitData = {
          id: this.key,
          name,
          sex,
          ofyear,
          street,
          profile,
          loginname,
          phone,
          avatar: this.picFile,
        }
        this.saveForm(submitData);
      }
    })
  }

  handleDelete = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dutyuser/del',
      payload: { key },
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
      });
    })
  }

  handleAdd = () => {
    this.key = 0;
    this.picFile = '';
    this.setState({ fileList: [] });
    this.showModal();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
      const fileList = [
        {
          uid: currentUser.key,
          status: 'done',
          url: `${currentUser.avatar}`,
        },
      ];
      this.setState({ fileList });
    }
  };

  handEdit = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dutyuser/fetch',
      payload: { key },
    }).then(() => {
      const { resultVo } = this.props;
      const { name, sex, ofyear, profile, avatar, street, loginname, phone } = resultVo.data;
      let vStreet = [];
      if (street !== null) {
        vStreet = street.split(',');
      }
      this.props.form.setFieldsValue({
        name,
        sex,
        ofyear,
        profile,
        avatar,
        loginname,
        phone,
        street: vStreet,
      });
      this.picFile = avatar;
      const fileList = [
        {
          uid: key,
          status: 'done',
          url: `${headUrl}/${avatar}`,
        },
      ];
      this.setState({ fileList });
      this.key = key;
      this.showModal();
    });
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  }

  hideCancel = e => {
    this.setState({
      visible: false,
    });
  }

  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  saveForm = (submitData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dutyuser/save',
      payload: submitData,
    }).then(() => {
      const { resultVo: { code, msg } } = this.props;
      if (code === 0) {
        message.error(msg);
      } else {
        this.hideCancel();
        Modal.destroyAll();
        this.initDataSource({
          page: this.current,
          results: this.pageSize,
        });
      }
    })
  }

  searchTitle = value => {
    const payload = {
      page: 1,
      results: 10,
      filter: value,
    }
    this.initDataSource(payload);
  }

  initDataSource = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dutyuser/fetchList',
      payload,
    }).then(() => {
      const { resultList: { data: { pages, records, total } } } = this.props;
      const dataSource = [];
      records.forEach(item => {
        const { name, sex, ofyear, loginname, avatar,
          address, phone, street, role, profile, id } = item;
        dataSource.push({
          name,
          sex,
          ofyear,
          loginname,
          avatar,
          address,
          phone,
          street,
          role,
          profile,
          id,
        })
      })
      this.setState({ dataSource, total });
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { pageSize, current } = pagination;
    this.pageSize = pageSize;
    this.current = current;
    const payload = {
      results: pageSize,
      page: current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filter: null,
      flag: this.flag,
    }
    this.initDataSource(payload);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    if (file.status === 'done') {
      // 服务器返回的图片文件名，临时保存起来，回头提交的时候用
      this.picFile = file.response.data;
    }
  };

  handleRemove = file => {
    this.picFile = '';
  };

  render() {
    const {
      loading,
      dataSource,
      selectedRowKeys,
      previewVisible,
      previewImage,
      fileList,
      total } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '30%',
        editable: true,
        sorter: true,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        sorter: true,
      },
      {
        title: '签约时间',
        dataIndex: 'ofyear',
        sorter: true,
      },
      {
        title: '负责街道',
        dataIndex: 'street',
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          (dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.handEdit(record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          ) : null),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const headers = getMyHeaders();
    const AvatarView = (
      <div className="clearfix">
        <Upload
          action={fileUpAction}
          headers={headers}
          data={{ attr: 'head' }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );

    const treeProps = {
      treeData,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
      },
    };

    return (
      <Layout style={{ margin: '0', position: 'relative', minHeight: 0 }}>
        <Card
          bordered={false}
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >
          <div style={{ marginTop: 20 }}>
            <Search style={{ width: '50%' }} placeholder="规划师姓名查询" onSearch={this.searchTitle} enterButton />
            <Button onClick={this.handleAdd} type="primary" style={{ marginLeft: 20 }}>
              添加
            </Button>
          </div>
          <div style={{ marginTop: 30 }}>
            <Table
              rowKey={record => record.id}
              columns={columns}
              pagination={{
                defaultPageSize: 10,
                simple: false,
                total,
                showSizeChanger: false,
                itemRender: (current, type, originalElement) => {
                  if (type === 'prev') {
                  return <a>上一页</a>;
                }
                  if (type === 'next') {
                  return <a>下一页</a>;
                }
                  return originalElement;
                },
              }}
              dataSource={ dataSource }
              size="small"
              loading={ loading }
              onChange={this.handleTableChange}
            />
          </div>
        </Card>

        <Modal
          width="60%"
          title="责任规划师"
          visible={this.state.visible}
          destroyOnClose
          onCancel={this.hideCancel}
          mask={false}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '请输入规划师姓名',
                    }],
                  })(
                    <Input size="large" placeholder="请输入规划师姓名" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('loginname', {
                    rules: [{
                      required: false,
                      message: '请输入登录账号',
                    }],
                  })(
                    <Input size="large" placeholder="请输入登录账号" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('phone', {
                    rules: [{
                      required: true,
                      message: '请输入手机号',
                    }],
                  })(
                    <Input size="large" placeholder="请输入手机号" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('ofyear', {
                    rules: [{
                      required: true,
                      message: '请输入签约时间',
                    }],
                  })(
                    <Input size="large" placeholder="请输入签约时间" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('street', {
                    rules: [{
                      required: true,
                      message: '请选择区县街道',
                    }],
                  })(<TreeSelect {...treeProps} placeholder="请选择街道" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('sex', {
                    rules: [{
                      required: false,
                      message: '请选择性别',
                    }],
                  })(
                    <Select placeholder="请选择性别">
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={20}>
                <Form.Item>
                  {getFieldDecorator('profile', {
                    rules: [
                      {
                        required: false,
                        message: '请输入个人简介',
                      },
                    ],
                  })(
                    <Input.TextArea
                      placeholder="请输入个人简介"
                      autosize={{ minRows: 6, maxRows: 10 }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  {getFieldDecorator('avatar', {
                    rules: [
                      {
                        required: false,
                        message: '用户头像',
                      },
                    ],
                  })(AvatarView)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">提交</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

const DutyManForm = Form.create()(DutyMan);
export default DutyManForm;
