import React, {Component, Fragment, PureComponent} from 'react';
import ExportJsonExcel from 'js-export-excel';

import {
  Divider,
  DatePicker,
  Layout,
  Modal,
  Table,
  Form,
  Input,
  Button,
  Card,
  Col,
  Row,
  Icon,
  Upload,
} from 'antd';
import {connect} from 'dva';
import styles from '../Table.less';
import {
  getCurrentUser,
  getMyHeaders,
  getBase64
} from '../../utils/utils';
import feedbackmodel from '../../models/feedbackmodel';
import { headUrl, RestUrl } from '../../const/localConfig';
const { MonthPicker } = DatePicker;

const { TextArea } = Input;
const ButtonGroup = Button.Group;
const fileUpAction = `${RestUrl}/api/fileUpload`;
@connect(({feedbackmodel,loading}) => ({
  subjectList:feedbackmodel.subjectList,
  subjectBean:feedbackmodel.subjectBean,
  backBean:feedbackmodel.backBean,
  backIds:feedbackmodel.backIds,
  loading:loading.models.feedbackmodel
}))

class feedbackTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      backVisible:false,
      previewVisible: false,
      previewImage: '',
      dataSource: [],
      imageUrl:'',
      fileList:[],
      modelStr:"",
      attachList:[],
      backAttr:[],
      street:"",
      fid:"",
      uid:"",
      status:"insert"
    };
    document.title="问题反馈管理";
  }
  componentDidMount() {
    this.initDataSource();
  }
  //导出
  downloadExcel = () => {
// currentPro 是列表数据
    const { dataSource,backAttr } = this.state;
    var option={};
    let dataTable = [];
    for(let i in dataSource){
      for(let j in backAttr){
        if(dataSource[i].id===backAttr[j].fid){
          dataSource[i].backcontent=backAttr[j].content;
        }
      }
    }

    if (dataSource.length>0) {
      for (let i in dataSource) {
        let obj = {
          '标题': dataSource[i].title,
          '内容': dataSource[i].content,
          '街道': dataSource[i].scope,
          '时间': dataSource[i].creattime,
          '回复内容':dataSource[i].backcontent
        };
        dataTable.push(obj);

      }
    }

    option.fileName = '问题反馈';
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:['标题','内容','街道','时间','回复内容'],
        sheetHeader:['标题','内容','街道','时间','回复内容'],
      }
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel();
  };
  //获取表格数据
  initDataSource=()=>{
   const street=JSON.parse(getCurrentUser()).data.street;
   // const street="北京市";
    const {dispatch} =this.props;
    let filter="select * from tb_feedback ";
    if(street!=="北京市"){
      filter+=" where scope like "+"'%"+street+"%'";
    }
    filter+=" order by id desc";
    dispatch({
      type:'feedbackmodel/fetch',
      payload:{
        table:'tb_feedback',
        action:'select',
        filter:filter
      }
    }).then(() => {
      let ids=[];
      const { subjectList }  = this.props;
      for(let i in subjectList.data){
        ids.push(subjectList.data[i].uid);
      }
      ids=Array.from(new Set(ids));
      let sql='SELECT fid,content from  tb_feedback_back WHERE uid in (';
      for(let i=0;i<ids.length;i++){
        sql+=ids[i];
        if(i!==ids.length-1){
          sql+=",";
        }
      }
      sql+=")";

      dispatch({
        type:'feedbackmodel/queryIDs',
        payload:{
          table:'tb_feedback',
          action:'select',
          filter:sql,
        }
      }).then(() => {
        const { backIds,subjectList }  = this.props;

        for(let i in subjectList.data){
          subjectList.data[i].flag="未回复";
          for(let j in backIds.data){
            if(subjectList.data[i].id===backIds.data[j].fid){
              subjectList.data[i].flag="已回复";
            }
          }
        }
        this.setState({dataSource:subjectList.data,backAttr:backIds.data});

      });
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
  //呼出回复Modal
  showBackModal = () => {
    this.setState({
      backVisible: true,
    });
  };
  //关闭回复modal
  canceBacklModal = () => {
    this.setState({fileList:[],attachList:[]});
    this.setState({
      backVisible: false,
    });
    this.handleReset();
  };
  //关闭modal
  cancelModal = () => {
    this.setState({fileList:[],attachList:[]});
    this.setState({
      visible: false,
    });
  };
  //修改
  handEdit=key=>{
    const {dispatch} =this.props;
    let filter="select * from tb_feedback where id="+key+"";
    dispatch({
      type:'feedbackmodel/queryById',
      payload:{
        table:'tb_feedback',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { subjectBean } = this.props;

      const { title, cname, scope, content,usetime,id,attach,creattime } = subjectBean.data[0];
      let fileList;
      fileList=JSON.parse(attach);
      const img=()=>{
        let attr=[];
        if(fileList.length>0){
          for (let i=0;i<fileList.length;i++){
            attr.push(
              <Col span={6}><img src={fileList[i]} width="90%" height="120px" style={{marginTop:20}}/></Col>
            )
          }
        }
        const  tableDom = attr.map((ele) => {
          return ele
        });
        return tableDom;
      };
      const modelStr=()=>{
        return(
          <div>
            <Row>
              <Col span={3}/>
             <Col span={18}>
            <div className={styles.titleDIv}>
              {title}
            </div>
             </Col>
              <Col span={3}/>
            </Row>
            <Row>
              <Col span={6}/>
              <Col span={6}>
                <div className={styles.scopeDiv}>
                问题街区:{scope}
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.timeDiv}>
                  反馈时间:{creattime}
                </div>
              </Col>
              <Col span={6}/>
            </Row>
            <Row>
            <Col span={3}/>
            <Col span={18}>
            <div className={styles.contentDiv}>
              {content}
            </div>
            </Col>
            <Col span={3}/>
            </Row>
            <Row>
              <Col span={3}/>
              <Col span={18}>
                <div className={styles.contentDiv}>
                  {img()}
                </div>
              </Col>
              <Col span={3}/>
            </Row>
          </div>
          )

      };
      this.setState({fileList:fileList,modelStr:modelStr()});
      this.showModal();
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  //回复
  handBack=key=>{
    const {dispatch} =this.props;
    let filter="select * from tb_feedback_back where fid="+key.id+"and uid="+key.uid+"";
    dispatch({
      type:'feedbackmodel/queryBack',
      payload:{
        table:'tb_feedback_back',
        action:'select',
        filter:filter
      }
    }).then(() => {
      const { backBean } = this.props;

  if(backBean.data[0]!==undefined){
    const {title,content,attach}=backBean.data[0];
    this.props.form.setFieldsValue({
      title,
      content,
    });
    let fileList=[];
    let attachList=[];
    if(attach!==null && attach!==""){
      let attr=JSON.parse(attach);
      for(let i=0;i<attr.length;i++){
        attachList.push(attr[i]);
        fileList.push({
          uid:key+i,
          state:"done",
          url: attr[i],
        })
      }
      this.setState({status:"update"});
    }


    this.setState({ fileList:fileList,attachList:attachList});
  }else {
    this.setState({status:"insert"});
  }
    });
   this.setState({fid:key.id,uid:key.uid});
   this.showBackModal();
  };
  handInsert=()=>{
    const {dispatch} =this.props;
  const {uid,fid,attachList,status}=this.state;

    const {validateFields} = this.props.form;
    let filter;
    validateFields((err, values) => {
      if(status==="insert"){

        filter="insert into tb_feedback_back (title,content,attach,uid,fid) VALUES("+"'"+values.title+"'"+","+"'"+values.content+"'"+","+"'"+JSON.stringify(attachList)+"'"+","
        +uid+","+fid+")";
      }
      else {
        filter="update tb_feedback_back set title = "+"'"+values.title+"'"+" ,content= "+"'"+values.content+"'"+" ,attach="+"'"+JSON.stringify(attachList)+"'"+" where uid ="+
          uid+" and fid = "+fid;
      }
      this.setState({fileList:[],attachList:[]});
      this.canceBacklModal();
      dispatch({
        type:'feedbackmodel/insertBack',
        payload:{
          table:'tb_feedback_back',
          action:'insert',
          filter:filter
        }
      })

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
    let filter="select * from tb_feedback where 1=1 ";
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
      type:'feedbackmodel/fetch',
      payload:{
        table:'tb_feedback',
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

    this.setState({ fileList:fileList });

    if (file.status === 'done') {
      // 服务器返回的图片文件名，临时保存起来，回头提交的时候用
      const {attachList}=this.state;
      attachList.push("http://www.bjcsghxh.com/data/altern/"+file.response.data);
      this.setState({attachList:attachList});
      this.picFile = file.response.data;
    }
  };
  render(){

    const { authorization } = getMyHeaders();
    const headers={authorization:authorization};

    const {visible,backVisible,dataSource,loading,fileList,modelStr,previewVisible,previewImage} = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [

      {
        title: '问题标题',
        dataIndex: 'title',

      },

      {
        title: '所属街区',
        dataIndex: 'scope',
      },
      {
        title:'问题内容',
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
        title: '月份',
        dataIndex: 'creattime',
        render:(text) => {
          return <span>{text.substring(0,7)}</span>
        }
      },
      {
        title: '回复状态',
        dataIndex: 'flag',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          (dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.handEdit(record.id)}>查看</a>
              <Divider type="vertical" />
              <a onClick={() => this.handBack(record)}>回复</a>
            </Fragment>
          ) : null),
      },
    ];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const AvatarView = (
      <div className="clearfix">
        <Upload
          action={fileUpAction}
          headers={headers}
          data={{ attr: 'altern' }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );

    //But,the world become bigger,how do you return?
    //How do you come back when the world gets bigger？

    return(
      <Layout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Search  dispatch={this.props.dispatch}  setVal={this.setVal}/>
            </div>
            <div className={styles.tableListOperator}>
              <Modal
                width="60%"
                title="问题反馈"
                visible={visible}
                destroyOnClose
                onCancel={this.cancelModal}
                mask={false}
                footer={null}
                style={{ paddingTop: 0 }}
              >
                {modelStr}
              </Modal>
              <Modal
                width="60%"
                title="问题回复"
                visible={backVisible}
                destroyOnClose
                onCancel={this.canceBacklModal}
                mask={false}
                footer={null}
                style={{ paddingTop: 0 }}
              >
                <Form>
                  <Row gutter={10}>
                    <Col span={24}>
                      <Form.Item>
                        {getFieldDecorator('content', {
                          rules: [
                            {
                              required: false,
                              message: '请输入回复内容',
                            },
                          ],
                        })(
                          <Input.TextArea
                            placeholder="请输入回复内容"
                            autosize={{ minRows: 6, maxRows: 10 }}
                          />,
                        )}
                      </Form.Item>
                    </Col>

                  </Row>
                  <Row>
                    <Col span={24}>
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
                        <Button size="large" type="primary" onClick={this.handInsert}>提交</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Modal>

            </div>
            <div className={styles.tableSets}>
              问题反馈
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
const feedbackForm = Form.create()(feedbackTable);
export default feedbackForm;



