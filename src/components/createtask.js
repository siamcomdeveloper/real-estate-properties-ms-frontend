import React, { useState } from 'react';
import axios from 'axios';
import { Layout, theme } from 'antd';
import Navbar from './navbar';

const { Header, Content, Footer, Sider } = Layout;

export default function CreateTask() {
  const [activity, setOnChangeActivity] = useState(``);

  const onSubmit = (e) => {
    e.preventDefault();
    const activityvar = { activity: activity };

    axios
      .post('https://real-estate-properties-ms-backend.onrender.com/activity/add', activityvar)
      .then((res) => {
        window.location = '/';
      });
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Navbar defaultSelectedKeys={['seller']}/>
      </Sider>
      <Layout>
        <Header>
          <h5>Create New Task</h5>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label>New Task: </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    name="testactivity"
                    value={activity}
                    onChange={(e) => setOnChangeActivity(e.target.value)}
                  />
                </div>
                <br></br>

                <div className="form-group">
                  <input
                    type="submit"
                    value="Create Activity Log"
                    className="btn btn-primary"
                  />
                </div>
              </form>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          {/* Ant Design ©2023 Created by Ant UED */}
        </Footer>
      </Layout>
    </Layout>
  );
}
