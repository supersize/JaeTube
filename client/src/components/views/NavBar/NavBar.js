import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import './Sections/Navbar.css';

function NavBar() {
  return (
    <div style={{display: 'inline-block', width : '100%'}}>
      <LeftMenu /> 
      <div style={{ display: 'inline-block'}}>
      <RightMenu />
      </div>  
    </div>
  )
}

export default NavBar