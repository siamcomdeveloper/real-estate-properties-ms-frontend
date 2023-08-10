import React, { useState, useEffect } from "react";
import { ConfigProvider, Layout, theme, Form, Input, Button, Space, Upload, message, Progress, Modal } from "antd";
import Navbar from "./navbar";
import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;

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

export default function UpdateRealtor() {
  useEffect(()  => { document.body.classList.remove('login-style'); });

  const [messageApi, contextHolder] = message.useMessage();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [form] = Form.useForm();

  const [data, setData] = useState({
    imgUrl: "",
    name: "",
    email: "",
    phone_number: "",
    rank: "",
    commission_rate: "",
    commission_amount: "",
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/realtors/` + id)
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          imgUrl: response.data.imgUrl,
          name: response.data.name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          rank: response.data.rank,
          commission_rate: response.data.commission_rate,
          commission_amount: response.data.commission_amount,
        }));

        setFileList((prevData) => ([{
          ...prevData,
          url: response.data.imgUrl
        }]));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      rank: data.rank,
      commission_rate: data.commission_rate,
      commission_amount: data.commission_amount,
      imgUrl: data.imgUrl
    });
  }, [data]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  function handleInputOnChange(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    // console.log(newData);
    setData(newData);
  }

  const navigate = useNavigate();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // const [defaultFileList, setDefaultFileList] = useState([]);
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

  function submit() {

    messageApi.open({
      type: 'updating',
      content: 'Updating...',
      duration: 0.5
    });

    axios
      .patch(`${process.env.REACT_APP_API_URL}/realtors/update/` + id, {
        imgUrl: data.imgUrl,
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        rank: data.rank,
        commission_rate: data.commission_rate,
        commission_amount: data.commission_amount,
      })
      .then((result) => {
        console.log(result);
        setTimeout(() => {
          messageApi.open({
            type: 'success',
            content: 'Updated!',
            duration: 1,
          });
        }, 500);
        setTimeout(function() { window.location = "/realtor"; }, 1000);
        // navigate("/realtor");
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
            <Navbar defaultSelectedKeys={["realtor"]} />
          </Sider>
          <Layout>
            <Topbar/>       
            <Content>
              <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 className="h3 mb-0 text-gray-800">Update Realtor</h1>
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
                        onChange={(e) => handleInputOnChange(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone_number"
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
                        onChange={(e) => handleInputOnChange(e)}
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
                        onChange={(e) => handleInputOnChange(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="rank"
                      label="Rank"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      style={{ width: "400px" }}
                    >
                      <Input
                        id="rank"
                        value={data.rank}
                        onChange={(e) => handleInputOnChange(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="commission_rate"
                      label="Commission Rate"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      style={{ width: "400px" }}
                    >
                      <Input
                        id="commission_rate"
                        value={data.commission_rate}
                        onChange={(e) => handleInputOnChange(e)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="commission_amount"
                      label="Total Commission"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      style={{ width: "400px" }}
                    >
                      <Input
                        id="commission_amount"
                        value={data.commission_amount}
                        onChange={(e) => handleInputOnChange(e)}
                      />
                    </Form.Item>
                    <Form.Item style={{ width: 125 }} name='imgUrl' label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
                      <div>
                        <Upload
                          accept="image/*"
                          customRequest={uploadImage}
                          onChange={handleChange}
                          listType="picture-card"
                          // defaultFileList={defaultFileList}
                          className="image-upload-grid"
                          onPreview={handlePreview}
                          fileList={fileList}
                        >
                        {fileList.length >= 1 ? null : <FontAwesomeIcon icon={icon({ name: "plus" })} />}
                        </Upload>
                        {progress > 0 ? <Progress percent={progress} /> : null}
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                          <img
                            alt="example"
                            style={{
                              width: '100%',
                            }}
                            src={previewImage}
                          />
                        </Modal>
                      </div>
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
