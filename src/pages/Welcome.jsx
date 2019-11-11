import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default () => (
  <PageHeaderWrapper style={{ top: 20 }}>
    <Card>
      <Typography.Text strong>
        欢迎使用责任规划师后台管理平台
      </Typography.Text>
    </Card>
  </PageHeaderWrapper>
);
