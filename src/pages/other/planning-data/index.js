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
  Col, Row, Upload, Icon, Select, message,
} from 'antd';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

import './subject.less';
import { alternUrl, RestUrl, viewPubUrl, fileUrl } from '../../../const/localConfig';
import { getMyHeaders } from '../../../utils/utils';

const { Search, TextArea } = Input;
const { Option } = Select;
const fileUpAction = `${RestUrl}/api/fileUpload`;

@connect(({ subject, loading }) => ({
  listObj: subject.listObj,
  subjectList: subject.subjectList,
  workInfo: subject.workInfo,
  resultVo: subject.resultVo,
  bTable: subject.baseTable,
  loading: loading.models.subject,
}))

class WorkData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      fileList: [],
      total: 0,
    };
    this.key = 0;
    this.flag = 3;
    this.picFile = '';
    this.pageSize = 10;
    this.current = 1;
    this.attachList = [];
    this.baseTable = '';
    this.cname = '';
    this.initJB();
  }

  componentDidMount() {
    this.initDataSource({
      page: this.current,
      results: this.pageSize,
      flag: this.flag,
    });
    this.props.form.setFieldsValue({
      content: BraftEditor.createEditorState(''),
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          id: this.key,
          flag: this.flag,
          title: values.title,
          thumbnail: this.picFile,
          content: values.content.toHTML(),
          summary: values.summary,
          cname: values.cname,
          attach: this.attachList,
          scope: values.scope,
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
    this.picFile = '';
    this.attachList = [];
    this.setState({ fileList: [] });
    this.showModal();
  }

  parserFileList = str => {
    const fileList = [];
    const fs = str.split(',');
    let uid = 0;
    fs.forEach(obj => {
      const fobj = obj.split(':');
      fileList.push({
        uid,
        name: fobj[0],
        status: 'done',
        url: `${fileUrl}/${fobj[1]}`,
      })
      uid += 1;
    })
    return fileList;
  }

  handEdit = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/getSubject',
      payload: key,
    }).then(() => {
      const { workInfo } = this.props;
      const { title, summary, thumbnail, content, cname, attach, scope } = workInfo.data;
      this.props.form.setFieldsValue({
        title,
        summary,
        cname,
        scope,
        content: BraftEditor.createEditorState(content),
      });
      let fileList = [];
      if (attach !== null) {
        fileList = this.parserFileList(attach);
      }
      this.picFile = thumbnail;
      this.key = key;
      if (fileList.length > 0) {
        this.setState({ fileList });
      }
      this.showModal();
    });
  }

  handleView = key => {
    window.open(`${viewPubUrl}?id=${key}&flag=${this.flag}`, '_blank');
  }

  cancelModal = e => {
    this.setState({
      visible: false,
    });
  }

  saveForm = submitData => {
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
    }, {
      name: 'cname',
      where: 'eq',
      value: this.cname,
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

  switchChange = (key, publish) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/setPublish',
      payload: { key, publish: publish === 1 ? 0 : 1 },
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        flag: this.flag,
      });
    })
  }

  switchTrustWechat = (key, trustwechat) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/setTrustwechat',
      payload: { key, trustwechat: trustwechat === 1 ? 0 : 1 },
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
      type: 'subject/getSubjectList',
      payload,
    }).then(() => {
      const { subjectList: { data: { pages, records, total } } } = this.props;
      const dataSource = records;
      this.setState({ dataSource, total });
    })
  }

  initJB = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/getJb',
      payload: {
        flag: 1,
      },
    }).then(() => {
      const { bTable } = this.props;
      this.baseTable = bTable.data.map(item =>
        <Select.Option key={item.name}>{item.name}</Select.Option>);
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

  handleChange = value => {
    this.cname = value;
  }

  render() {
    const {
      loading,
      dataSource,
      visible,
      fileList,
      total } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        width: '20%',
        editable: true,
        sorter: true,
      },
      {
        title: '类别',
        dataIndex: 'cname',
        sorter: true,
      },
      {
        title: '发布状态',
        dataIndex: 'publish',
        render: (text, record) => (text === 1 ? (
          <Switch
            defaultChecked
            onChange={() => this.switchChange(record.id, record.publish)}
          />) : (
            <Switch
              onChange={() => this.switchChange(record.id, record.publish)}
            />
        )),
        sorter: true,
      },
      {
        title: '授权访问',
        dataIndex: 'trustwechat',
        key: 'trustwechat',
        render: (text, record) => (text === 1 ? (
          <Switch
            defaultChecked
            onChange={() => this.switchTrustWechat(record.id, record.trustwechat)}
          />) : (
          <Switch
            onChange={() => this.switchTrustWechat(record.id, record.trustwechat)}
          />
        )),
        sorter: true,
      },
      {
        title: '可见范围',
        dataIndex: 'scope',
        sorter: true,
      },
      {
        title: '发布日期',
        dataIndex: 'createtime',
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          (dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.handleView(record.id)}>预览</a>
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

    const setAttach = list => {
      this.attachList = [];
      list.forEach(obj => {
        const { name, response: { data } } = obj;
        this.attachList.push(`${name}:${data}`);
      });
    }
    const headers = getMyHeaders();
    const uploadProps = {
      name: 'file',
      action: fileUpAction,
      accept: '.pdf,.doc,.docx',
      data: {
        attr: 'file',
      },
      headers,
      defaultFileList: fileList,
      onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
          // console.log(info.fileList);
          setAttach(info.fileList);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    }

    const uploadForm = (
      <div className="clearfix">
        <Upload {...uploadProps}>
          <Button>
            <Icon type="upload" /> 点击上传资料
          </Button>
        </Upload>
      </div>
    );

    const controls = [
      'font-size', 'line-height', 'letter-spacing', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
       'list-ul', 'list-ol', 'separator', 'link', 'separator', 'media',
    ];

    const uploadFn = param => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      const successFn = response => {
        const rJson = JSON.parse(xhr.responseText);
        const url = `${alternUrl}/${rJson.data}`;
        param.success({
          url,
        });
      };

      const progressFn = event => {
        param.progress(event.loaded / event.total * 100)
      };

      const errorFn = response => {
        param.error({
          msg: '上传失败.',
        });
      };

      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);
      fd.append('file', param.file);
      fd.append('attr', 'altern');
      xhr.open('POST', fileUpAction, true);
      const { authorization } = getMyHeaders();
      xhr.setRequestHeader('authorization', authorization);
      xhr.send(fd);
    };

    const editorProps = {
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        validateFn: null, // 指定本地校验函数，说明见下文
        uploadFn, // 指定上传函数，说明见下文
        removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
      },
    }

    return (
      <Layout style={{ margin: '0', position: 'relative', minHeight: 0 }}>
        <Card
          bordered={false}
          style={{ marginTop: 20 }}
          bodyStyle={{ padding: '0 32px 20px 32px' }}
        >
          <div style={{ marginTop: 20 }}>
            <Select
              onChange={this.handleChange}
              style={{ width: '20%', marginRight: 10 }}
              placeholder="选择资料类别"
            >
              { this.baseTable }
            </Select>
            <Search style={{ width: '40%' }} placeholder="标题查询" onSearch={this.searchTitle} enterButton />
            <Button onClick={this.handleAdd} type="primary" style={{ marginLeft: 10 }}>
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
          width="100%"
          title="规划资料"
          visible={visible}
          destroyOnClose
          onCancel={this.cancelModal}
          mask={false}
          footer={null}
          style={{ paddingTop: 0 }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={15}>
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
              <Col span={1}></Col>
              <Col span={3}>
                <Form.Item>
                  {getFieldDecorator('scope', {
                    rules: [{
                      required: true,
                      message: '请选择可见范围',
                    }],
                  })(
                    <Select
                      placeholder="选择可见范围"
                    >
                      <Option value="北京市">北京市</Option>
                      <Option value="东城区">东城区</Option>
                      <Option value="西城区">西城区</Option>
                      <Option value="朝阳区">朝阳区</Option>
                      <Option value="海淀区">海淀区</Option>
                      <Option value="丰台区">丰台区</Option>
                      <Option value="石景山区">石景山区</Option>
                      <Option value="大兴区">大兴区</Option>
                      <Option value="房山区">房山区</Option>
                      <Option value="顺义区">顺义区</Option>
                      <Option value="昌平区">昌平区</Option>
                      <Option value="怀柔区">怀柔区</Option>
                      <Option value="密云区">密云区</Option>
                      <Option value="门头沟区">门头沟区</Option>
                      <Option value="平谷区">平谷区</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={3}>
                <Form.Item>
                  {getFieldDecorator('cname', {
                    rules: [{
                      required: true,
                      message: '请输入分类',
                    }],
                  })(
                    <Select
                      placeholder="选择资料类别"
                    >
                      { this.baseTable }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={15}>
                <Form.Item>
                  {getFieldDecorator('summary', {
                    rules: [{
                      required: true,
                      message: '请输入摘要',
                    }],
                  })(
                    <TextArea size="large" autosize={{ minRows: 6 }} placeholder="请输入摘要"/>,
                  )}
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={8}>
                <Form.Item>
                  {uploadForm}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('content', {
                    validateTrigger: 'onBlur',
                    rules: [{
                      required: true,
                      validator: (_, value, callback) => {
                        if (value.isEmpty()) {
                          callback('请输入正文内容')
                        } else {
                          callback()
                        }
                      },
                    }],
                  })(
                    <BraftEditor
                      {...editorProps}
                      contentStyle={{ height: 600 }}
                      controls={controls}
                      placeholder="请输入正文内容"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
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

const WorkDataForm = Form.create()(WorkData);
export default WorkDataForm;
