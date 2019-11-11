import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Layout,
  Table,
  Form,
  Input,
  Card,
} from 'antd';

import '../subject.less';

const { Search } = Input;

@connect(({ subject, loading }) => ({
  notifyUser: subject.notifyUser,
  loading: loading.models.subject,
}))

class UserData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
    };
    this.key = 0;
    this.current = 1;
  }

  componentDidMount() {
    this.initDataSource({
      table: 'tb_notify',
      action: 'select',
      filter: 'select a.*,b.title from tb_notify a, tb_subject b where a.relationid=b.id',
    });
  }

  searchTitle = value => {
    let filter = `select a.*,b.title from tb_notify a, tb_subject b where a.relationid=b.id and a.name like '%${value}%' order by a.id desc`;
    if (value === '') {
      filter = 'select a.*,b.title from tb_notify a, tb_subject b where a.relationid=b.id order by a.id desc';
    }
    const payload = {
      table: 'tb_notify',
      action: 'select',
      filter,
    }
    this.initDataSource(payload);
  }

  initDataSource = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subject/getNotifyUser',
      payload,
    }).then(() => {
      const { notifyUser: { data } } = this.props;
      const dataSource = data;
      this.setState({ dataSource });
    })
  }


  render() {
    const {
      loading,
      dataSource,
      total } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '联系地址',
        dataIndex: 'addr',
      },
      {
        title: '报名内容',
        dataIndex: 'title',
        width: '40%',
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
            <Search style={{ width: '40%' }} placeholder="姓名查询" onSearch={this.searchTitle} enterButton />
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
            />
          </div>
        </Card>
      </Layout>
    );
  }
}

const UserDataForm = Form.create()(UserData);
export default UserDataForm;
