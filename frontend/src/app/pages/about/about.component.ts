import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/about.css'],
  template: `
    <header class="top-nav">
      <div class="logo-container">
        <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase" class="nav-logo">
      </div>
      <nav class="nav-links"><h1>About Us</h1></nav>
      <div class="nav-actions"><a routerLink="/" class="btn-outline-yellow">Home</a></div>
    </header>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1>Building a generation<br>that sees <span class="highlight">no stigma</span></h1>
          <div class="hero-stats">
            <svg class="curved-arrow" width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 Q 10 80 90 80" stroke="#8c52ff" stroke-width="3" fill="transparent" stroke-linecap="round"/>
              <path d="M80 70 L 90 80 L 80 90" stroke="#8c52ff" stroke-width="3" fill="transparent" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p><span class="highlight-underline">One in 7</span> people in India are affected<br>by mental health issues.</p>
          </div>
        </div>
        <div class="hero-illustration">
          <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018078/SIH_image_21_mocfr5.png" alt="Mental Health Stigma Free">
        </div>
      </section>
      <section class="founders-section">
        <h2 class="section-title">The <span class="highlight">change-makers</span> and founders.</h2>
        <div class="founders-grid">
          <div class="founder-card">
            <div class="founder-header">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776115366/SIH_image_16_jw5jva.png" alt="Shem Williamson" class="founder-img">
              <div class="founder-title"><h3>Shem<br>Williamson</h3><p>Founder & CEO</p></div>
            </div>
            <p class="founder-desc">Shem Williamson leads MindEase, a vision born from addressing virtual student mental health gaps and empowering students with stigma-free access to digital support.</p>
          </div>
          <div class="founder-card">
            <div class="founder-header">
              <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776115325/image-removebg-preview_nf0wbd.png" alt="Arjun Sharma" class="founder-img">
              <div class="founder-title"><h3>Arjun<br>Sharma</h3><p>Co-Founder & CTO</p></div>
            </div>
            <p class="founder-desc">Arjun Sharma co-founded MindEase to transform student support. His expertise keeps the platform user-centric, scalable, and secure for confidential psychological care.</p>
          </div>
        </div>
      </section>
      <section class="stats-section">
        <h2 class="section-title">The MindEase Success.</h2>
        <div class="stats-grid">
          <div class="stat-card"><h3>1500+</h3><p>Students Served</p></div>
          <div class="stat-card"><h3>20+</h3><p>Therapist Network</p></div>
        </div>
      </section>
      <section class="banner-section"><div class="yellow-banner"><p>We are <span class="fw-bold">qualified</span> professionals here to take care of you.</p></div></section>
      <section class="team-features-section">
        <div class="features-content">
          <h2>A team made of <span class="highlight">love,</span><br>empathy, and care.</h2>
          <p class="features-desc">We've created a team that embraces and respects every story to best qualify a match well suited for everyone.</p>
          <p class="features-subtitle">What you'll love about us:</p>
          <ul class="features-list">
            <li><span class="check">✔</span> Care Affiliation</li>
            <li><span class="check">✔</span> Extensively Screened</li>
            <li><span class="check">✔</span> Proven Modalities</li>
            <li><span class="check">✔</span> 10+ major language options</li>
            <li><span class="check">✔</span> Qualified Practitioners</li>
            <li><span class="check">✔</span> Experience across 15+ institutions</li>
            <li><span class="check">✔</span> New Therapy techniques</li>
            <li><span class="check">✔</span> 5 years of average experience</li>
          </ul>
        </div>
        <div class="features-visual">
          <div class="team-visual-box">
            <div class="avatar-bubble pos-1"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018088/SIH_image_30_jkh2b5.png" alt="Team Member"><span class="name-tag">Niharika Singh</span></div>
            <div class="avatar-bubble pos-2"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018091/SIH_image_32_uykp56.png" alt="Team Member"><span class="name-tag">Priya Tiwari</span></div>
            <div class="avatar-bubble pos-3"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018089/SIH_image_31_pv4btb.png" alt="Team Member"><span class="name-tag">Shruti Rajput</span></div>
          </div>
        </div>
      </section>
      <section class="pre-footer-section">
        <div class="pre-footer-left"><h2>A <span class="highlight">team</span> that cares for you and<br>your mental health.</h2></div>
        <div class="pre-footer-right"><p>Your mental health should not be put on hold. That's why we've created a space of India's best practitioners available the moment you need it.</p></div>
      </section>
    </main>

    <app-footer></app-footer>
  `
})
export class AboutComponent {}
