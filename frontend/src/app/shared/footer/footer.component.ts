import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .footer {
      background-color: #1e123f;
      padding: 80px 5% 20px;
      color: #a6a6a6;
    }

    .footer-container {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .footer-left {
      flex: 1.5;
      min-width: 280px;
    }

    .footer-right {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2rem;
      min-width: 300px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 2rem;
    }

    .footer-logo-img-2 {
      width: 150px;
      height: auto;
      object-fit: contain;
    }

    .footer-logo-img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .footer-logo .divider {
      width: 2px;
      height: 40px;
      background-color: #160829;
    }

    .footer-info-heading {
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .social-icons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .social-icons a img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .footer-left p {
      line-height: 1.6;
      margin: 0 0 1rem;
    }

    .footer-column {
      flex: 1;
      min-width: 150px;
    }

    .footer-column h3 {
      color: #ffffff;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.8rem;
    }

    .footer-links a {
      text-decoration: none;
      color: #a6a6a6;
      transition: color 0.3s ease, padding-left 0.3s ease;
    }

    .footer-links a:hover,
    .footer-policy-links a:hover {
      color: #fbc02d;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom p {
      color: #a6a6a6;
      margin: 0;
    }

    .designer-credit {
      color: #fbc02d;
    }

    .footer-policy-links {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .footer-policy-links a {
      color: #a6a6a6;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .footer-left,
      .footer-right,
      .footer-bottom {
        text-align: center;
        justify-content: center;
      }

      .social-icons,
      .footer-policy-links {
        justify-content: center;
      }
    }
  `],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-left">
          <div class="footer-logo">
            <img
              src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018097/SIH_image_36_avm75b.png"
              alt="Logo 1"
              class="footer-logo-img">
            <div class="divider"></div>
            <img
              src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png"
              alt="MindEase"
              class="footer-logo-img-2">
          </div>
          <div class="footer-info-heading">SOCIAL MEDIA:</div>
          <div class="social-icons">
            <a href="#" title="Twitter">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018098/twitter_h8yn3w.png" alt="Twitter">
            </a>
            <a href="#" title="Facebook">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018024/facebook_fyphvi.png" alt="Facebook">
            </a>
            <a href="#" title="Instagram">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018026/instagram_f1nhkh.png" alt="Instagram">
            </a>
            <a href="#" title="YouTube">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018099/youtube_g81cjx.png" alt="YouTube">
            </a>
          </div>
          <div class="footer-info-heading">ADDRESS:</div>
          <p>ICT - Ganpat University, Mehsana</p>
          <div class="footer-info-heading">SUPPORT HOURS:</div>
          <p>Monday to Saturday | 10:00 AM to 6:00 PM</p>
        </div>
        <div class="footer-right">
          <div class="footer-column">
            <h3>Company</h3>
            <ul class="footer-links">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact Us</a></li>
              <li><a routerLink="/therapist-signup">Therapist Portal</a></li>
              <li><a routerLink="/mindmate">MindMate AI</a></li>
              <li><a routerLink="/privacy-policy">Privacy & Policy</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>About Us</h3>
            <ul class="footer-links">
              <li><a routerLink="/contact">Contact Us</a></li>
              <li><a routerLink="/about">About Us</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>User</h3>
            <ul class="footer-links">
              <li><a routerLink="/dashboard">My Sessions</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 MindEase All rights reserved | Designed & Developed by <span class="designer-credit">Sharma Abhishek</span></p>
        <div class="footer-policy-links">
          <a routerLink="/privacy-policy">Privacy Policy</a>
          <a routerLink="/terms-and-conditions">Terms & Conditions</a>
          <a routerLink="/disclaimer-policy">Disclaimer Policy</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
