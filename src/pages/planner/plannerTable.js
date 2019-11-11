import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import ExportJsonExcel from 'js-export-excel';
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
  Col, Row, Upload, Icon, TreeSelect, message, DatePicker,
} from 'antd';
import { headUrl, RestUrl } from '../../const/localConfig';
import { getMyHeaders, getBase64, getCurrentUser } from '../../utils/utils';
import { cityTreeData as treeData } from '../../const/localData';

const { Option } = Select;
const { MonthPicker } = DatePicker;
const fileUpAction = `${RestUrl}/api/fileUpload`;

@connect(({ dutyuser, loading }) => ({
  listObj: dutyuser.listObj,
  resultList: dutyuser.resultList,
  resultVo: dutyuser.resultVo,
  styList:dutyuser.styList,
  userList:dutyuser.userList,
  countList:dutyuser.countList,
  loading: loading.models.dutyuser,
}))
class plannerTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      styVisible:false,

      previewVisible: false,
      previewImage: '',
      fileList: [],
      total: 0,
      street:'',
      roleTree:[],
      filter:[]
    };
    this.key = 0;
    this.picFile = '';
    this.pageSize = 10;
    this.current = 1;
    document.title="责任规划师管理";
  }

  componentDidMount() {

    //const street="东城区";
    const street=JSON.parse(getCurrentUser()).data.street;
    let {roleTree}=this.state;
    let filter;
    if(street==="北京市"){
      filter=[];
      roleTree=treeData;
    }else {
      filter=[{name:"street",where:"like",value:street}];
      for(let i=0;i<treeData.length;i++){
        if(treeData[i].title===street){
          roleTree.push(treeData[i]);
        }
      };
    }

    this.setState({street:street,filter:filter,roleTree:roleTree});

    this.initDataSource({
      page: this.current,
      results: this.pageSize,
      filter:JSON.stringify(filter)
    });
  }
  downloadExcel = () => {
// currentPro 是列表数据
    const { dispatch } = this.props;
    const {street}=this.state;
    let ft="select * from tb_user where  role=2 and  firstname ISNULL ";
    if(street!=="北京市"){
      ft+="and street like '%"+street+"%'";
    }
    dispatch({
      type: 'dutyuser/seachUser',
      payload:{
        table:'tb_user',
        action:'select',
        filter:ft
      }
    }).then(() => {
      dispatch({
        type: 'dutyuser/seachCount',
        payload:{
          table:'tb_user',
          action:'select',
          filter:"select count(DISTINCT classroomid),userid FROM tb_study_log GROUP BY userid"
        }
      }).then(() => {
        const {userList,countList}=this.props;

        var option={};
        let dataTable = [];
        for(let i in userList.data){
          userList.data[i].count=0;
          for(let j in countList.data){
            if(userList.data[i].id===countList.data[j].userid){
              userList.data[i].count=countList.data[j].count;
            }
          }
        }

        if (userList.data.length>0) {
          for (let i in userList.data) {
            let obj = {
              '姓名': userList.data[i].name,
              '手机号': userList.data[i].phone,
              '街道': userList.data[i].street,
              '学习情况': "学习了"+userList.data[i].count+"节课",

            };
            dataTable.push(obj);

          }
        }

        option.fileName = '规划师';
        option.datas=[
          {
            sheetData:dataTable,
            sheetName:'sheet',
            sheetFilter:['姓名','手机号','街道','学习情况'],
            sheetHeader:['姓名','手机号','街道','学习情况'],
          }
        ];
        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
      })
    })

  };
  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { name, sex, profile, street, loginname, phone } = values;
        const submitData = {
          id: this.key,
          name,
          sex,
          street,
          profile,
          loginname,
          phone,
          avatar: this.picFile,
        };
        this.saveForm(submitData);
      }
    })
  }

  handleDelete = key => {
    const { dispatch } = this.props;
    const {filter}=this.state;
    let ft="UPDATE tb_user SET ofyear = 0 where id =" +key;
    dispatch({
      type: 'dutyuser/updateSql',
      payload:{
        table:'tb_user',
        action:'select',
        filter:ft
      }
    }).then(() => {
      this.initDataSource({
        page: this.current,
        results: this.pageSize,
        filter:JSON.stringify(filter)
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
      const { name, sex, profile, avatar, street, loginname, phone } = resultVo.data;
      let vStreet = [];
      if (street !== null) {
        vStreet = street.split(',');
      }
      this.props.form.setFieldsValue({
        name,
        sex,
        profile,
        avatar,
        loginname,
        phone,
        street: vStreet,
      });
      this.picFile = avatar;
      let fileList=[];

      if(avatar!==null && avatar!==""){
        fileList = [
          {
            uid: key,
            status: 'done',
            url: `${headUrl}/${avatar}`,
          },
        ];
      }else {
        fileList = [
        ];
      }

      this.setState({ fileList });
      this.key = key;
      this.showModal();
    });
  }
  handStudy=key=>{
    const { dispatch } = this.props;
    let filter="SELECT count(*) from  tb_classroom WHERE id in (SELECT classroomid FROM tb_study_log WHERE userid="+key+")";
    dispatch({
      type: 'dutyuser/seachSty',
      payload:{
        table:'tb_classroom',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { styList } = this.props;

      this.setState({styList:styList.data[0].count});
    });
    this.showStyModal();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  showStyModal = () => {
    this.setState({
      styVisible: true,
    });
  }
  hideCancel = e => {
    this.setState({
      visible: false,
    });
  }
  hideStyCancel = e => {
    this.setState({
      styVisible: false,
    });
  }

  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  saveForm = (submitData) => {
    const { dispatch } = this.props;
    const {filter}=this.state;
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
          filter:JSON.stringify(filter)
        });
      }
    })
  }


  setVal = (val) => { //子组件传值
    const {filter}=this.state;
    const street=JSON.parse(getCurrentUser()).data.street;
    this.setState({searchVal:val});
    let ft=[];
    if(val.street!==undefined){
      ft.push({name:"street",where:"like",value:val.street});
    }
    if(val.name!==undefined){
      ft.push({name:"name",where:"like",value:val.name});
    }
    if(ft.length>0){
      this.initDataSource({
        page: 1,
        results: this.pageSize,
        filter:JSON.stringify(ft)
      });
      this.setState({filter:ft});
    }else {

      if(street==="北京市"){
        this.setState({filter:[]});
        this.initDataSource({
          page: 1,
          results: this.pageSize,

        });
      }else {
        this.setState({filter:[{name:"street",where:"like",value:street}]});
        this.initDataSource({
          page: 1,
          results: this.pageSize,
          filter:JSON.stringify([{name:"street",where:"like",value:street}])
        });
      }

    }

  };
  initDataSource = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dutyuser/fetchList',
      payload,
    }).then(() => {
      const { resultList: { data: { pages, records, total } } } = this.props;
      const dataSource = [];
      records.forEach(item => {
        const { name, sex, loginname, avatar,
          address, phone, street, role, profile, id } = item;
        dataSource.push({
          name,
          sex,
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



  handleTableChange = (pagination, filters, sorter) => {
    const { pageSize, current } = pagination;
    const {filter}=this.state;
   // const street="东城区";
    this.pageSize = pageSize;
    this.current = current;
    const payload = {
      results: pageSize,
      page: current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filter: JSON.stringify(filter),
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
      total,roleTree ,styList} = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',


      },
      {
        title: '手机号',
        dataIndex: 'phone',

      },
      {
        title: '负责街道',
        dataIndex: 'street',

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
              <Divider type="vertical" />
              <a onClick={() => this.handStudy(record.id)}>查看学习情况</a>
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
      treeData:roleTree,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
      },
    };

    return (
      <Layout  style={{ margin: '0', position: 'relative', minHeight: 0 }}>
        <Card
          bordered={false}

          bodyStyle={{ padding: '0 32px 40px 32px' }}
        >

          <div style={{ marginTop: 20}}>
            <Search  dispatch={this.props.dispatch}  setVal={this.setVal}/>
            <Button onClick={this.downloadExcel} type="primary" style={{ float:'right',marginBottom :20 ,marginLeft:10}}>
              下载
            </Button>
            <Button onClick={this.handleAdd} type="primary" style={{ float:'right',marginBottom :20}}>
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
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
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
        <Modal
          title="学习情况"
          visible={this.state.styVisible}
          footer={null}
          onCancel={this.hideStyCancel}
        >
          <p>该用户学习了{styList}节课</p>

        </Modal>
      </Layout>
    );
  }
}
class Search extends PureComponent {
componentDidMount() {
  const street=JSON.parse(getCurrentUser()).data.street;
  //const street="东城区";
  let roleTree=[];
  if(street==="北京市"){
    roleTree=treeData;
  }else {
    for(let i=0;i<treeData.length;i++){
      if(treeData[i].title===street){
        roleTree.push(treeData[i]);
      }
    };
  }

  this.setState({roleTree:roleTree});
}

  state = {};
  handleReset=()=>{
    const { form } = this.props;
    form.resetFields();
    const {setVal} = this.props;//重要
    let values={
      street:undefined,

      name:undefined
    };
    setVal(values);

  };

  onValidateForm = (e) => {
    e.preventDefault();
    const {validateFields} = this.props.form;
    const {setVal} = this.props;//重要
    validateFields((err, values) => {
      if (!err) {
        setVal(values);
      }
    });
  };

  render() {
   const roleTree=this.state;
    const treeProps = {
      treeData:roleTree.roleTree,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
      },
    };
    const {} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.onValidateForm}>
        <Row>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('street', {
              })(
                <TreeSelect {...treeProps} placeholder="请选择街道" />,
              )}
            </Form.Item>

          </Col>
          <Col span={1}>

          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('name', {

              })(<Input placeholder="输入责任规划师名字"/>
              )}
            </Form.Item>
          </Col>
          <Col span={1}>

          </Col>
          <Col span={2}>
            <Button type="primary" htmlType="submit" >
              <Icon type="search"/>
              查询
            </Button>

          </Col>

          <Col span={2}>
            <Button onClick={this.handleReset} type="primary" style={{marginLeft: 20}}>
              <Icon type="redo" />重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
Search = Form.create()(Search);
const plannerForm = Form.create()(plannerTable);
export default plannerForm;
