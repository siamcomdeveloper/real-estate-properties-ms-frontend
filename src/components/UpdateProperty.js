import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import axios from "axios";

import dayjs from 'dayjs';

import { ConfigProvider, Layout, theme, Form, Input, Button, Space, Upload, DatePicker, Progress, message, Select, Modal } from 'antd';

import Navbar from './navbar';
import SidebarBrand from './sidebarbrand';
import Topbar from './topbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const { Content, Footer, Sider } = Layout;

const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
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

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  
    
export default function UpdateProperty(){
  useEffect(()  => { document.body.classList.remove('login-style'); });
  
  const [messageApi, contextHolder] = message.useMessage();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  
  const [data, setData] = useState({
    name: "",
    price: "",
    bedroom: "",
    bathroom: "",
    space: "",
    address: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    commenceDate: "",
    status: "",
    imgUrl: ""
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/property/${id}`)
      .then((response) => {
        // console.log('in useEffect get', response);

        setData((prevData) => ({
          ...prevData,
          name: response.data.name,
          price: response.data.price,
          bedroom: response.data.bedroom,
          bathroom: response.data.bathroom,
          space: response.data.space,
          address: response.data.address,
          city: response.data.city,
          stateProvince: response.data.stateProvince,
          postalCode: response.data.postalCode,
          commenceDate: response.data.commenceDate,
          status: response.data.status,
          imgUrl: response.data.imgUrl
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
    // console.log('in useEffect setFieldsValue');
    form.setFieldsValue({
      name: data.name,
      price: data.price,
      bedroom: data.bedroom,
      bathroom: data.bathroom,
      space: data.space,
      address: data.address,
      city: data.city,
      stateProvince: data.stateProvince,
      postalCode: data.postalCode,
      // commenceDate: data.commenceDate,
      status: data.status == 1 ? 'Active' : data.status == 2 ? 'Pending' : data.status == 3 ? 'Sold' : 'Draft',
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
  
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    // console.log(newData);
    setData(newData);
  }

  const handleSelectChange = (value) => {
    // console.log(`selected ${value}`);
    const newData = { ...data };
    newData['status'] = value;
    // console.log(newData);
    setData(newData);
  };

  function handleDateChange(date) {
    if (date != null) {
      const newCommenceDate = date.format("YYYY-MM-DD");
      const newData = { ...data };
      newData.commenceDate = newCommenceDate;
      // console.log(newData);
      setData(newData);
    }
  }

  function submit() {

    messageApi.open({
      type: 'updating',
      content: 'Updating...',
      duration: 0.5
    });

    axios
      .patch(`${process.env.REACT_APP_API_URL}/property/update/${id}`, {
        name: data.name,
        price: data.price,
        bedroom: data.bedroom,
        bathroom: data.bathroom,
        space: data.space,
        address: data.address,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        commenceDate: data.commenceDate,
        status: data.status,
        imgUrl: data.imgUrl
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

  const dateFormat = 'YYYY-MM-DD';

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
                  <h1 className="h3 mb-0 text-gray-800">Update Property</h1>
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
                    style={{paddingLeft:'50px', display:'flex'}}
                  >
                    <div className='left-wrapper'>
                      <Form.Item
                        name="name"
                        label="Property Name"
                        rules={[{ required: true }]}
                        style={{width:'400px'}}
                      >
                        <Input id="name" value={data.name} onChange={(e) => handle(e)}/>
                      </Form.Item>
                      <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true }]}
                        style={{width:'400px'}}
                      >
                        <Input id="address" value={data.address} onChange={(e) => handle(e)}/>
                      </Form.Item>
                      
                      <div style={{display: 'flex'}}>
                        <Form.Item
                            name="city"
                            label="City"
                            rules={[{ required: true }]}
                            style={{width:'180px'}}
                          >
                          <Input id="city" value={data.city} onChange={(e) => handle(e)}/>
                        </Form.Item>
                        <Form.Item
                          name="stateProvince"
                          label="stateProvince"
                          rules={[{ required: true }]}
                          style={{width:'180px', marginLeft:'40px'}}
                        >
                          <Input id="stateProvince" value={data.stateProvince} onChange={(e) => handle(e)}/>
                        </Form.Item>
                      </div>

                      <div style={{display: 'flex'}}>
                        <Form.Item
                          name="postalCode"
                          label="Postal Code"
                          rules={[{ required: true }]}
                          style={{width:'180px'}}
                        >
                          <Input id="postalCode" value={data.postalCode} onChange={(e) => handle(e)}/>
                        </Form.Item>
                      
                        <Form.Item 
                          name="commenceDate"
                          label="Commence Date"
                          rules={[{ required: true }]}
                          style={{width:'180px', marginLeft:'40px'}}
                          >
                            <DatePicker defaultValue={dayjs()} format={dateFormat} />
                          {/* <DatePicker id="commenceDate" value={moment(data.commenceDate)} onChange={(e) => handleDateChange(e)}/> */}
                        </Form.Item>
                      </div>

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
                    </div>

                    <div className='right-wrapper' style={{marginLeft:'100px'}}>
                      <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true }]}
                        style={{width:'200px'}}
                      >
                        <Input type='number' min='0' id="price" value={data.price} onChange={(e) => handle(e)}/>
                      </Form.Item>

                      <Form.Item
                        name="bedroom"
                        label="Bedroom"
                        rules={[{ required: true }]}
                        style={{width:'200px'}}
                      >
                        <Input type='number' min='0' id="bedroom" value={data.bedroom} onChange={(e) => handle(e)}/>
                      </Form.Item>

                      <Form.Item
                        name="bathroom"
                        label="Bathroom"
                        rules={[{ required: true }]}
                        style={{width:'200px'}}
                      >
                        <Input type='number' min='0' id="bathroom" value={data.bathroom} onChange={(e) => handle(e)}/>
                      </Form.Item>

                      <Form.Item
                        name="space"
                        label="Space"
                        rules={[{ required: true }]}
                        style={{width:'200px'}}
                      >
                        <Input type='number' min='0' id="space" value={data.space} onChange={(e) => handle(e)}/>
                      </Form.Item>

                      <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true }]}
                        style={{width:'200px'}}
                      >
                        <Select
                          id="status"
                          style={{ width: 120 }}
                          options={[{ value: '1', label: 'Active' },
                                    { value: '2', label: 'Pending' },
                                    { value: '3', label: 'Sold' },
                                    { value: '4', label: 'Draft' }]}
                          onChange={handleSelectChange}
                        />
                        </Form.Item>
                      
                      <Form.Item style={{marginTop:'100px'}}>
                        <Space>
                          <SubmitButton form={form} />
                          <Button htmlType="reset">Reset</Button>
                        </Space>
                      </Form.Item>

                    </div>
                  </Form>
                </div>
            </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Copyright ©2023 Real Estate Property Inc. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}