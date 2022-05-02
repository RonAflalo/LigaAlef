import React from 'react';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import aboutImg from '../../Assets/banner2.png';
import './about.css';

const tableD = {
    width: '75%',
  };
  const rowD = {
    width: '150px',
  };
  const colD = {
    width: '450px',
  };

const About = () => {
  return (
      <>
        <div className='pz__about'>
            <table style={tableD}>
                <thead>
                    <tr>
                        <td style={colD}>
                        <p class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0">
                            <span class="rotate-box-icon"><SportsBasketballIcon /></span>
                            <div class="rotate-box-info">
                                <h4>Who We Are?</h4>
                                <p>Ron, Itay And Moshe.</p>
                            </div>
                        </p>
                    </td>
                    <td rowSpan={3}>
                    <div className="pz__about" id="about">
                    <img src={aboutImg} alt='/bannerImg' />
                    </div>
                    </td>
                    </tr>
                    <tr><td>
                        <p class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0.2s">
                            <span class="rotate-box-icon"><SportsSoccerIcon /></span>
                            <div class="rotate-box-info">
                                <h4>What We Do?</h4>
                                <p>3th Year Computer Science Students</p>
                            </div>
                        </p>
                    </td></tr>
                    <tr><td>
                        <p class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0.4s">
                            <span class="rotate-box-icon"><SportsVolleyballIcon /></span>
                            <div class="rotate-box-info">
                                <h4>Why We Do It?</h4>
                                <p>Final Project</p>
                            </div>
                        </p>
                    </td></tr>
                    </thead>
                    </table>
                    </div>
                </>
  )
}

export default About
