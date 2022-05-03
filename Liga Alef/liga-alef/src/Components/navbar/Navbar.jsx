import React, { useState } from 'react';
import NavLogged from './NavLogged';
import NavPublic from './NavPublic';
import logo from "../../Assets/logo.png";
import './navbar.css';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../../Context/AuthContext';

const Menu = () => (
  <>
          <p><Link to="/">Home</Link></p>
          <p><Link to='/about'>About Us</Link></p>
          <p><Link to='/search'>Game Search</Link></p>
          <p><Link to='/games'>My Games</Link></p>
          <p><Link to=' /communities'>Communities</Link></p>
  </>
)

const Navbar = () => {
  return (
    <div className="pz__navbar">
      <div className="pz__navbar-links">
        <div className="pz__navbar-links_logo">
          <img src={logo} alt="logo"/>
        </div>
        <div className="pz__navbar-links_container">
         <Menu />
        </div>
      </div>
      {isLoggedIn() ? <NavLogged /> : <NavPublic />}
      </div>
    
  );
};

export default Navbar;