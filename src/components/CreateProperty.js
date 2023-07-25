import React, { useState } from 'react';
import { Layout, theme, Form, Input, Button, Space, Upload, DatePicker,Radio, Checkbox} from 'antd';
import Navbar from './navbar';
import { PlusOutlined } from '@ant-design/icons';

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
        },
      );
  }, [values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      Submit
    </Button>
  );
};

export default function CreateSeller(){

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

  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

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
        <Header>
          <h5>Add New Property</h5>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
          <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" style={{paddingLeft:'50px', display:'flex'}}>
              <div className='left-wrapper'>
                <Form.Item
                  name="Property Name"
                  label="Property Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{width:'400px'}}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Address"
                  label="Address Line 1"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{width:'400px'}}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Address2"
                  label="Address Line 2"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  style={{width:'400px'}}
                >
                  <Input />
                </Form.Item>
                <div style={{display: 'flex'}}>
                <Form.Item
                  name="City"
                  label="City"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{width:'180px'}}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Postal Code"
                  label="Postal Code"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{width:'180px', marginLeft:'40px'}}
                >
                  <Input />
                </Form.Item>
                </div>
              
                <Form.Item 
                  name="Commence Date"
                  label="Commence Date"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  >
                  <DatePicker />
                </Form.Item>
                <Form.Item label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
                  <Upload action="/upload.do" listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
              <div className='right-wrapper' style={{marginLeft:'100px'}}>
                <Form.Item name="Property Type" label="Property Type"  rules={[{required: true,},]}>
                  <Radio.Group onChange={onChange} value={value}>
                    <Space direction="vertical" style={{paddingLeft:'15px'}}>
                      <Radio value={1}>Condominium</Radio>
                      <Radio value={2}>Townhouse</Radio>
                      <Radio value={3}>Single House</Radio>
                      <Radio value={4}>Duplex</Radio>
                      <Radio value={5}>
                        Other...
                        {value === 5 ? (
                          <Input
                            style={{
                              width: 100,
                              marginLeft: 10,
                            }}
                          />
                        ) : null}
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Amenities" style={{paddingLeft:'5px'}}>
                  <Space direction="vertical" style={{paddingLeft:'10px'}}>
                    <Checkbox>Pool</Checkbox>
                    <Checkbox>Gym</Checkbox>
                    <Checkbox>Sauna / Spa</Checkbox>
                    <Checkbox>Meeting Room</Checkbox>
                    <Checkbox>Games Room</Checkbox>
                    <Checkbox>Guest Suite</Checkbox>
                    <Checkbox>Garage</Checkbox>
                  </Space>
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