import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { HomeOutlined, SolutionOutlined, TeamOutlined, LineChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
  {
      key: 'properties',
      label: <Link to='/property'>Properties</Link>,
      icon: <HomeOutlined />,
  },
  {
    key: 'seller',
    label: <Link to='/seller'>Seller Database</Link>,
    icon: <SolutionOutlined />,
  },
  {
    key: 'realtor',
    label: <Link to='/realtor'>Realtor Database</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: 'report',
    label: <Link to='/report'>Report</Link>,
    icon: <LineChartOutlined />,
  }
];

export default function Navbar(props){
  // console.log(props.defaultSelectedKeys);
  return (
    <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={props.defaultSelectedKeys}
          items={items}
        />
  );
}