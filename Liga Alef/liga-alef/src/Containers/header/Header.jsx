import React from 'react';
import head from '../../Assets/mainbanner.png'
import './header.css';

const Header = () => (
  <>
  <div className="pz__header" id="home">
      <img src={head} alt='/bgimage' />
  </div>
  </>
);

export default Header;