import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function Navbar(){
  return (
    <div className="sidebar-brand d-flex align-items-center justify-content-center">
      <div className="sidebar-brand-icon" >
        <FontAwesomeIcon color="#FFF" size="2x" transform={{ rotate: -20 }} icon={icon({ name: "face-laugh-wink" })}/>
      </div>
      <div className="sidebar-brand-text mx-3">Dashboard</div>
    </div>
  );
}