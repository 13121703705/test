import React, {Component, Fragment, PureComponent} from 'react';
import ExportJsonExcel from 'js-export-excel';
import { Divider,DatePicker, Popconfirm, message, Layout,Modal,Table,Form,Input,Button,Card,Col, Row, Icon,Upload} from 'antd';
import {connect} from 'dva';
import styles from '../Table.less';
import { getCurrentUser, getMyHeaders,getDefaultAction,getDefaultImg } from '../../utils/utils';
const { MonthPicker } = DatePicker;

const { TextArea } = Input;
const ButtonGroup = Button.Group;

@connect(({monthlymodel,loading}) => ({
  subjectList:monthlymodel.subjectList,
  subjectBean:monthlymodel.subjectBean,
  loading:loading.models.monthlymodel
}))

class monthlyTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataSource: [],
      imageUrl:'',
      fileList:[],
      street:""
    };
    document.title="月报管理";
  }
  componentDidMount() {
    this.initDataSource();
  }
  //导出
  downloadExcel = () => {
// currentPro 是列表数据
    const { dataSource } = this.state;
    var option={};
    let dataTable = [];
    if (dataSource.length>0) {
      for (let i in dataSource) {
        let obj = {
          '标题': dataSource[i].title,
          '内容': dataSource[i].content,
          '时长': dataSource[i].usetime,
          '街道': dataSource[i].scope,
          '任务': dataSource[i].cname,
          '时间': dataSource[i].creattime,
        };
        dataTable.push(obj);
      }
    }
    option.fileName = '工作月报';
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:['标题','内容','时长','街道','任务','时间'],
        sheetHeader:['标题','内容','时长','街道','任务','时间'],
      }
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };
  //获取表格数据
  initDataSource=()=>{
   const street=JSON.parse(getCurrentUser()).data.street;
    //const street="北京市";
    const {dispatch} =this.props;
    let filter="select * from tb_monthly ";
    if(street!=="北京市"){
      filter+=" where scope like "+"'%"+street+"%'";
    }
    filter+=" order by id desc";
    dispatch({
      type:'monthlymodel/fetch',
      payload:{
        table:'tb_monthly',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { subjectList }  = this.props;
      const dataSource=subjectList.data;
      this.setState({dataSource:dataSource});
    });
  };
  //新增
  handleAdd = () => {
    this.showModal();
  };
  //呼出Modal
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //关闭modal
  cancelModal = () => {
    this.setState({fileList:[]});
    this.setState({
      visible: false,
    });
  };
  //修改
  handEdit=key=>{
    const {dispatch} =this.props;
    let filter="select * from tb_monthly where id="+key+"";
    dispatch({
      type:'monthlymodel/queryById',
      payload:{
        table:'tb_monthly',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { subjectBean } = this.props;
      console.log(subjectBean);
      const { title, cname, scope, content,usetime,id,attach,creattime } = subjectBean.data[0];
      let fileList;
       fileList=JSON.parse(attach);
      this.setState({fileList});
      this.props.form.setFieldsValue({
        title,
        cname,
        creattime,
        scope,
        content,
        usetime,
        id
      });
      this.showModal();
    });
  };

  //刷新
  handleReset=()=>{
    const { form } = this.props;
    form.resetFields();
    this.initDataSource();
  };
  //条件查询
  setVal = (val) => { //子组件传值
    const {dispatch} =this.props;
    this.setState({searchVal:val});
    const street=JSON.parse(getCurrentUser()).data.street;
   // const street="北京市";
    let filter="select * from tb_monthly where 1=1 ";
    if(street!=="北京市"){
      filter+=" and scope like "+"'%"+street+"%'";
    }
    if(val.starttime!==undefined){
      filter+= " and to_char(creattime, 'yyyy-MM')>=" + "'" + val.starttime + "'";
    }
    if(val.endtime!==undefined){
      filter+= " and to_char(creattime, 'yyyy-MM')<=" + "'" + val.endtime + "'";
    }
    if(val.key!==undefined){
      filter+="and title like "+"'%"+val.key+"%'  ";
    }
    filter+=" order by id desc";
    dispatch({
      type:'monthlymodel/fetch',
      payload:{
        table:'tb_monthly',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { subjectList } = this.props;
      const dataSource=subjectList.data;
      this.setState({dataSource:dataSource});
    });
  };
//上传
  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    if (file.status === 'done') {
      // 服务器返回的图片文件名，临时保存起来，回头提交的时候用
      this.setState({imageUrl:file.response.data});
    }
  };
  render(){
    const { authorization } = getMyHeaders();
    const headers={authorization:authorization};
    const { imageUrl } = this.state;
    const {visible,dataSource,loading,fileList} = this.state;
    const { getFieldDecorator } = this.props.form;


    const columns = [
      {
        title:'月份',
        dataIndex: 'creattime',
        render: val => <span>{val.substr(0,7)}</span>
      },
      {
        title: '工作名称',
        dataIndex: 'title',

      },
      {
        title:'工作内容',
        dataIndex: 'content',
        render:(text)=>{
          if(text.length>20){
            return <span> {text.substring(0,20)+"....."}</span>
          }
          else
            return <span>{text}</span>
        }
      },
      {
        title: '工作时长',
        dataIndex: 'usetime',

      },
      {
        title: '所属街区',
        dataIndex: 'scope',
      },
      {
        title: '任务来源',
        dataIndex: 'cname',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          (dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.handEdit(record.id)}>查看</a>
            </Fragment>
          ) : null),
      },
    ];
    //But,the world become bigger,how do you return?
    //How do you come back when the world gets bigger？
    const img=()=>{
      let attr=[];
      if(fileList.length>0){
        for (let i=0;i<fileList.length;i++){
          attr.push(
            <Col span={5}><img src={fileList[i]} width="150px" height="150px"/></Col>
          )
        }
      }
      const  tableDom = attr.map((ele) => {
        return ele
      });
      return tableDom;
    };
    const form = () => {

      return (
        <Form >
          <Row>
            <Col span={3}>
              <h2>工作名称：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('title', {
                })(
                  <Input size="large" placeholder="请输入月报标题" readOnly="readOnly" />,
                )}
              </Form.Item>
            </Col>
            <Col span={0}>
              <Form.Item>
                {getFieldDecorator('id', {
                })(
                  <Input size="large" hidden="hidden"/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <h2>工作时长：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('usetime', {

                })(
                  <Input size="large" placeholder="请输入工作时长" readOnly="readOnly" />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={3}>
              <h2>所属街道：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('scope', {
                })(
                  <Input size="large"  readOnly="readOnly" />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <h2>任务来源：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('cname', {

                })(
                  <Input size="large"  readOnly="readOnly" />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={3}>
              <h2>工作内容：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {getFieldDecorator('content', {

                })(
                  <TextArea placeholder="请输入月报内容" readOnly="readOnly"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <h2>附件：</h2>
            </Col>
            <Col span={20}>
              <Form.Item>
                {img()}
              </Form.Item>
            </Col>
          </Row>

        </Form>
      );

    };
    return(
      <Layout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Search  dispatch={this.props.dispatch}  setVal={this.setVal}/>
            </div>
            <div className={styles.tableListOperator}>
              <Modal
                width="80%"
                title="月报详情"
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
            <div className={styles.tableSets}>
              月报管理
              <ButtonGroup style={{float:"right"}}>

                <Button onClick={this.handleReset}><Icon type="reload"/>刷新</Button>
                <Button onClick={this.downloadExcel}><Icon type="download"/>下载</Button>
              </ButtonGroup>
            </div>

            <Table
              dataSource={dataSource}
              columns={columns}
              loading={loading}
              pagination={{defaultPageSize:5}}
            />
          </div>
        </Card>
      </Layout>
    )
  }
}
class Search extends PureComponent {
  state = {};
  handleReset=()=>{
    const { form } = this.props;
    form.resetFields();
    const {setVal} = this.props;//重要
    let values={
      starttime:undefined,
      endtime:undefined,
      key:undefined
    };
    setVal(values);

  };
  onValidateForm = (e) => {
    e.preventDefault();
    const {validateFields} = this.props.form;
    const {setVal} = this.props;//重要
    validateFields((err, values) => {
      if (!err) {
        if (values.starttime) {
          values.starttime = values.starttime.format('YYYY-MM');
        }
        if (values.endtime) {
          values.endtime = values.endtime.format('YYYY-MM');
        }
        setVal(values);
      }
    });
  };

  render() {
    const {} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.onValidateForm}>
        <Row>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('starttime', {

              })(
                <MonthPicker format="YYYY-MM" placeholder="请选择起止日期"/>,
              )}
            </Form.Item>

          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('endtime', {})(
                <MonthPicker format="YYYY-MM" placeholder="请选择结束日期"/>,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('key', {

              })(<Input placeholder="输入关键字"/>
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
const testPageForm = Form.create()(monthlyTable);
export default testPageForm;



