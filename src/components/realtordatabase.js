import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Button,Table } from 'antd';
import Navbar from './navbar';


const { Header, Content, Footer, Sider } = Layout;

const columns = [
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render:  () => <img style={{width: 40, maxWidth: 40}} src={'https://img.icons8.com/dusk/2x/customer-insight.png'} />
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: {
      compare: (a, b) => a.name - b.name,
    },
  },
  {
    title: 'Realtor ID',
    dataIndex: 'realtorId',
  },
  {
    title: 'Phone number',
    dataIndex: 'phone',
    sorter: {
      compare: (a, b) => a.phone - b.phone,
    },
  },
  {
    title: 'Rank',
    dataIndex: 'rank',
    sorter: {
      compare: (a, b) => a.rank - b.rank,
    },
  },
  {
    title: 'Commission Rate',
    dataIndex: 'rate',
    sorter: {
      compare: (a, b) => a.rate - b.rate,
    },
  },
  {
    title: 'Total Commission',
    dataIndex: 'commission',
    sorter: {
      compare: (a, b) => a.commission - b.commission,
    },
  },
];


const data = [];
for(let i = 0; i < 30; i++){
  data.push({
    key: crypto.randomUUID(),
    name: 'Joe Black',
    realtorId: `X203422${i}`,
    phone: 2373330092,
    rank: i,
    rate: 0.02,
    commission: 679,
  });
}

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

// const Todo = (props) => (
//   <tr className="d-flex">
//     <td className="col-10">{props.todo}</td>
//     <td className="col-2" style={{ textAlign: 'right' }}>
//       <button
//         onClick={() => {
//           props.editTodo(props.key);
//         }}
//       >
//         Edit
//       </button>
//       {'  '}
//       <button
//         onClick={() => {
//           props.deleteTodo(props.keyt);
//         }}
//       >
//         delete
//       </button>
//     </td>
//   </tr>
// );


export default function RealtorDatabase() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  // const [todos, setTodoList] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get('https://real-estate-properties-ms-backend.onrender.com/activity/')
  //     .then((response) => {
  //       setTodoList(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // const deleteTodo = (id) => {
  //   axios
  //     .delete('https://real-estate-properties-ms-backend.onrender.com/activity/delete/' + id)
  //     .then((response) => {
  //       console.log(response.data);
  //     });

  //   setTodoList(todos.filter((el) => el._id !== id));
  // };

  // const editTodo = (id) => {
  //   window.location = '/update/' + id;
  // };

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
        <Navbar defaultSelectedKeys={['realtor']}/>
      </Sider>
      <Layout>
        <Header style={{display: 'flex'}}>
          <h5>Realtor List</h5>
          <Button type="primary" href='/newRealtor' style={{marginLeft: '30px', marginBottom: '20px'}}>Add New</Button>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} onChange={onChange} />
            {/* <table className="table">
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
            </table> */}
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
