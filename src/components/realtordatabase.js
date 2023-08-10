import React, { useState, useEffect } from "react";
import axios from "axios";

import { ConfigProvider, Layout, theme, Table, Dropdown, message, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Navbar from "./navbar";

import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const { confirm } = Modal;
const { Content, Footer, Sider } = Layout;

export default function RealtorDatabase() {
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/realtors/`)
      .then((response) => {
        const data = [];
        for (let i = 0; i < response.data.length; ++i) {
          data.push({
            key: i.toString(),
            id: response.data[i]._id,
            image: response.data[i].imgUrl,
            name: response.data[i].name,
            phonenumber: response.data[i].phone_number,
            rank: response.data[i].rank,
            commission_rate: response.data[i].commission_rate,
            commission_amount: response.data[i].commission_amount,
          });
          setData(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {

    confirm({
      icon: <DeleteOutlined />,
      content: <span>Are you sure you want to remove?</span>,
      onOk() {
  
        messageApi.open({
          id,
          type: 'removing',
          content: 'Removing...',
          duration: 0.5
        });
        
        axios
          .delete(`${process.env.REACT_APP_API_URL}/realtors/delete/` + id)
          .then((result) => {
            console.log(result);
            setTimeout(() => {
              messageApi.open({
                id,
                type: 'success',
                content: 'Removed!',
                duration: 1,
              });
            }, 500);
            setTimeout(function() { window.location = "/realtor"; }, 1000);
            // window.location.href = "/realtor";
          })
          .catch((err) => {
            console.log(err);
            setTimeout(() => {
              messageApi.open({
                type: 'error',
                content: 'Error!',
                duration: 2,
              });
            }, 500);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          style={{ width: 40, maxWidth: 40, borderRadius: 50 }}
          src={record.image}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: "Phone number",
      dataIndex: "phonenumber",
      sorter: {
        compare: (a, b) => a.phone - b.phone,
      },
    },
    {
      title: "Rank",
      dataIndex: "rank",
      sorter: {
        compare: (a, b) => a.rank - b.rank,
      },
    },
    {
      title: "Commission Rate",
      dataIndex: "commission_rate",
      sorter: {
        compare: (a, b) => a.rate - b.rate,
      },
    },
    {
      title: "Total Commission",
      dataIndex: "commission_amount",
      sorter: {
        compare: (a, b) => a.commission - b.commission,
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Edit",
                icon: <EditOutlined />,
                onClick: () =>
                  (window.location.href = `/updateRealtor/${record.id}`),
              },
              {
                key: "2",
                label: "Remove",
                danger: true,
                icon: <DeleteOutlined />,
                onClick: (e) => handleDelete(record.id),
              },
            ],
          }}
        >
          <a className="action-dropdown">...</a>
        </Dropdown>
      ),
    },
  ];
  
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const customAntdStyle = { 
    token: 
    { 
      fontFamily: "'.SFNSDisplay-Regular', sans-serif"
    } 
  }
  
  return (
    <ConfigProvider theme={customAntdStyle}>
      {contextHolder}
      <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <SidebarBrand />
          <Navbar defaultSelectedKeys={["realtor"]} />
        </Sider>
        <Layout>
          <Topbar/>       
          <Content>

            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Realtor</h1>
                <a href="/newRealtor" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><FontAwesomeIcon color="#FFF" icon={icon({ name: "plus" })}/> Add </a>
              </div>

              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={data}
                  onChange={onChange}
                />
              </div>
            </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Copyright ©2023 Real Estate Property Inc. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}
