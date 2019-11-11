import React, { PureComponent } from 'react'
import {Button, Col, Form, Icon, Input, Radio, Row} from 'antd'


class Update extends PureComponent {
  state = {};
  onValidateForm = (e) => {
    const {validateFields} = this.props.form;
    const {setVal} = this.props;//重要
    validateFields((err, values) => {
      if (!err) {
        setVal(values);
        if (values.startDate) {
          values.startDate = values.startDate.format('YYYY-MM-DD');
        }
        if (values.endDate) {
          values.endDate = values.endDate.format('YYYY-MM-DD');
        }
        console.log(values);

      }
    });
  }

  render() {
    const {e} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <Form onSubmit={this.onValidateForm}>
        <Row>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('f', {
                rules: [{
                  required: true,
                  message: '请输入月报标题',
                }],
              })(
                <MonthPicker/>,
              )}
            </Form.Item>

          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('endtime', {})(
                <MonthPicker/>,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('key', {
                rules: [{
                  required: true,
                  message: '请输入工作时长',
                }],
              })(<Input placeholder="输入关键字"/>
              )}
            </Form.Item>
          </Col>
          <Col span={2}>
            <Button type="primary" htmlType="submit">
              <Icon type="search"/>
              查询
            </Button>

          </Col>
          <Col span={2}>
            <Button onClick={this.handleAdd} type="primary" style={{marginLeft: 0}}>
              <Icon type="redo" onClick={this.handleReset}/>重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Update)
