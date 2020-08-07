import React from 'react';
import { Typography, Row, Col } from 'antd';
import './App.css';

interface IProps {
}

interface IState {

}

export default class App extends React.Component<IProps, IState> {

  render() {
    return (
      <Row
        justify='center'
      >
        <Col
          span={24}
        >
          <Typography.Title
            style={{
              textAlign: 'center',
            }}
          >
            Simple Web Alarm
          </Typography.Title>
        </Col>
      </Row>

    );
  }
}

