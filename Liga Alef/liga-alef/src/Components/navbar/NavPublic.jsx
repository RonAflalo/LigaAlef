import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link } from 'react-router-dom';


const NavPublic = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
      <>
      <div className="pz__navbar-sign">
        <p><Link to="/login">Log in</Link></p>
        <Link to="/signup"><button type="button">Sign up</button></Link>
      </div>
      <div className="pz__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="pz__navbar-menu_container-links-sign">
          <p><Link to="/login">Log in</Link></p>
          <Link to="/signup"><button type="button">Sign up</button></Link>
          </div>
        )}
      </div>
      </>
  );
}

export default NavPublic;