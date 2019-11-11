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
  Switch,
  Col, Row, DatePicker,
} from 'antd';
import moment from 'moment';
import '../subject.less';
import { excelUrl } from '../../../const/localConfig';

const { Search } = Input;

@connect(({ subject, loading }) => ({
  listObj: subject.listObj,
  resultVo: subject.resultVo,
  workInfo: subject.workInfo,
  excelObj: subject.excelObj,
  loading: loading.models.subject,
}))

class NotifyMan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      total: 0,
    };
    this.key = 0;
    this.flag = 6;
    this.pageSize = 10;
    this.current = 1;
    this.endTime = '';
  }

  componentDidMount() {
    this.initDataSource({
      page: this.current,
      results: this.pageSize,
      flag: this.flag,
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          id: this.key,
          flag: this.flag,
          title: values.title,
          endtime: `${this.endTime} 12:59:59`,
          scope:values.scope,
          meetingtime: `${this.meetingtime} 12:59:59`,
          attach: values.attach,
        }
        this.saveForm(submitData);
        this.cancelModal();
        Modal.destroyAll();
      }
    })
  }

  handleDelete = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/delSubject',
      payload: { key },
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        flag: this.flag,
      });
    })
  }

  handleAdd = () => {
    this.key = 0;
    this.endTime = '';
    this.meetingtime='';
    this.showModal();
  }

  handEdit = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/getSubject',
      payload: key,
    }).then(() => {
      const { workInfo } = this.props;
      const { title, endtime, attach,scope,meetingtime } = workInfo.data;
      this.props.form.setFieldsValue({
        title,
        endtime: moment(endtime, 'YYYY-MM-DD HH:ss'),
        attach,
        scope,
        meetingtime:moment(meetingtime, 'YYYY-MM-DD HH:ss'),
      });
      this.key = key;
      this.showModal();
    });
  }

  sendWechatToUser = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/sendMsg',
      payload: { key },
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        flag: this.flag,
      });
    });
  }

  expExcel = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/excel',
      payload: { key },
    }).then(() => {
      const { excelObj } = this.props;
      const excel = excelObj.data;
      const downUrl = `${excelUrl}/${excel}`;
      window.open(downUrl, '_blank');
    })
  }

  cancelModal = e => {
    this.setState({
      visible: false,
    });
  }

  saveForm = (submitData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/save',
      payload: submitData,
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        flag: this.flag,
      });
    })
  }

  searchTitle = value => {
    const v = [{
      name: 'title',
      where: 'like',
      value,
    }];
    const filter = JSON.stringify(v);
    const payload = {
      filter,
      page: 1,
      results: 10,
      flag: this.flag,
    }
    this.initDataSource(payload);
  }

  switchChange = (key, agree) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/setAgree',
      payload: { key, agree: agree === 1 ? 0 : 1 },
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        flag: this.flag,
      });
    })
  }

  initDataSource = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/getNotifyList',
      payload,
    }).then(() => {
      const { resultVo: { data } } = this.props;
      const dataSource = data;
      const total = data.length;
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

  dateChange = (date, dateString) => {
    this.endTime = dateString;
  };
  dateChange2 = (date, dateString) => {
    this.meetingtime = dateString;
  }

  render() {
    const selfDuty = (text) => {
      let xtxt = '';
      if (text === 1) {
        xtxt = '是';
      }
      if (text === 0) {
        xtxt = '否';
      }
      return xtxt;
    }

    const selfAgree = (text, record) => {
      let xtxt = '';
      if (text === 1) {
        xtxt = (
          <Switch
            defaultChecked
            onChange={() => this.switchChange(record.id, record.agree)}
          />);
      }
      if (text === 0) {
        xtxt = (
          <Switch
            onChange={() => this.switchChange(record.id, record.agree)}
          />);
      }
      return xtxt;
    }

    const selfStatus = (text) => {
      let xtxt = '是';
      if (text === 999999) {
        xtxt = '否';
      }
      if (text === undefined) {
        xtxt = '';
      }
      return xtxt;
    }

    const {
      loading,
      dataSource,
      visible,
      total } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        editable: true,
        sorter: true,
      },
      {
        title: '截止日期',
        dataIndex: 'endtime',
        key: 'endtime',
        render: (text, record) => (text.substring(0, 10)),
        sorter: true,
      },
      {
        title: '职务',
        dataIndex: 'jobwork',
        key: 'jobwork',
      },
      {
        title: '责任规划师',
        dataIndex: 'dutyflag',
        key: 'dutyflag',
        render: (text, record) => selfDuty(text),
      },
      {
        title: '允许报名',
        dataIndex: 'agree',
        key: 'agree',
        render: (text, record) => selfAgree(text, record),
      },
      {
        title: '是否已发送通知',
        dataIndex: 'errcode',
        key: 'errcode',
        render: (text, record) => selfStatus(text),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          (text === 1 ? (
            <Fragment>
              <a onClick={() => this.sendWechatToUser(record.id)}>通知</a>
              <Divider type="vertical" />
              <a onClick={() => this.handEdit(record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record.id)}>
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
          style={{ marginTop: 20 }}
          bodyStyle={{ padding: '0 32px 20px 32px' }}
        >
          <div style={{ marginTop: 20 }}>
            <Search style={{ width: '50%' }} placeholder="标题查询" onSearch={this.searchTitle} enterButton />
            <Button onClick={this.handleAdd} type="primary" style={{ marginLeft: 20 }}>
              添加
            </Button>
          </div>
          <div style={{ marginTop: 20 }}>
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
          title="报名通知"
          visible={visible}
          destroyOnClose
          onCancel={this.cancelModal}
          mask={false}
          footer={null}
          style={{ paddingTop: 0 }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true,
                      message: '请输入标题',
                    }],
                  })(
                    <Input size="large" placeholder="请输入标题" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('attach', {
                    rules: [{
                      required: true,
                      message: '输入宣传地址',
                    }],
                  })(
                    <Input size="large" placeholder="输入宣传地址" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('scope', {
                    rules: [{
                      required: true,
                      message: '输入活动地址',
                    }],
                  })(
                    <Input size="large" placeholder="输入活动地址" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator('endtime', {
                    rules: [{
                      required: true,
                      message: '请选择截止日期',
                    }],
                  })(
                    <DatePicker onChange={this.dateChange} placeholder="请输入截至时间" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={1}>

              </Col>

            </Row>
            <Row>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator('meetingtime', {
                    rules: [{
                      required: true,
                      message: '请选择截止日期',
                    }],
                  })(
                    <DatePicker onChange={this.dateChange2}  placeholder="请输入活动时间"/>,
                  )}
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={6}>
                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit">保存基本信息</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

const NotifyManForm = Form.create()(NotifyMan);
export default NotifyManForm;
