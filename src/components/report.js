import React, { useState, useEffect } from "react";
import axios from "axios";
import { ConfigProvider, Layout, theme, message } from "antd";
import Navbar from "./navbar";

import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const { Header, Content, Footer, Sider } = Layout;

const Todo = (props) => (
  <tr className="d-flex">
    <td className="col-10">{props.todo}</td>
    <td className="col-2" style={{ textAlign: "right" }}>
      <button
        onClick={() => {
          props.editTodo(props.keyt);
        }}
      >
        Edit
      </button>
      {"  "}
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
  useEffect(()  => { document.body.classList.remove('login-style'); });

  const [messageApi, contextHolder] = message.useMessage();
  
  const [countActive, setCountActive] = useState(0);
  const [countPending, setCountPending] = useState(0);
  const [countSold, setCountSold] = useState(0);
  const [countDraft, setCountDraft] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);

  const [totalCommision, setTotalCommision] = useState(0);
  const [commision, setCommision] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/property`)
      .then((response) => {
        let active = 0;
        let pending = 0;
        let sold = 0;
        let draft = 0;
        let price = 0;

        for (let i = 0; i < response.data.length; ++i) {
          // console.log('in', response.data[i]);
          if(response.data[i].status == 1){ active++; }
          else if(response.data[i].status == 2){ pending++; }
          else if(response.data[i].status == 3){ sold++; }
          else if(response.data[i].status == 4){ draft++; }

          price += response.data[i].price;
        }

        setCountActive(active);
        setCountPending(pending);
        setCountSold(sold);
        setCountDraft(draft);

        setTotalPrice(price);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/realtors`)
      .then((response) => {
        let rate = 0;
        let amount = 0;

        for (let i = 0; i < response.data.length; ++i) {
          // console.log('in', response.data[i]);
          rate += parseFloat(response.data[i].commission_rate);
          amount += parseInt(response.data[i].commission_amount);
        }

        setCommision(rate);
        setTotalCommision(amount);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <SidebarBrand />
          <Navbar defaultSelectedKeys={["report"]} />
        </Sider>
        <Layout>
          <Topbar/>       
          <Content>

          <div className="container-fluid" style={{ height: '100vh' }}>

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Statistics</h1>
            </div>

            <div className="row" style={{ marginBottom: 30 }}>

              <div className="col mx-1">
                  <div className="card border-left-primary shadow h-100 py-2">
                      <div className="card-body">
                          <div className="row no-gutters align-items-center">
                              <div className="col mr-2">
                                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                      Total Property Value</div>
                                  <div className="h5 mb-0 font-weight-bold text-gray-800">${new Intl.NumberFormat('en-US').format(totalPrice)}</div>
                              </div>
                              <div className="col-auto">
                                  <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "dollar-sign" })}/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col mx-1">
                  <div className="card border-left-success shadow h-100 py-2">
                      <div className="card-body">
                          <div className="row no-gutters align-items-center">
                              <div className="col mr-2">
                                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                      Total Activie Property</div>
                                  <div className="h5 mb-0 font-weight-bold text-gray-800">{countActive}</div>
                              </div>
                              <div className="col-auto">
                                  <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "clipboard-list" })}/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col mx-1">
                  <div className="card border-left-info shadow h-100 py-2">
                      <div className="card-body">
                          <div className="row no-gutters align-items-center">
                              <div className="col mr-2">
                                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Total Pending Property
                                  </div>
                                  <div className="h5 mb-0 font-weight-bold text-gray-800">{countPending}</div>
                              </div>
                              <div className="col-auto">
                                  <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "hourglass" })}/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col mx-1">
                  <div className="card border-left-warning shadow h-100 py-2">
                      <div className="card-body">
                          <div className="row no-gutters align-items-center">
                              <div className="col mr-2">
                                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                      Total Sold Property</div>
                                  <div className="h5 mb-0 font-weight-bold text-gray-800">{countSold}</div>
                              </div>
                              <div className="col-auto">
                                  <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "hand-holding-usd" })}/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="col mx-1">
                  <div className="card border-left-secondary shadow h-100 py-2">
                      <div className="card-body">
                          <div className="row no-gutters align-items-center">
                              <div className="col mr-2">
                                  <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                      Total Draft Property</div>
                                  <div className="h5 mb-0 font-weight-bold text-gray-800">{countDraft}</div>
                              </div>
                              <div className="col-auto">
                                  <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "spinner" })}/>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>

            <div className="row" style={{ marginBottom: 30 }}>
                  <div className="col-6">
                      <div className="card border-left-success shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                      total Realtor Commision</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">${new Intl.NumberFormat('en-US').format(totalCommision)}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "comments-dollar" })}/>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="col-6">
                      <div className="card border-left-primary shadow h-100 py-2">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                          total Realtor Commision %</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{new Intl.NumberFormat('en-US', {minimumFractionDigits: 3}).format(commision)}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon color="#dddfeb" size="3x" icon={icon({ name: "chart-simple" })}/>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
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
