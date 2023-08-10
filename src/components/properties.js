import React, { useState, useEffect } from "react";

import axios from "axios";

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Button, Card, Tag, Col, Row, message, Modal } from "antd";

import Navbar from "./navbar";
import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { right } from "@popperjs/core";

const { confirm } = Modal;
const { Header, Content, Footer, Sider } = Layout;

import propertyImage from '../img/property.jpg';
import profileImage from '../img/undraw_profile.svg';

export default function PropertyList() {
  useEffect(()  => { document.body.classList.remove('login-style'); });

  const [messageApi, contextHolder] = message.useMessage();
  const [properties, setPropertyList] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/property`)
      .then((response) => {
        setPropertyList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (e) => {

    e.preventDefault();
    // console.log('in');
    // console.log(e.target);
    const anchor = event.target.closest("a");
    if (!anchor) return; // Not found. Exit here.
    // console.log(anchor.getAttribute('rel'));
    const id = anchor.getAttribute('rel');
    // console.log(id);

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
          .delete(`${process.env.REACT_APP_API_URL}/property/delete/${id}`)
          .then((result) => {
            // console.log(result);
            setTimeout(() => {
              messageApi.open({
                id,
                type: 'success',
                content: 'Removed!',
                duration: 1,
              });
            }, 500);
            setTimeout(function() { window.location = "/property"; }, 1000);
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

  const handleUpdate = (e) => {

    e.preventDefault();
    // console.log('in');
    // console.log(e.target);
    const anchor = event.target.closest("a");
    if (!anchor) return; // Not found. Exit here.
    // console.log(anchor.getAttribute('rel'));
    const id = anchor.getAttribute('rel');
    // console.log(id);

    messageApi.open({
      id,
      type: 'removing',
      content: 'Removing...',
      duration: 0.5
    });
    
    axios
      .delete(`${process.env.REACT_APP_API_URL}/property/delete/${id}`)
      .then((result) => {
        // console.log(result);
        setTimeout(() => {
          messageApi.open({
            id,
            type: 'success',
            content: 'Removed!',
            duration: 1,
          });
        }, 500);
        setTimeout(function() { window.location = "/property"; }, 1000);
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
  };
  
  const PropertyCard = (props) => (
    <Col span={6}>
      <Card
        className="custom-card-style"
        cover={ <img src={props.property.imgUrl}/>}
        actions={[ <a href={props.updateLink}><EditOutlined key="edit" /></a>, <a href='#' rel={props.keyt} onClick={ handleDelete }><DeleteOutlined key="edit" /></a> ]}
        >
        <div style={{ padding: 20 }}>
          <Row style={{ marginBottom: 10 }}>
            <span>{props.property.name}</span>
          </Row>
  
          <Row style={{ marginBottom: 10 }}>
            <Col span={12}>
              <span>${new Intl.NumberFormat('en-US').format(props.property.price)}</span>
            </Col>
            <Col span={12} style={{ textAlign: right }}>
              <span><Tag color={props.property.status == 1 ? "green" : props.property.status == 2 ? "blue" : (props.property.status == 3 ? "orange" : "gray")} style={{ marginRight: 0 }}>{props.property.status == 1 ? "Active" : props.property.status == 2 ? "Pending" : (props.property.status == 3 ? "Sold" : "Draft")}</Tag></span>
            </Col>
          </Row>
          
          <Row>
            <Col span={6}>
              <span><FontAwesomeIcon icon={icon({ name: "bed" })} />&ensp;{props.property.bedroom}</span>
            </Col>
            <Col span={6}>
              <span><FontAwesomeIcon icon={icon({ name: "bath" })} />&ensp;{props.property.bathroom}</span>
            </Col>
            <Col span={12} style={{ textAlign: right }}>
              <span><FontAwesomeIcon icon={icon({ name: "maximize" })} />&ensp;{new Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(props.property.space)} ft</span>
            </Col>
          </Row>
        </div>
  
        <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, marginBottom: 10, borderTop: '1px solid #f0f0f0' }}>
          <Row>
            <Col span={16}>
              <span className="smaller"><img className="img-profile rounded-circle" width={25} src={profileImage}/>&ensp;Church Chicken</span>
            </Col>
            <Col span={8} style={{ textAlign: right }}>
              <span><FontAwesomeIcon icon={icon({ name: "file" })} />&ensp;No.{props.property.no}</span>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  );

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
          <Navbar defaultSelectedKeys={["properties"]} />
        </Sider>
        <Layout>
          <Topbar/>       
          <Content>

            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Property</h1>
                <a href="/newProperty" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><FontAwesomeIcon color="#FFF" icon={icon({ name: "plus" })}/> Add </a>
              </div>

              <Row gutter={16}>
                {properties.map((property) => {
                  return (
                    <PropertyCard
                      property={property}
                      key={property._id}
                      keyt={property._id}
                      updateLink={'/updateProperty/'+property._id}
                    />
                  );
                })}
              </Row>
              
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
