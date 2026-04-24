import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/contact.css'],
  template: `
    <header class="top-nav">
      <div class="logo-container">
        <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo" class="logo">
      </div>
      <nav class="nav-actions">
        <a routerLink="/" class="btn-outline-yellow">Home</a>
      </nav>
    </header>

    <main class="contact-container">
      <section class="page-header">
        <h1>How can we <span class="highlight">help</span> you today?</h1>
        <p>You can always reach out to us for any concerns and for feedback.</p>
      </section>

      <section class="contact-split">
        <div class="card-left">
          <div class="card-img-wrapper">
            <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018054/SIH_image_14_szfx1c.png" alt="Find a therapist illustration" class="card-img">
          </div>
          <div class="card-content">
            <h3>Find a therapist</h3>
            <p>Starting therapy is a confusing and scary time. We're here to make the process easy for you, no matter what.</p>
            <a routerLink="/book-appointment" class="btn-solid-yellow">Find your therapist</a>
          </div>
        </div>

        <div class="form-right">
          <h2>Get in touch</h2>
          <form class="contact-form" (submit)="$event.preventDefault()">
            <div class="input-group"><input type="text" placeholder="Enter Your Name" required></div>
            <div class="input-group"><input type="email" placeholder="Enter Your Email" required></div>
            <div class="input-group phone-group">
              <select class="country-code">
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input type="tel" placeholder="Enter Your Phone Number" class="phone-input" required>
            </div>
            <div class="input-group"><textarea placeholder="Enter Your Message" rows="5" required></textarea></div>
            <div class="submit-wrapper"><button type="submit" class="btn-solid-yellow submit-btn">Send Message</button></div>
          </form>
        </div>
      </section>
    </main>

    <app-footer></app-footer>
  `
})
export class ContactComponent {}
