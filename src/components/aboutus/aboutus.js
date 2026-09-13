"use client";

import React from 'react';
import './aboutus.css'; // Import your existing CSS file here

function About() {
  return (
    <div>
      {/* Header Part */}
      <div className="header" id="top_header">
        

        <section className="header-section">
          <div className="center-div">
            <h1 className="font-weight-bold">Welcome to the EduTech Classes</h1>
            <p>Your child can change the world.</p>
            <div className="header-buttons">
              <a href="#">Contact</a>
              <a href="#">Service</a>
            </div>
          </div>
        </section>
      </div>

      {/* Extra Divs */}
      <section className="header-extra-div">
        <div className="container">
          <div className="row" style={{marginLeft:"20%"}}>
            <div className="extra-div col-lg-4 col-md-4 col-12">
              <a href="#"><i className="fa fa-copy fa-2x"></i></a>
              <h2 className="text-uppercase">Learning & Fun</h2>
              <p>A wide variety of activities to stimulate language learning, such as arts and crafts, baking, music.</p>
            </div>
            <div className="extra-div col-lg-4 col-md-4 col-12">
              <a href="#"><i className="fa fa-users fa-2x"></i></a>
              <h2 className="text-uppercase">Qualified Teachers</h2>
              <p>Our experienced teachers encourage children to question, solve problems, and express themselves creatively.</p>
            </div>
            <div className="extra-div col-lg-4 col-md-4 col-12">
              <a href="#"><i className="fas fa-mug-hot fa-2x"></i></a>
              <h2 className="text-uppercase">Healthy Meals</h2>
              <p>Organic food, fresh water, and juice delivered to the kindergarten are available every day.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Statistics Section */}
      <section className="statistics mb-5">
        <div className="container1 headings text-center" style={{display:"relative !important"}}>
          <h1 className="text-center font-weight-bold">Statistics</h1>
          <p>SwasthInfinity was founded as a bridge between traditional Indian wellness and the modern fitness regime.</p>
          <div className="container1 cont-tab d-flex justify-content-around align-items-center text-center">
            <div>
              <i className="fa fa-graduation-cap fa-2x"></i>
              <h1>SwasthAI</h1>
              <p>Real-Time Yoga Monitoring using BodyPose detection model</p>
            </div>
            <div>
              <i className="fa fa-briefcase fa-2x"></i>
              <h1>Virtual Forest</h1>
              <p>Certified Teachers</p>
            </div>
            <div>
              <i className="fa fa-building fa-2x"></i>
              <h1>Personalised Diet Recommendation</h1>
              <p>Encoder Based Classification System on an extensive 180+ recipes with nutrient information</p>
            </div>
            <div>
              <i className="fa fa-user-friends fa-2x"></i>
              <h1>SheFit</h1>
              <p>A section specifically geared towards women's health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-started-page">
        <div className="row">
          <img src="https://i.postimg.cc/HxPJ12nQ/header-bg.jpg" alt="Get Started" />
          <div className="details">
            <h1>Gathered feedback from 175+ potential customers and explored potential partnerships with 5+ fitness centers in New Delhi</h1>
            <p>Join our community of fitness enthusiasts around India helping you succeed holistically</p>
            <button className="btn">Get Started</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
