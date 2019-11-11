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
  Col, Row,
} from 'antd';
import '../../../global.less';

const { Search } = Input;

@connect(({ base, loading }) => ({
  resultList: base.resultList,
  resultVo: base.resultVo,
  loading: loading.models.base,
}))
class BaseData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
    };
    this.id = 0;
    this.parent = 0;
  }

  componentDidMount() {
    this.initDataSource();
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { name, address } = values;
        const submitData = {
          id: this.id,
          name,
          address,
          parent: this.parent,
        }
        this.saveForm(submitData);
        this.hideCancel();
        Modal.destroyAll();
      }
    })
  }

  handleDelete = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/del',
      payload: { key },
    }).then(() => {
      this.initDataSource();
    })
  }

  handleAdd = pid => {
    this.id = 0;
    this.parent = pid;
    this.showModal();
  }

  handleAddRoot = () => {
    this.id = 0;
    this.parent = 0;
    this.showModal();
  }

  handEdit = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/fetch',
      payload: { key },
    }).then(() => {
      const { resultVo } = this.props;
      const { name, address } = resultVo.data;
      this.props.form.setFieldsValue({
        name,
        address,
      });
      this.id = key;
      this.showModal();
    });
  }

  hideCancel = e => {
    this.setState({
      visible: false,
    });
  }

  saveForm = submitData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: submitData,
    }).then(() => {
      this.initDataSource();
    })
  }

  searchTitle = value => {
    const payload = {
      filter: value,
    }
    this.initDataSource();
  }

  /**
   * 解析器
   * @param srcArr
   * @param pid
   * @param data
   * @returns {Array}
   */
  parseArrToJson = (srcArr, pid, data = []) => {
    const oneLevel = srcArr.filter(item => item.parent === pid);
    oneLevel.forEach(one => {
      const { id, name, address, parent } = one;
      const row = { key: id, id, name, address };
      const twoLevel = srcArr.filter(item => item.parent === id);
      if (twoLevel.length > 0) {
        row.children = [];
        this.parseArrToJson(srcArr, id, row.children);
      }
      data.push(row);
    })
  }

  initDataSource = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/fetchList',
    }).then(() => {
      const { resultList: { data } } = this.props;
      const dataSource = [];
      this.parseArrToJson(data, 0, dataSource);
      this.setState({ dataSource });
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }


  render() {
    const { loading, dataSource } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '菜单名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '发布地址',
        dataIndex: 'address',
        key: 'address',
        width: '40%',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) =>
          (dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.handleAdd(record.key)}>添加子菜单</a>
              <Divider type="vertical" />
              <a onClick={() => this.handEdit(record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          ) : null),
      },
    ];
    return (
      <Layout style={{ margin: '0', position: 'relative', minHeight: 0 }}>
        <Card
          bordered={false}
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >
          <div style={{ marginTop: 20 }}>
            <Button onClick={this.handleAddRoot} type="primary" style={{ marginLeft: 20 }}>
              添加主菜单
            </Button>
          </div>
          <div style={{ marginTop: 30 }}>
            <Table
              rowKey={record => record.key}
              columns={columns}
              dataSource={ dataSource }
              pagination={false}
              loading={ loading }
            />
          </div>
        </Card>

        <Modal
          width="50%"
          title="基础数据"
          visible={this.state.visible}
          destroyOnClose
          onCancel={this.hideCancel}
          mask={false}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label="菜单名">
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '请输入菜单名',
                    }],
                  })(
                    <Input size="large" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="服务地址">
                  {getFieldDecorator('address', {
                    rules: [{
                      required: false,
                      message: '请输入发布服务地址',
                    }],
                  })(
                    <Input size="large" />,
                  )}
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

const BaseDataForm = Form.create()(BaseData);
export default BaseDataForm;
