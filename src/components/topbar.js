import React from 'react';
import profileImage from '../img/undraw_profile.svg';

export default function Topbar(){
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link" href="#">
            <span className="mr-2 d-none d-lg-inline text-gray-600">Real Manager</span>
            <img className="img-profile rounded-circle"src={profileImage}/>
          </a>
        </li>
      </ul>
    </nav>
  );
}