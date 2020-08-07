import './App.css';
import 'antd/dist/antd.css';
import React, { createRef } from 'react';
import { Typography, Row, Col, Button, Layout, TimePicker, Checkbox, Input } from 'antd';
import moment from 'moment';
import { GithubOutlined } from '@ant-design/icons';
import { withCookies, Cookies } from 'react-cookie';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import YouTube from 'react-youtube';
const { Footer, Content } = Layout;

interface IProps {
  cookies: Cookies,
}

interface IState {
  nowMoment?: moment.Moment,
  time?: moment.Moment,
  enabled?: boolean,
  youtubeId?: string,
  isPlaying?: boolean,
  autoplay?: boolean,
}

class App extends React.Component<IProps, IState> {

  interval: NodeJS.Timeout | undefined;
  private youtube = createRef<YouTube>()

  constructor(props: any, context: any) {
    super(props, context);

    this.updateTime = this.updateTime.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onEnableChange = this.onEnableChange.bind(this);
    this.onYouTubeChange = this.onYouTubeChange.bind(this);

    this.state = {
      nowMoment: moment(),
      time: this.props.cookies.get('time') ? moment(parseInt(this.props.cookies.get('time'))) : undefined,
      enabled: this.props.cookies.get('enabled') === 'true',
      youtubeId: this.props.cookies.get('youtubeId') ? this.props.cookies.get('youtubeId') : 'kJQP7kiw5Fk',
      isPlaying: false,
      autoplay: this.props.cookies.get('autoplay') === 'true',
    }

    this.props.cookies.set('autoplay', false)
  }

  componentDidMount() {
    this.interval = setInterval(this.updateTime, 200)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  updateTime() {

    let now = moment()

    this.setState({
      nowMoment: now,
    })

    if (this.shouldPlay(now)) {
      this.props.cookies.set('autoplay', true)
      window.location.reload(false);
    }
  }

  shouldPlay(now: moment.Moment) : boolean {
    if (!this.state.enabled) {
      return false
    }

    if (
      now.hours() !== this.state.time?.hours() ||
      now.minutes() !== this.state.time?.minutes() ||
      now.seconds() !== this.state.time?.seconds()
    ) {
      return false
    }

    if (this.state.isPlaying) {
      return false
    }

    return true
  }

  onTimeChange(time: moment.Moment | null, timeString: string) {
    this.setState({
      time: time ? time : undefined,
    })
    this.props.cookies.set('time', time?.valueOf())
  }

  onEnableChange(e: CheckboxChangeEvent) {
    this.setState({
      enabled: e.target.checked,
    })
    this.props.cookies.set('enabled', e.target.checked)
  }

  onYouTubeChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      youtubeId: e.target.value,
    })
    this.props.cookies.set('youtubeId', e.target.value)
  }

  render() {

    return (
      <Layout
        style={{
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Content>
          <Row
            justify='center'
          >
            <Col>
              <Typography.Title level={4}>Simple Web Alarm</Typography.Title>
            </Col>
          </Row>

          <Row
            justify='center'
            style={{
              textAlign: 'center',
            }}
          >
            <Col >
              <Typography.Title level={1}>{this.state.nowMoment?.format('HH')}</Typography.Title>
            </Col>
            <Col >
              <Typography.Title level={1}>:</Typography.Title>
            </Col>
            <Col >
              <Typography.Title level={1}>{this.state.nowMoment?.format('mm')}</Typography.Title>
            </Col>
            <Col >
              <Typography.Title level={1}>:</Typography.Title>
            </Col>
            <Col >
              <Typography.Title level={1}>{this.state.nowMoment?.format('ss')}</Typography.Title>
            </Col>
          </Row>

          <Row justify='center' style={{ padding: 10 }}>
            <Col>
              <Checkbox
                onChange={this.onEnableChange}
                defaultChecked={this.state.enabled}
              >
                Enabled
              </Checkbox>
            </Col>
          </Row>

          <Row justify='center' style={{ padding: 10 }}>
            <Col>
              <TimePicker
                onChange={this.onTimeChange}
                defaultValue={this.state.time}
              />
            </Col>
          </Row>

          <Row justify='center' style={{ padding: 10 }}>
            <Col
              style={{
                margin: 'auto 0%'
              }}
            >
              <Typography.Text>https://www.youtube.com/watch?v=</Typography.Text>
            </Col>
            <Col>
              <Input
                placeholder="Youtube ID"
                defaultValue={this.state.youtubeId}
                onChange={this.onYouTubeChange}
              />
            </Col>
          </Row>

          <Row justify='center' style={{ padding: 10 }}>
            <Col>
              <YouTube
                opts={{
                  playerVars: {
                    autoplay: this.state.autoplay ? 1 : 0,
                  }
                }}
                ref={this.youtube}
                videoId={this.state.youtubeId}
                onPlay={() => { this.setState({ isPlaying: true }) }}
                onPause={() => { this.setState({ isPlaying: false }) }}
                onEnd={() => { this.setState({ isPlaying: false }) }}
              />
            </Col>
          </Row>

        </Content>
        <Footer>
          <Button
            type="link"
            icon={<GithubOutlined />}
          >
            yarencheng/simple-web-alarm
          </Button>
        </Footer>
      </Layout>
    );
  }
}

export default withCookies(App);
