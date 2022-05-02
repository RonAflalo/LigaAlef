import React from 'react';
import logo from "../../Assets/logo3.png";
import './footer.css';

const Footer = () => (
  <div className="pz__footer section__padding">

    <div className="pz__footer-links">
      <div className="pz__footer-links_logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="pz__footer-links_div">
        <h4>Comming Soon</h4>
        <p>Social Media</p>
        <p>Contact Us</p>
      </div>
      <div className="pz__footer-links_div">
        <p>Terms & Conditions </p>
        <p>Privacy Policy</p>
        <p>Contact Us</p>
      </div>
      <div className="pz__footer-links_div">
        <h4>Get in touch</h4>
        <p>Rabenu Yeruham St. 2,</p>
        <p>Tel-Aviv Yaffo,</p>
        <p>Israel</p>
      </div>
    </div>

    <div className="pz__footer-copyright">
      <p>© 2022 Liga Alef. All rights reserved.</p>
    </div>
  </div>
);

export default Footer;