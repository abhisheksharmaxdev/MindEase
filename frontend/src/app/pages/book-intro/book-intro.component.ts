import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-book-intro',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/book-intro.css'],
  template: `
    <header class="top-nav">
      <a routerLink="/" class="nav-link">Home</a>
      <a routerLink="/dashboard" class="user-avatar">{{ initials }}</a>
    </header>

    <main class="hero-container">
      <section class="hero-visual">
        <div class="illustration-card">
          <div class="testimonial-box">
            <div class="quote-icon">"</div>
            <p>I felt so relaxed every time I talked with Taehreem. She is probably the kindest human I've ever talked with. I'm so satisfied and happy with my therapist.</p>
            <p class="author">Anonymous</p>
          </div>
        </div>
      </section>

      <section class="hero-content">
        <h1>The <span class="highlight">right therapist</span> is just a few clicks away.</h1>
        <div class="subtext">
          <p>Help us match you to the most suitable expert.</p>
          <p class="highlight-italic">The information you share will remain strictly confidential.</p>
        </div>
        <ul class="feature-list">
          <li><div class="icon-placeholder">1</div><p>Take a few minutes to fill in a simple form so that we can understand you and what troubles you better.</p></li>
          <li><div class="icon-placeholder">2</div><p>Set a schedule according to your convenience.</p></li>
          <li><div class="icon-placeholder">3</div><p>Select a doctor according to your match.</p></li>
        </ul>
        <a routerLink="/book-form" class="cta-button">
          Let's Begin
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      </section>
    </main>

    <app-footer></app-footer>
  `
})
export class BookIntroComponent {
  private readonly authService = inject(AuthService);
  readonly initials = (this.authService.currentUser()?.fullName?.slice(0, 2) || 'ME').toUpperCase();
}
