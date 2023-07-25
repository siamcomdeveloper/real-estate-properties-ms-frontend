import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { HomeOutlined, SolutionOutlined, TeamOutlined, LineChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
  {
      key: 'properties',
      label: <Link to='/'>Properties</Link>,
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
    // <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
    //       <Menu.Item key="1">
    //         <HomeOutlined />
    //           <span>Properties</span>
    //           <Link to="/" />
    //       </Menu.Item>
    //       <Menu.Item key="2">
    //           <UserOutlined/>
    //           <span>Seller Database</span>
    //           <Link to="/create" />
    //       </Menu.Item>
    //       <Menu.Item key="3">
    //           <TeamOutlined />
    //           <span>Realtor Database</span>
    //           <Link to="/create" />
    //       </Menu.Item>
    //       <Menu.Item key="4">
    //           <LineChartOutlined />
    //           <span>Report</span>
    //           <Link to="/report" />
    //       </Menu.Item>
    //   </Menu>
    // <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
    //   <Link to="/" className="navbar-brand">
    //     Todo List Maker
    //   </Link>{' '}
    //   <div className="collpase navbar-collapse">
    //     <ul className="navbar-nav mr-auto">
    //       <li className="navbar-item">
    //         <Link to="/" className="nav-link">
    //           Tasks
    //         </Link>
    //       </li>
    //       <li className="navbar-item">
    //         <Link to="/create" className="nav-link">
    //           Add A Task
    //         </Link>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
}