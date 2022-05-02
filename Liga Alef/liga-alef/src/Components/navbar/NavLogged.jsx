import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link } from 'react-router-dom';
import { getUserName } from '../../Context/AuthContext';


const NavLogged = () => {
  return (
      <>
      <div className="pz__navbar-sign">
        <p>Hello {getUserName()}</p>
        <Link to="/dashboard"><button type="button">User Dashboard</button></Link>
      </div>
      </>
  );
}

export default NavLogged;