import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Button} from 'antd';
import Navbar from './navbar';

const { Header, Content, Footer, Sider } = Layout;

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Table, Tag } from 'antd';

const items = [
  {
    key: '1',
    label: 'Edit',
  },
  {
    key: '2',
    label: 'Remove',
  },
];

// const expandedRowRender = () => {
//   const columns = [
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Status',
//       key: 'state',
//       render: () => <Badge status="success" text="Finished" />,
//     },
//     {
//       title: 'Upgrade Status',
//       dataIndex: 'upgradeNum',
//       key: 'upgradeNum',
//     },
//     {
//       title: 'Action',
//       dataIndex: 'operation',
//       key: 'operation',
//       render: () => (
//         <Space size="middle">
//           <a>Pause</a>
//           <a>Stop</a>
//           <Dropdown
//             menu={{
//               action,
//             }}
//           >
//             <a>
//               More <DownOutlined />
//             </a>
//           </Dropdown>
//         </Space>
//       ),
//     },
//   ];
//   const data = [];
//   for (let i = 0; i < 3; ++i) {
//     data.push({
//       key: i.toString(),
//       date: '2014-12-24 23:12:00',
//       name: 'This is production name',
//       upgradeNum: 'Upgraded: 56',
//     });
//   }
//   return <Table columns={columns} dataSource={data} pagination={false} />;
// };
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
    key: 'name',
    sorter: (a, b) => a.length - b.length,
  },
  {
    title: 'Commence Date',
    // dataIndex: ['dateString', 'timestamp'],
    dataIndex: 'dateString',
    key: 'dateString',
    // key: 'timestamp',
    // render: (e, params) => {
    //   return 
    //   <div>{params.dateString}</div>
    // },
    sorter: (a, b) => a.dateString - b.dateString,
    // sortOrder: sortedInfo.columnKey === 'timestamp' && sortedInfo.order,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phonenumber',
    key: 'phonenumber',
    sorter: (a, b) => a.length - b.length,
  },
  {
    title: 'Property ID',
    dataIndex: 'propertyid',
    key: 'propertyid',
    sorter: (a, b) => a.length - b.length,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => a.length - b.length,
    // render: () => <Badge status="success" text="Finished" />,
    render: (status) => (
      <span>
        <Tag color={status == 'Active' ? 'green' : status == 'Sold' ? 'blue' : 'volcano'} key={status}>
          {status}
        </Tag>
      </span>
    ),
  },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    render: () => (
        <Dropdown
          menu={{
            items,
          }}
        >
          <a className='action-dropdown'>
            ...
          </a>
        </Dropdown>
    ),
  },
  // {
  //   title: 'Action',
  //   key: 'operation',
  //   render: () => <a>Publish</a>,
  // },
];
const data = [];
let options = { year: 'numeric', month: 'long', day: 'numeric' };
for (let i = 0; i < 20; ++i) {
  data.push({
    key: i.toString(),
    image: '---',
    name: 'Marry Wong',
    dateString: (new Date('2014-12-24 23:12:0')).toLocaleDateString("en-US", options), // September 17, 2016
    // dateString: new Date('2014-12-24 23:12:0'),
    // dateString: new Date('2014-12-24 23:12:0').getTime(),
    phonenumber: '704.555.0127',
    propertyid: 'No.22028',
    status: ['Active'],
  });
}

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
        <Navbar defaultSelectedKeys={['seller']}/>
      </Sider>
      <Layout>
        <Header style={{display: 'flex'}}>
          <h5>Seller List</h5>
          <Button type="primary" href='/newSeller' style={{marginLeft: '30px', marginBottom: '20px'}}>Add New</Button>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} />

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
