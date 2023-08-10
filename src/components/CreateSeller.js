import React, { useState, useEffect } from "react";
import { Layout, theme, Form, Input, Button, Space, Upload, DatePicker, ConfigProvider, message, Progress } from "antd";

import Navbar from "./navbar";
import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';

import moment from "moment";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const { Content, Footer, Sider } = Layout;

const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};

export default function CreateSeller() {
  useEffect(()  => { document.body.classList.remove('login-style'); });
  
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState({
    imgUrl: "",
    name: "",
    commenceDate: "",
    email: "",
    phone_number: "",
    propertyId: "",
    status: "",
  });

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    // console.log(newData);
    setData(newData);
  }

  function handleDateChange(date) {
    if (date != null) {
      const newCommenceDate = date.format("YYYY-MM-DD");
      const newData = { ...data };
      newData.commenceDate = newCommenceDate;
      console.log(newData);
      setData(newData);
    }
  }

  function submit() {

    messageApi.open({
      type: 'adding',
      content: 'Adding...',
      duration: 0.5
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/sellers/addNew`, {
        imgUrl: data.imgUrl,
        name: data.name,
        commenceDate: data.commenceDate,
        email: data.email,
        phone_number: data.phone_number,
        propertyId: data.propertyId,
        status: data.status,
      })
      .then((result) => {
        console.log(result);
        setTimeout(() => {
          messageApi.open({
            type: 'success',
            content: 'Added!',
            duration: 1,
          });
        }, 500);
        setTimeout(function() { window.location = "/seller"; }, 1000);
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
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [form] = Form.useForm();
  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);

  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;

    let formData = new FormData();
    formData.append('file', file);
    formData.append('domain', 'POST');
    formData.append('filename', file.name );
    
    console.log(formData);

    const config = {
      headers: { "content-type": "application/json" },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        config
      );
      onSuccess("Ok");
      console.log("server res: ", res);

      const newData = { ...data };
      newData['imgUrl'] = res.data.url;
      console.log(newData);
      setData(newData);

    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
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
                <h1 className="h3 mb-0 text-gray-800">Add New Seller</h1>
                <a href="/newProperty" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><FontAwesomeIcon color="#FFF" icon={icon({ name: "plus" })}/> Add </a>
              </div>
            

              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                }}
              >
                <Form
                  onFinish={() => submit()}
                  form={form}
                  name="validateOnly"
                  layout="vertical"
                  autoComplete="off"
                  style={{ paddingLeft: "50px" }}
                >
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "400px" }}
                  >
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => handle(e)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="Phone Number"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "400px" }}
                  >
                    <Input
                      id="phone_number"
                      value={data.phone_number}
                      onChange={(e) => handle(e)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "400px" }}
                  >
                    <Input
                      id="email"
                      value={data.email}
                      onChange={(e) => handle(e)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="Property ID"
                    label="Property ID"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "400px" }}
                  >
                    <Input
                      id="propertyId"
                      value={data.propertyId}
                      onChange={(e) => handle(e)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="Status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ width: "400px" }}
                  >
                    <Input
                      placeholder="Active/Sold/Pending"
                      id="status"
                      value={data.status}
                      onChange={(e) => handle(e)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="Commence Date"
                    label="Commence Date"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      id="commenceDate"
                      value={moment(data.commenceDate)}
                      onChange={(e) => handleDateChange(e)}
                    />
                  </Form.Item>
                  <Form.Item style={{ width: 125 }} name='imgUrl' label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                      accept="image/*"
                      customRequest={uploadImage}
                      onChange={handleOnChange}
                      listType="picture-card"
                      defaultFileList={defaultFileList}
                      className="image-upload-grid"
                    >
                    {defaultFileList.length >= 1 ? null : <FontAwesomeIcon icon={icon({ name: "plus" })} />}
                    </Upload>
                    {progress > 0 ? <Progress percent={progress} /> : null}
                  </Form.Item>
                  <Form.Item style={{ paddingLeft: "130px" }}>
                    <Space>
                      <SubmitButton form={form} />
                      <Button htmlType="reset">Reset</Button>
                    </Space>
                  </Form.Item>
                </Form>
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
