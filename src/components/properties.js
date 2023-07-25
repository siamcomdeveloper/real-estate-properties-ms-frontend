import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Button } from 'antd';
import Navbar from './navbar';

const { Header, Content, Footer, Sider } = Layout;

const Todo = (props) => (
  <tr className="d-flex">
    <td className="col-10">{props.todo}</td>
    <td className="col-2" style={{ textAlign: 'right' }}>
      <button
        onClick={() => {
          props.editTodo(props.keyt);
        }}
      >
        Edit
      </button>
      {'  '}
      <button
        onClick={() => {
          props.deleteTodo(props.keyt);
        }}
      >
        delete
      </button>
    </td>
  </tr>
);

export default function SimpleTodosList() {
  const [todos, setTodoList] = useState([]);
  useEffect(() => {
    axios
      .get('https://real-estate-properties-ms-backend.onrender.com/activity/')
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteTodo = (id) => {
    axios
      .delete('https://real-estate-properties-ms-backend.onrender.com/activity/delete/' + id)
      .then((response) => {
        console.log(response.data);
      });

    setTodoList(todos.filter((el) => el._id !== id));
  };

  const editTodo = (id) => {
    window.location = '/update/' + id;
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
        <Navbar defaultSelectedKeys={['properties']}/>
      </Sider>
      <Layout>
        <Header style={{display: 'flex'}}>
          <h5>Property List</h5>
          <Button type="primary" href='/newProperty' style={{marginLeft: '30px', marginBottom: '20px'}}>Add New</Button>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => {
                  return (
                    <Todo
                      todo={todo.activity}
                      key={todo._id}
                      keyt={todo._id}
                      deleteTodo={deleteTodo}
                      editTodo={editTodo}
                    />
                  );
                })}
              </tbody>
            </table>
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
