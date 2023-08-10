import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigProvider, Layout, theme, Button, Dropdown, Table, Tag, Menu, message, Modal } from "antd";
import Navbar from "./navbar";
import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { confirm } = Modal;
const { Header, Content, Footer, Sider } = Layout;

export default function SimpleTodosList() {
  useEffect(()  => { document.body.classList.remove('login-style'); });
  
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState([]);
  let navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    axios
      .get("http://localhost:5000/sellers/")
      .then((response) => {
        const data = [];
        let options = { year: "numeric", month: "long", day: "numeric" };
        for (let i = 0; i < response.data.length; ++i) {
          data.push({
            key: i.toString(),
            id: response.data[i]._id,
            image: response.data[i].imgUrl,
            name: response.data[i].name,
            dateString: new Date(
              response.data[i].commenceDate
            ).toLocaleDateString("en-US", options),
            phonenumber: response.data[i].phone_number,
            propertyid: response.data[i].propertyId,
            status: [response.data[i].status],
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
          .delete("http://localhost:5000/sellers/delete/" + id)
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
            setTimeout(function() { window.location = "/seller"; }, 1000);
            // window.location.href = "/seller";
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
      key: "name",
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: "Commence Date",
      dataIndex: "dateString",
      key: "dateString",
      sorter: (a, b) => a.dateString - b.dateString,
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: "Property ID",
      dataIndex: "propertyid",
      key: "propertyid",
      sorter: (a, b) => a.length - b.length,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      sorter: (a, b) => a.length - b.length,
      // render: () => <Badge status="success" text="Finished" />,
      render: (status) => (
        <span>
          <Tag
            color={
              status == "Active" ? "green" : status == "Sold" ? "volcano" : "blue"
            }
            key={status}
          >
            {status}
          </Tag>
        </span>
      ),
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
                  (window.location.href = `/updateSeller/${record.id}`),
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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <SidebarBrand />
          <Navbar defaultSelectedKeys={["seller"]} />
        </Sider>
        <Layout>
          <Topbar/>       
          <Content>

            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Seller</h1>
                <a href="/newSeller" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><FontAwesomeIcon color="#FFF" icon={icon({ name: "plus" })}/> Add </a>
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
